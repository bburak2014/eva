import { useState } from 'react';

export default function useAuth() {
  const [isLoggedIn] = useState<boolean>(() => {
    const token = localStorage.getItem('access_token');
    return Boolean(token);
  });

  return { isLoggedIn };
}
