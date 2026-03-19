import { createBrowserRouter, Navigate } from 'react-router';
import { LandingLayout } from './layout/LandingLayout';
import { LandingPage } from './components/landing-page';
import About from './pages/About';
import Docs from './pages/Docs';
import Extension from './pages/Extension';
import Login from './pages/Login';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Projects from './pages/dashboard/Projects';
import Keys from './pages/dashboard/Keys';
import Account from './pages/dashboard/Account';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: 'about', Component: About },
      { path: 'docs', Component: Docs },
      { path: 'extension', Component: Extension },
    ],
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      { index: true, element: <Navigate to="/dashboard/projects" replace /> },
      { path: 'projects', Component: Projects },
      { path: 'keys', Component: Keys },
      { path: 'account', Component: Account },
    ],
  },
]);
