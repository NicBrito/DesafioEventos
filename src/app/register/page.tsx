'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { RegisterCredentials, RegisterSchema } from '@/core/types/auth';
import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.register(data);
      setAuth(response.user, response.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-apple-bg p-4">
      <Card className="w-full max-w-[400px] animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-apple-text tracking-tight">Criar Conta</h1>
          <p className="text-apple-gray text-sm mt-2">Cadastre-se como organizador de eventos</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-apple-gray uppercase ml-1 mb-1 tracking-wider">
              Nome
            </label>
            <Input
              type="text"
              placeholder="Seu nome completo"
              {...register('name')}
              className={errors.name ? 'border-apple-error' : ''}
            />
            {errors.name && (
              <p className="text-apple-error text-[10px] mt-1 ml-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-apple-gray uppercase ml-1 mb-1 tracking-wider">
              E-mail
            </label>
            <Input
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              className={errors.email ? 'border-apple-error' : ''}
            />
            {errors.email && (
              <p className="text-apple-error text-[10px] mt-1 ml-1 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-apple-gray uppercase ml-1 mb-1 tracking-wider">
              Senha
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={errors.password ? 'border-apple-error' : ''}
            />
            {errors.password && (
              <p className="text-apple-error text-[10px] mt-1 ml-1 font-medium">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-apple-gray uppercase ml-1 mb-1 tracking-wider">
              Confirmar Senha
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              className={errors.confirmPassword ? 'border-apple-error' : ''}
            />
            {errors.confirmPassword && (
              <p className="text-apple-error text-[10px] mt-1 ml-1 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-apple bg-apple-error/10 border border-apple-error/20 text-apple-error text-xs font-medium">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>

        <p className="text-center text-xs text-apple-gray mt-6">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-apple-text font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
