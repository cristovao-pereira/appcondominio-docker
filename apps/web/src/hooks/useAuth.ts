import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Múltiplas tentativas de login de segurança detectadas. Por favor, aguarde 1 minuto.');
        }
        throw new Error(data.message || 'Erro ao realizar login.');
      }

      // Salva dados simulando sessão
      localStorage.setItem('user', JSON.stringify(data));
      
      // Redirecionamento em caso de sucesso
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar login.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
