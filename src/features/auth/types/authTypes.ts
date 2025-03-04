export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    ApiStatus: boolean;
    ApiStatusCode: number;
    Data: {
      AccessToken: string;
      TokenType: string;
      ExpiresAt: string;
  
    };
  }
  export interface UserInformationResponse {
    Data: {
      user: {
        store: {
          storeId: string;
          marketplaceName: string;
          // other store properties if needed
        }[];
        email: string;
       };
     };
  }

  export interface LoginValues {
    email: string;
    password: string;
  }

  export interface AuthState {
    accessToken: string | null;
    expiresAt: string | null;
}