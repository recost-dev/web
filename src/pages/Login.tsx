import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/src/lib/auth-context';

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirect = sessionStorage.getItem('ecoapi_redirect') ?? '/dashboard';
      sessionStorage.removeItem('ecoapi_redirect');
      navigate(redirect, { replace: true });
    } else if (!isLoading && !isAuthenticated) {
      navigate('/', { replace: true, state: { openSignIn: true } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return null;
}
