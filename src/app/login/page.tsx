'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginCredentials } from '@/core/types/auth';
import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(data);
      setAuth(response.user, response.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Credenciais inválidas. Tente novamente.'); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-apple-bg p-4">
      <Card className="w-full max-w-[400px] animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-apple-text tracking-tight">Evento Painel</h1>
          <p className="text-apple-gray text-sm mt-2">Acesse sua conta de organizador</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-apple-gray uppercase ml-1 mb-1 tracking-wider">E-mail</label>
            <Input
              type="email"
              placeholder="admin@evento.com"
              {...register('email')}
              className={errors.email ? 'border-apple-error' : ''}
            />
            {errors.email && <p className="text-apple-error text-[10px] mt-1 ml-1 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-apple-gray uppercase ml-1 mb-1 tracking-wider">Senha</label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={errors.password ? 'border-apple-error' : ''}
            />
            {errors.password && <p className="text-apple-error text-[10px] mt-1 ml-1 font-medium">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="p-3 rounded-apple bg-apple-error/10 border border-apple-error/20 text-apple-error text-xs font-medium">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </div>
  );
}