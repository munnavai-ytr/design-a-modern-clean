export interface ColorToken {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  'card-foreground': string;
  popover: string;
  'popover-foreground': string;
  muted: string;
  'muted-foreground': string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  'destructive-foreground': string;
}

export interface DesignTokens {
  colors: Partial<ColorToken>;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  typography: {
    fontFamily: {
      sans: string;
      display: string;
    };
    fontSize: Record<string, string>;
    lineHeight: Record<string, string>;
  };
}

export interface CustomTheme {
  id: string;
  name: string;
  description: string;
  userId: string;
  isDefault: boolean;
  isPublic: boolean;
  tokens: DesignTokens;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  author: string;
  tags: string[];
  tokens: DesignTokens;
  isBuiltIn: boolean;
  downloadCount: number;
  rating: number;
  createdAt: Date;
}
