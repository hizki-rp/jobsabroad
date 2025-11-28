import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { confirmPaymentAndLogin } from '../../services/api'
import { login, getAccessToken } from '../../services/auth'
import { useAuth } from '../auth/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, Loader2, Lock } from 'lucide-react'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location as any
  const { setToken, setUser } = useAuth()
  
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false)
  const [autoLoginSuccess, setAutoLoginSuccess] = useState(false)
  const [showPasswordLogin, setShowPasswordLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Don't auto-redirect if logged in - we still need to confirm payment
  // The payment confirmation will update the subscription status

  // Extract tx_ref from URL params or state
  // Chapa might send it as 'tx_ref', 'txRef', or in the URL hash
  const searchParams = new URLSearchParams(location.search)
  const hashParams = new URLSearchParams(location.hash.replace('#', ''))
  const txRef = searchParams.get('tx_ref') || 
                searchParams.get('txRef') || 
                hashParams.get('tx_ref') ||
                hashParams.get('txRef') ||
                state?.paymentRef || 
                state?.tx_ref ||
                state?.txRef
  const draftId = state?.draftId

  // First useEffect: Handle payment confirmation
  useEffect(() => {
    // Always confirm payment first, even if user is already logged in
    // This ensures subscription status is updated
    
    if (!txRef || autoLoginAttempted) return

    const confirmPayment = async () => {
      setAutoLoginAttempted(true)
      setLoading(true)
      setError(null)

      console.log('Confirming payment with tx_ref:', txRef)

      try {
        const res = await confirmPaymentAndLogin({ 
          payment_ref: txRef, 
          tx_ref: txRef,
          draft_id: draftId 
        })
        
        console.log('Payment confirmation response:', res)
        
        if (res.ok) {
          // Payment confirmed - subscription should now be updated
          // Update token if new one provided, otherwise keep existing
          if (res.access || res.token) {
            const newToken = res.access || res.token
            localStorage.setItem('auth_access_token', newToken)
            if (res.refresh) {
              localStorage.setItem('auth_refresh_token', res.refresh)
            }
            setToken(newToken)
          }
          
          // Update user info if provided
          if (res.user) {
            setUser({ 
              name: res.user?.name || `${res.user?.first_name || ''} ${res.user?.last_name || ''}`.trim() || res.user?.username,
              email: res.user?.email 
            })
          }
          
          setAutoLoginSuccess(true)
          
          // Verify subscription is active before redirecting
          const verifySubscription = async (retries = 8) => {
            try {
              const { fetchUserDashboard } = await import('../../services/api')
              const dashboardRes = await fetchUserDashboard()
              
              console.log('PaymentSuccess - Verifying subscription:', {
                ok: dashboardRes.ok,
                subscription_status: dashboardRes.subscription_status,
                subscription_end_date: dashboardRes.subscription_end_date,
                retriesLeft: retries
              })
              
              if (dashboardRes.ok) {
                const subscriptionStatus = dashboardRes.subscription_status
                const subscriptionEndDate = dashboardRes.subscription_end_date
                
                let hasActive = subscriptionStatus === 'active'
                if (hasActive && subscriptionEndDate) {
                  const endDate = new Date(subscriptionEndDate)
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  hasActive = endDate >= today
                }
                
                if (hasActive) {
                  console.log('PaymentSuccess - Subscription verified as active, redirecting to dashboard')
                  navigate('/dashboard', { replace: true })
                  return
                }
              }
              
              // If not active and retries left, try again
              if (retries > 0) {
                console.log(`PaymentSuccess - Subscription not active yet (${dashboardRes.subscription_status}), retrying... (${retries} retries left)`)
                setTimeout(() => verifySubscription(retries - 1), 1500) // Increased delay
              } else {
                console.warn('PaymentSuccess - Subscription not active after retries, but payment was confirmed. Redirecting to dashboard - UserGuard will handle verification.')
                // Redirect anyway - UserGuard will verify and retry if needed
                navigate('/dashboard', { replace: true })
              }
            } catch (error) {
              console.error('PaymentSuccess - Error verifying subscription:', error)
              if (retries > 0) {
                setTimeout(() => verifySubscription(retries - 1), 1500)
              } else {
                console.warn('PaymentSuccess - Error after retries, redirecting anyway')
                navigate('/dashboard', { replace: true })
              }
            }
          }
          
          // Start verification after a longer delay to allow backend to process
          setTimeout(() => {
            verifySubscription()
          }, 1000) // Increased initial delay
        } else {
          // Auto-login failed, show password login
          console.warn('Payment confirmation failed:', res)
          setShowPasswordLogin(true)
          if (res.user?.email) {
            setEmail(res.user.email)
          } else {
            // Try to get email from the user who made the payment
            // This might be stored in localStorage from registration
            const storedUser = localStorage.getItem('auth_user')
            if (storedUser) {
              try {
                const user = JSON.parse(storedUser)
                setEmail(user.email || '')
              } catch (e) {
                console.error('Error parsing stored user:', e)
              }
            }
          }
          setError(res.error || res.message || 'Payment confirmed but auto-login failed. Please log in with your password.')
        }
      } catch (err: any) {
        console.error('Auto-login error:', err)
        // Try to extract email from error or show login form
        setShowPasswordLogin(true)
        const storedUser = localStorage.getItem('auth_user')
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser)
            setEmail(user.email || '')
          } catch (e) {
            console.error('Error parsing stored user:', e)
          }
        }
        setError(err?.message || 'Please log in with your password to access your account.')
      } finally {
        setLoading(false)
      }
    }

    confirmPayment()
  }, [txRef, draftId, autoLoginAttempted, setToken, setUser, navigate])

  // Second useEffect: Handle case where tx_ref is missing but payment might be successful
  useEffect(() => {
    if (!txRef && !autoLoginAttempted && !showPasswordLogin) {
      const timeout = setTimeout(async () => {
        console.warn('No tx_ref found in URL, checking if user is already logged in and has active subscription')
        setAutoLoginAttempted(true)
        
        // Check if user is already logged in
        const currentToken = getAccessToken()
        if (currentToken) {
          try {
            // Check if subscription is already active
            const { fetchUserDashboard } = await import('../../services/api')
            const dashboardRes = await fetchUserDashboard()
            
            if (dashboardRes.ok) {
              const subscriptionStatus = dashboardRes.subscription_status
              const subscriptionEndDate = dashboardRes.subscription_end_date
              
              let hasActive = subscriptionStatus === 'active'
              if (hasActive && subscriptionEndDate) {
                const endDate = new Date(subscriptionEndDate)
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                hasActive = endDate >= today
              }
              
              if (hasActive) {
                console.log('PaymentSuccess - Subscription already active, redirecting to dashboard')
                navigate('/dashboard', { replace: true })
                return
              }
            }
          } catch (error) {
            console.error('Error checking subscription:', error)
          }
        }
        
        // If no active subscription, show password login
        setShowPasswordLogin(true)
        setLoading(false)
        setError('Payment reference not found. If you completed payment, please log in - your subscription will be activated automatically.')
        
        // Try to get email from stored user data
        const storedUser = localStorage.getItem('auth_user')
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser)
            setEmail(user.email || '')
          } catch (e) {
            console.error('Error parsing stored user:', e)
          }
        }
      }, 3000) // Reduced timeout to 3 seconds
      
      return () => clearTimeout(timeout)
    }
  }, [txRef, autoLoginAttempted, showPasswordLogin, navigate])

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email and password')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await login(email, password)
      const token = getAccessToken()
      if (token) {
        setToken(token)
        
        // After login, verify subscription status (backend should auto-update if payment exists)
        // Give backend a moment to process, then check subscription
        setTimeout(async () => {
          try {
            const { fetchUserDashboard } = await import('../../services/api')
            const dashboardRes = await fetchUserDashboard()
            
            if (dashboardRes.ok) {
              const subscriptionStatus = dashboardRes.subscription_status
              console.log('PaymentSuccess - After login, subscription status:', subscriptionStatus)
              
              // If subscription is active, navigate to dashboard
              // Otherwise, UserGuard will handle redirecting to payment if needed
              if (subscriptionStatus === 'active') {
                navigate('/dashboard', { replace: true })
              } else {
                // Give backend more time to update subscription, then navigate
                // UserGuard will retry checking subscription
                setTimeout(() => {
                  navigate('/dashboard', { replace: true })
                }, 2000)
              }
            } else {
              navigate('/dashboard', { replace: true })
            }
          } catch (error) {
            console.error('Error checking subscription after login:', error)
            navigate('/dashboard', { replace: true })
          }
        }, 1000)
      } else {
        throw new Error('Login failed - no token received')
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please try again.')
      setLoading(false)
    }
  }

  // Show success message while redirecting
  if (autoLoginSuccess) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">
              Payment Successful! 🎉
            </CardTitle>
            <CardDescription className="text-lg">
              Your payment has been confirmed. Redirecting to your dashboard...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Logging you in...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show password login form if auto-login failed
  if (showPasswordLogin) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">
              Payment Successful! 🎉
            </CardTitle>
            <CardDescription className="text-lg">
              Please log in with your password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Log In to Dashboard
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading state while attempting auto-login
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">
            Payment Successful! 🎉
          </CardTitle>
          <CardDescription className="text-lg">
            Thank you for your payment. We're setting up your account now.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Confirming payment and logging you in...</span>
            </div>
            {!txRef && (
              <p className="text-sm text-muted-foreground">
                If this takes too long, you'll be prompted to log in manually.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
