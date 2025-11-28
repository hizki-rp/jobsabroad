import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initiatePayment, fetchUserDashboard } from '../../services/api'
import { useAuth } from '../auth/AuthContext'
import { getAccessToken } from '../../services/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, CreditCard, Shield, Loader2 } from 'lucide-react'

export default function Payment() {
  const location = useLocation() as any
  const { user } = useAuth()
  const { draftId: stateDraftId, email: stateEmail, needsPayment } = (location.state || {}) as { 
    draftId?: string; 
    email?: string; 
    name?: string;
    needsPayment?: boolean;
  }
  
  const [draftId, setDraftId] = useState<string | null>(stateDraftId || null)
  const [email, setEmail] = useState<string>(stateEmail || user?.email || '')
  const [isLoadingDraft, setIsLoadingDraft] = useState(false)

  // Update email if user is logged in
  useEffect(() => {
    if (user?.email && !stateEmail) {
      setEmail(user.email)
    }
  }, [user, stateEmail])

  const [isPaying, setIsPaying] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // If user is logged in but needs payment, try to get draft_id from dashboard
  useEffect(() => {
    const fetchDraftId = async () => {
      const token = getAccessToken()
      if (needsPayment && token && !draftId) {
        setIsLoadingDraft(true)
        try {
          const dashboardRes = await fetchUserDashboard()
          if (dashboardRes.ok && dashboardRes.draft_id) {
            setDraftId(dashboardRes.draft_id)
          }
          if (dashboardRes.ok && dashboardRes.email) {
            setEmail(dashboardRes.email)
          }
        } catch (error) {
          console.error('Error fetching draft ID:', error)
        } finally {
          setIsLoadingDraft(false)
        }
      }
    }
    fetchDraftId()
  }, [needsPayment, draftId])

  const pay = async () => {
    setIsPaying(true)
    setPaymentError(null)
    try {
      console.log('Initiating payment with:', { draft_id: draftId, email })
      const res = await initiatePayment({ draft_id: draftId, email })
      console.log('Payment response:', res)
      
      // Handle Chapa response structure
      if (res.status === 'success' && res.checkout_url) {
        window.location.href = res.checkout_url
      } else if (res.ok && res.checkout_url) {
        window.location.href = res.checkout_url
      } else {
        // Show detailed error information
        const errorMsg = res.message || res.error || res.detail || `No checkout URL provided. Response: ${JSON.stringify(res)}`
        throw new Error(errorMsg)
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      setPaymentError(err.message || 'An unexpected payment error occurred.')
    } finally {
      setIsPaying(false)
    }
  }

  if (isLoadingDraft) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Loading Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Preparing your payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!draftId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Missing Information</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {needsPayment 
                ? "Unable to find your application. Please complete the application process first."
                : "Application draft not found. Please start the application process again."}
            </p>
            <Button asChild>
              <a href="/apply">Start Application</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[calc(100vh-4rem)] py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Your Application
          </h1>
          <p className="text-lg text-muted-foreground">
            You're just one step away from accessing your personalized job dashboard!
          </p>
        </div>

        <div className="grid gap-6">
          {/* Payment Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Secure Payment
              </CardTitle>
              <CardDescription>
                Complete your payment to unlock access to curated job opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {paymentError && (
                <Alert variant="destructive">
                  <AlertDescription>{paymentError}</AlertDescription>
                </Alert>
              )}

              {/* Features List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Access to personalized job dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Curated job sites for your target country</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Expert guidance and support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Lifetime access to resources</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <Button 
                  onClick={pay} 
                  disabled={isPaying}
                  size="lg"
                  className="w-full text-lg py-6"
                >
                  {isPaying ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Complete Payment
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Your payment is secured with industry-standard encryption</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
