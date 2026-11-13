import { useEffect, useState } from 'react';
import { authClient } from './lib/auth-client';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { FireworksOverlay } from './components/FireworksOverlay';
import { DancingSalad } from './components/DancingSalad';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await authClient.getSession();
        if (error || !data?.user) {
          setUser(null);
        } else {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Erro na verificação de sessão:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Visual de carregamento elegante com paleta Azul Escuro, Amarelo e Cinza
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <DancingSalad size={110} className="mb-4" />
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-slate-900 rounded-full animate-spin" />
          <span>Carregando CARAPETO Nutri&Health System...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <FireworksOverlay />
      
      {!user ? (
        <AuthPage onSuccess={(loggedUser) => setUser(loggedUser)} />
      ) : (
        <Dashboard user={user} onLogout={() => setUser(null)} />
      )}
    </>
  );
}
