import { BrowserRouter, Routes, Route, useLocation } from 'react-router'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './lib/auth-context'
import Home from './pages/Home'
import Login from './pages/Login'
import About from './pages/About'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import DocsIndex from './pages/docs/DocsIndex'
import DocsApi from './pages/docs/DocsApi'
import DocsExtension from './pages/docs/DocsExtension'
import DocsSDK from './pages/docs/DocsSDK'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import GettingStarted from './pages/dashboard/GettingStarted'
import Projects from './pages/dashboard/Projects'
import ProjectDetail from './pages/dashboard/ProjectDetail'
import Account from './pages/dashboard/Account'
import AutoParser from './pages/dashboard/AutoParser'

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30000, retry: 1 } } })

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/docs" element={<DocsIndex />} />
            <Route path="/docs/api" element={<DocsApi />} />
            <Route path="/docs/extension" element={<DocsExtension />} />
            <Route path="/docs/sdk" element={<DocsSDK />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<GettingStarted />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<ProjectDetail />} />
              <Route path="parser" element={<AutoParser />} />
              <Route path="account" element={<Account />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
