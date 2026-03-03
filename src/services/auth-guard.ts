export function ensureAuthenticatedRequest() {
  if (typeof window === 'undefined') return;

  const cookieToken = document.cookie
    .split('; ')
    .find((cookieItem) => cookieItem.startsWith('auth-token='))
    ?.split('=')[1];

  const storageToken = (() => {
    try {
      const rawStorage = localStorage.getItem('auth-storage');
      if (!rawStorage) return null;
      const parsedStorage = JSON.parse(rawStorage) as { state?: { token?: string | null } };
      return parsedStorage?.state?.token ?? null;
    } catch {
      return null;
    }
  })();

  if (!cookieToken && !storageToken) {
    throw new Error('Não autenticado. Faça login para continuar.');
  }
}
