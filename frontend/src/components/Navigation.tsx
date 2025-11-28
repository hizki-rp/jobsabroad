import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/modules/auth/AuthContext'
import { logout, getAccessToken } from '@/services/auth'
import { LogOut, Home, LayoutDashboard, Briefcase } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { fetchUserDashboard } from '@/services/api'

export default function Navigation() {
  const { user, setToken, setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [hasValidSubscription, setHasValidSubscription] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkSubscription = async () => {
      const token = getAccessToken()
      if (!token || !user) {
        setHasValidSubscription(false)
        setIsChecking(false)
        return
      }

      try {
        const dashboardRes = await fetchUserDashboard()
        if (dashboardRes.ok) {
          // Check subscription_status directly (same logic as UserGuard)
          const subscriptionStatus = dashboardRes.subscription_status
          const subscriptionEndDate = dashboardRes.subscription_end_date
          
          let hasActive = subscriptionStatus === 'active'
          
          // Check if subscription hasn't expired
          if (hasActive && subscriptionEndDate) {
            const endDate = new Date(subscriptionEndDate)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            hasActive = endDate >= today
          }
          
          setHasValidSubscription(hasActive)
        } else {
          setHasValidSubscription(false)
        }
      } catch (error) {
        console.error('Error checking subscription:', error)
        setHasValidSubscription(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkSubscription()
  }, [user, location.pathname]) // Re-check when route changes

  const handleLogout = () => {
    logout()
    setToken(null)
    setUser(null)
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path
  const isHomePage = location.pathname === '/'
  const token = getAccessToken()
  const isAuthenticated = token && user
  const shouldShowNav = isAuthenticated && !isChecking && hasValidSubscription

  // Always show navigation on homepage
  // For other pages, only show if user is authenticated and has active subscription
  const shouldShowNavigation = isHomePage || shouldShowNav

  if (!shouldShowNavigation) {
    return null
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border-b border-blue-400/20 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center gap-2 font-bold text-xl text-white hover:opacity-90 transition-all duration-200 group"
          >
            <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
              <Home className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline">NOVA Educational Consultancy</span>
            <span className="sm:hidden">NOVA</span>
          </Link>
          
          <div className="flex items-center gap-3">
            {/* Language Switcher - Always visible */}
            <LanguageSwitcher />
            
            {/* Homepage Navigation */}
            {isHomePage && (
              <>
                <Button 
                  asChild 
                  variant="secondary"
                  size="sm"
                  className="bg-white text-primary hover:bg-white/90 transition-all duration-200 shadow-md"
                >
                  <Link to="/apply" className="flex items-center gap-2 font-semibold">
                    Apply Now
                  </Link>
                </Button>
                {!isAuthenticated && (
                  <Button 
                    asChild 
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 hover:text-white transition-all duration-200"
                  >
                    <Link to="/login" className="flex items-center gap-2">
                      <span className="hidden sm:inline">Login</span>
                      <span className="sm:hidden">Login</span>
                    </Link>
                  </Button>
                )}
              </>
            )}

            {/* Authenticated User Navigation - Only show if user has active subscription */}
            {shouldShowNav && !isHomePage && (
              <>
                <Button 
                  asChild 
                  variant={isActive('/dashboard') ? 'secondary' : 'ghost'} 
                  size="sm"
                  className={cn(
                    "transition-all duration-200",
                    isActive('/dashboard') 
                      ? "bg-white text-primary shadow-md" 
                      : "text-white hover:bg-white/20 hover:text-white"
                  )}
                >
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant={isActive('/sites') ? 'secondary' : 'ghost'} 
                  size="sm"
                  className={cn(
                    "transition-all duration-200",
                    isActive('/sites') 
                      ? "bg-white text-primary shadow-md" 
                      : "text-white hover:bg-white/20 hover:text-white"
                  )}
                >
                  <Link to="/sites" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span className="hidden sm:inline">Job Sites</span>
                  </Link>
                </Button>
                <span className="text-sm text-white/90 hidden lg:inline px-3 font-medium">
                  Welcome, {user.name || user.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-white hover:bg-white/20 hover:text-white transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}