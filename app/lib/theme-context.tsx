'use client';

import { createContext, useContext, ReactNode } from 'react';
import { ThemeColors, galaxySunsetTheme } from './themes';

const ThemeContext = createContext<ThemeColors>(galaxySunsetTheme);

export function ThemeProvider({ theme, children }: { theme: ThemeColors; children: ReactNode }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
