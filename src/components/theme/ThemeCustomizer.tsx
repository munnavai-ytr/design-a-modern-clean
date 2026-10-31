'use client';

import { useState } from 'react';
import { useCustomThemeStore } from '@/store/useCustomThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ColorToken } from '@/types/theme';
import { Palette, Save, X, Download, Upload, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultColors: Partial<ColorToken> = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  accent: '#EC4899',
  background: '240 10% 98%',
  foreground: '240 10% 10%',
  border: '240 6% 90%',
  ring: '#6366F1',
  destructive: '0 84% 60%',
  'destructive-foreground': '0 0% 100%',
};

const presetColors = [
  { name: 'Default', primary: '#6366F1', secondary: '#8B5CF6' },
  { name: 'Ocean', primary: '#0EA5E9', secondary: '#38BDF8' },
  { name: 'Forest', primary: '#10B981', secondary: '#34D399' },
  { name: 'Sunset', primary: '#F97316', secondary: '#FB923C' },
  { name: 'Rose', primary: '#E11D48', secondary: '#F43F5E' },
  { name: 'Slate', primary: '#64748B', secondary: '#94A3B8' },
];

export function ThemeCustomizer() {
  const { user } = useAuthStore();
  const { themes, presets, addTheme, setActiveTheme } = useCustomThemeStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-themes' | 'presets' | 'editor'>('my-themes');
  const [colorTokens, setColorTokens] = useState<Partial<ColorToken>>(defaultColors);
  const [themeName, setThemeName] = useState('');
  const [themeDescription, setThemeDescription] = useState('');

  const generateThemeCSS = (tokens: Partial<ColorToken>) => {
    const root = document.documentElement;
    Object.entries(tokens).forEach(([key, value]) => {
      if (value) {
        const cssVar = `--${key}`;
        if (typeof value === 'string') {
          root.style.setProperty(cssVar, value);
        }
      }
    });
  };

  const handleColorChange = (token: keyof ColorToken, value: string) => {
    const newTokens = { ...colorTokens, [token]: value };
    setColorTokens(newTokens);
    generateThemeCSS(newTokens);
  };

  const saveCustomTheme = () => {
    if (!user) return;
    
    const newTheme = {
      id: Math.random().toString(36).substr(2, 9),
      name: themeName || 'My Custom Theme',
      description: themeDescription || 'A custom theme I created',
      userId: user.id,
      isDefault: false,
      isPublic: false,
      tokens: {
        colors: colorTokens,
        spacing: {},
        borderRadius: { '2xl': '1rem' },
        shadows: { soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07)' },
        typography: {
          fontFamily: { sans: 'var(--font-inter)', display: 'var(--font-poppins)' },
          fontSize: {},
          lineHeight: {},
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    addTheme(newTheme);
    setActiveTheme(newTheme.id);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
        aria-label="Customize theme"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl shadow-glow max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-2xl font-bold">Theme Customizer</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('my-themes')}
                className={cn(
                  'flex-1 px-6 py-3 font-medium transition-colors',
                  activeTab === 'my-themes' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                My Themes
              </button>
              <button
                onClick={() => setActiveTab('presets')}
                className={cn(
                  'flex-1 px-6 py-3 font-medium transition-colors',
                  activeTab === 'presets' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Presets
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={cn(
                  'flex-1 px-6 py-3 font-medium transition-colors',
                  activeTab === 'editor' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Editor
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {activeTab === 'my-themes' && (
                <div className="space-y-4">
                  {themes.map((theme: any) => (
                    <div key={theme.id} className="bg-secondary/30 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{theme.name}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setActiveTheme(theme.id)}
                            className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                          >
                            Apply
                          </button>
                          <button className="p-2 rounded-xl hover:bg-destructive/10 text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{theme.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'presets' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {presets.map((preset: any) => (
                    <div key={preset.id} className="bg-secondary/30 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{preset.name}</h3>
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">{preset.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'editor' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Theme Name</label>
                    <input
                      type="text"
                      value={themeName}
                      onChange={(e) => setThemeName(e.target.value)}
                      className="w-full pl-3 py-2 rounded-2xl border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="My Awesome Theme"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={themeDescription}
                      onChange={(e) => setThemeDescription(e.target.value)}
                      className="w-full pl-3 py-2 rounded-2xl border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                      placeholder="A custom theme with dark mode support"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Color Palette</label>
                    <div className="grid grid-cols-3 gap-3">
                      {presetColors.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => {
                            setColorTokens({
                              ...colorTokens,
                              primary: preset.primary,
                              secondary: preset.secondary,
                            });
                          }}
                          className="p-3 rounded-2xl border border-border hover:border-primary transition-colors"
                          style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }}
                        >
                          <span className="text-white text-sm font-medium">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(colorTokens).map(([key]) => (
                      <div key={key}>
                        <label className="block text-xs font-medium mb-1 capitalize">{key}</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={colorTokens[key as keyof ColorToken] as string}
                            onChange={(e) => handleColorChange(key as keyof ColorToken, e.target.value)}
                            className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={colorTokens[key as keyof ColorToken] as string}
                            onChange={(e) => handleColorChange(key as keyof ColorToken, e.target.value)}
                            className="flex-1 pl-3 py-2 rounded-xl border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={saveCustomTheme}
                    className="w-full py-3 px-4 rounded-2xl bg-primary text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Theme
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
