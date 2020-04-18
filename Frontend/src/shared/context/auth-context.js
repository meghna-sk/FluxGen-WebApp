import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  managerId: null,
  login: () => {},
  logout: () => {}
});
