import { AuthResponse, LoginCredentials, RegisterCredentials, StoredUser } from '@/core/types/auth';

const USERS_STORAGE_KEY = 'registered_users';

const DEFAULT_ADMIN: StoredUser = {
  id: '1',
  name: 'Organizador Master',
  email: 'admin@evento.com',
  password: '123456',
};

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
}

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check default admin
        if (
          credentials.email === DEFAULT_ADMIN.email &&
          credentials.password === DEFAULT_ADMIN.password
        ) {
          resolve({
            user: { id: DEFAULT_ADMIN.id, name: DEFAULT_ADMIN.name, email: DEFAULT_ADMIN.email },
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          });
          return;
        }

        // Check registered users
        const users = getStoredUsers();
        const found = users.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (found) {
          resolve({
            user: { id: found.id, name: found.name, email: found.email },
            token: `token_${found.id}_${Date.now()}`,
          });
        } else {
          reject(new Error('Credenciais inválidas.'));
        }
      }, 800);
    });
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const allEmails = [
          DEFAULT_ADMIN.email,
          ...getStoredUsers().map((u) => u.email),
        ];

        if (allEmails.includes(credentials.email)) {
          reject(new Error('Este e-mail já está cadastrado.'));
          return;
        }

        const newUser: StoredUser = {
          id: `user_${Date.now()}`,
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        };

        const users = getStoredUsers();
        saveStoredUsers([...users, newUser]);

        resolve({
          user: { id: newUser.id, name: newUser.name, email: newUser.email },
          token: `token_${newUser.id}_${Date.now()}`,
        });
      }, 800);
    });
  },
};