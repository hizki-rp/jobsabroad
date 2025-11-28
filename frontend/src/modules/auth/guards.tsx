import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAccessToken, isAdminToken } from '../../services/auth';
import { fetchUserDashboard } from '../../services/api';

export const AdminGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = getAccessToken();
  if (!token || !isAdminToken(token)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const UserGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = getAccessToken();
  const [allowed, setAllowed] = React.useState<boolean | null>(null);
  const [needsPayment, setNeedsPayment] = React.useState(false);
  const [draftId, setDraftId] = React.useState<string | null>(null);
  const retryCountRef = React.useRef(0);

  React.useEffect(() => {
    let mounted = true;
    retryCountRef.current = 0;
    const maxRetries = 5; // Increased retries for payment processing delay
    
    const checkSubscription = async (isRetry = false) => {
      if (!token) {
        if (mounted) setAllowed(false);
        return;
      }
      
      try {
        const dashboardRes = await fetchUserDashboard();
        console.log('UserGuard - Dashboard response:', {
          ok: dashboardRes.ok,
          subscription_status: dashboardRes.subscription_status,
          subscription_end_date: dashboardRes.subscription_end_date,
          retryCount: retryCountRef.current
        });
        
        // Check if request was successful
        if (!dashboardRes.ok) {
          // Retry on API errors
          if (retryCountRef.current < maxRetries) {
            retryCountRef.current++;
            console.log(`UserGuard - API error, retrying... (${retryCountRef.current}/${maxRetries})`);
            setTimeout(() => {
              if (mounted) checkSubscription(true);
            }, 2000);
            return;
          }
          if (mounted) {
            setAllowed(false);
            setNeedsPayment(true);
          }
          return;
        }

        // Check subscription_status directly since should_prompt_payment is hardcoded to False in backend
        // Only allow access if subscription_status is 'active' and not expired
        const subscriptionStatus = dashboardRes.subscription_status;
        const subscriptionEndDate = dashboardRes.subscription_end_date;
        
        // If subscription is 'none' but user might have paid, check for recent payments
        // The backend dashboard endpoint should auto-update subscription if payment exists
        // But we'll give it a moment and retry
        if (subscriptionStatus === 'none' && retryCountRef.current === 0) {
          console.log('UserGuard - Subscription is none, backend should check for payments. Will retry after delay.')
        }
        
        // Check if subscription is active and not expired
        let hasActiveSubscription = subscriptionStatus === 'active';
        
        // If there's an end date, check if it's in the future
        if (hasActiveSubscription && subscriptionEndDate) {
          const endDate = new Date(subscriptionEndDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          hasActiveSubscription = endDate >= today;
        }
        
        console.log('UserGuard - Subscription check:', {
          subscription_status: subscriptionStatus,
          subscription_end_date: subscriptionEndDate,
          hasActiveSubscription,
          isRetry,
          retryCount: retryCountRef.current
        });

        if (hasActiveSubscription) {
          if (mounted) {
            setAllowed(true);
            setNeedsPayment(false);
          }
        } else {
          // If subscription is not active, retry a few times (in case payment was just processed)
          // Retry for any non-active status, not just 'none'
          if (retryCountRef.current < maxRetries) {
            retryCountRef.current++;
            console.log(`UserGuard - Subscription not active (${subscriptionStatus}), retrying... (${retryCountRef.current}/${maxRetries})`);
            setTimeout(() => {
              if (mounted) checkSubscription(true);
            }, 2000); // Increased delay to 2 seconds
            return;
          }
          
          // User needs to complete payment - redirect to payment page
          console.log('UserGuard - Payment required after retries. Redirecting to payment page.');
          if (mounted) {
            setAllowed(false);
            setNeedsPayment(true);
            // Store draft_id if available for payment page
            if (dashboardRes.draft_id) {
              setDraftId(dashboardRes.draft_id);
            }
          }
        }
      } catch (e) {
        console.error('UserGuard - Error checking subscription:', e);
        // Retry on error if we haven't exceeded max retries
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          console.log(`UserGuard - Error occurred, retrying... (${retryCountRef.current}/${maxRetries})`);
          setTimeout(() => {
            if (mounted) checkSubscription(true);
          }, 2000);
        } else if (mounted) {
          setAllowed(false);
          setNeedsPayment(true);
        }
      }
    };
    
    checkSubscription();
    return () => { mounted = false; };
  }, [token]);

  if (allowed === null) {
    // Show loading spinner while checking
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Checking subscription status...</p>
        </div>
      </div>
    );
  }

  if (needsPayment) {
    // Redirect to payment page with draft_id if available
    return (
      <Navigate 
        to="/payment" 
        replace 
        state={{ draftId: draftId || 'temp', needsPayment: true }}
      />
    );
  }

  if (!allowed) return <Navigate to="/login" replace />;
  return children;
};
