// src/shared/hooks/useAuth.ts
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

export default function useAuth() {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const isLoggedIn = Boolean(
    accessToken  
  );
  return { isLoggedIn };
}


