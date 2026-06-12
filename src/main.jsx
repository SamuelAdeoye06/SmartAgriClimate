import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './Dashboard.css'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import { BrowserRouter } from 'react-router-dom'
import { FarmerProvider, AdminProvider } from './context/DashboardContext'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FarmerProvider>
          <AdminProvider>
            <App />
          </AdminProvider>
        </FarmerProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)