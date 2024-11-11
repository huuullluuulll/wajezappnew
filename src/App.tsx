import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from './components/auth/LoginForm';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Library } from './pages/Library';
import { Categories } from './pages/Categories';
import { BookDetails } from './pages/BookDetails';
import { Progress } from './pages/Progress';
import { Playlists } from './pages/Playlists';
import { PlaylistDetails } from './pages/PlaylistDetails';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';
import { profileApi } from './lib/api';
import type { User } from './types/supabase';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000
    }
  }
});

const App = () => {
  const { user, setUser, setProfile } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user as User | null ?? null);
      if (session?.user) {
        profileApi.getProfile(session.user.id).then(profile => {
          setProfile(profile);
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as User | null ?? null);
      if (session?.user) {
        profileApi.getProfile(session.user.id).then(profile => {
          setProfile(profile);
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setProfile]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-[#1A1A1A]">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/library"
              element={user ? <Library /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/categories"
              element={user ? <Categories /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/books/:id"
              element={user ? <BookDetails /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/progress"
              element={user ? <Progress /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/playlists"
              element={user ? <Playlists /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/playlists/:slug"
              element={user ? <PlaylistDetails /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;