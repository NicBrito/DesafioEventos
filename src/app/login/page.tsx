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
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const response = await AuthService.login(data);
      setAuth(response.user, response.token);
      router.push('/dashboard');
    } catch (err: any) {
      setServerError(err.message || 'Erro ao realizar login.'); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-apple-bg p-4">
      <Card className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-apple-text">Painel do Organizador</h1>
          <p className="text-apple-gray text-sm mt-2">Entre com suas credenciais</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-apple-gray uppercase ml-1 mb-1">E-mail</label>
            <Input
              type="email"
              placeholder="exemplo@email.com"
              {...register('email')}
              className={errors.email ? 'border-apple-error' : ''}
            />
            {errors.email && <p className="text-apple-error text-xs mt-1 ml-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-apple-gray uppercase ml-1 mb-1">Senha</label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={errors.password ? 'border-apple-error' : ''}
            />
            {errors.password && <p className="text-apple-error text-xs mt-1 ml-1">{errors.password.message}</p>}
          </div>

          {serverError && (
            <div className="p-3 rounded-apple bg-apple-error/10 border border-apple-error/20 text-apple-error text-sm">
              {serverError}
            </div>
          )}

          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? 'Autenticando...' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </div>
  );
}