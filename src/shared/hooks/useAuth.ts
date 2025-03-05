// src/shared/hooks/useAuth.ts
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

export default function useAuth() {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  console.log('useAuth:', accessToken);
  const isLoggedIn = Boolean(
    accessToken  
  );
  return { isLoggedIn };
}

// import { useState } from 'react';

// export default function useAuth() {
//   const [isLoggedIn] = useState<boolean>(() => {
//     const token = localStorage.getItem('access_token');
//     return Boolean(token);
//   });

//   return { isLoggedIn };
// }
