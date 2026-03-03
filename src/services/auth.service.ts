import { LoginCredentials, AuthResponse } from '@/core/types/auth';

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'admin@evento.com' && credentials.password === '123456') {
          resolve({
            user: { id: '1', name: 'Organizador Master', email: credentials.email },
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          });
        } else {
          reject(new Error('Credenciais inválidas.'));
        }
      }, 800);
    });
  }
};