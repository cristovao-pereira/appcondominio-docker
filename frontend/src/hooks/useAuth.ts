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
      // Simula uma chamada de autenticação
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!email || pass.length < 6) {
        throw new Error('E-mail inválido ou senha muito curta (mínimo 6 caracteres).');
      }

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
