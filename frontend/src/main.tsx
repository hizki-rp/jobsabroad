import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import './index.css'
import MultiStepForm from './modules/apply/MultiStepForm'
import Payment from './modules/payment/Payment'
import PaymentSuccess from './modules/payment/PaymentSuccess'
import Dashboard from './modules/dashboard/Dashboard'
import SitesPage from './modules/sites/SitesPage'
import AuthProvider, { useAuth } from './modules/auth/AuthContext'
import LoginPage from './modules/auth/LoginPage'
import { AdminGuard, UserGuard } from './modules/auth/guards'
import Layout from './components/Layout'
import { LanguageProvider } from './content/LanguageContext'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/" replace />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/apply" element={<MultiStepForm />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <UserGuard>
                    <Dashboard />
                  </UserGuard>
                }
              />
              <Route
                path="/sites"
                element={
                  <UserGuard>
                    <SitesPage />
                  </UserGuard>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <Dashboard />
                  </AdminGuard>
                }
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>
)
