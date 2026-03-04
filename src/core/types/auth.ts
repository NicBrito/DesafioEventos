import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export type LoginCredentials = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'A confirmação de senha deve ter no mínimo 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type RegisterCredentials = z.infer<typeof RegisterSchema>;

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}