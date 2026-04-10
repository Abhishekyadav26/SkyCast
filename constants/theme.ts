// Dynamic gradients based on weather condition + time of day
export const GRADIENTS: Record<string, string[]> = {
  sunny: ['#FF6B35', '#F7C59F', '#FFFBF5'],
  cloudy: ['#4A5568', '#718096', '#A0AEC0'],
  rainy: ['#1a1a2e', '#16213e', '#0f3460'],
  stormy: ['#0d0d0d', '#1a1a2e', '#2d2d44'],
  snowy: ['#E8F4FD', '#BEE3F8', '#90CDF4'],
  night: ['#0d0d1a', '#1a1a3e', '#2d2d5e'],
  default: ['#1a1a2e', '#16213e', '#0f3460'],
};

export const COLORS = {
  white: '#ffffff',
  whiteAlpha80: 'rgba(255,255,255,0.8)',
  whiteAlpha60: 'rgba(255,255,255,0.6)',
  whiteAlpha20: 'rgba(255,255,255,0.2)',
  whiteAlpha10: 'rgba(255,255,255,0.1)',
  dark: '#0d0d1a',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.7)',
  textDim: 'rgba(255,255,255,0.4)',
};

export const SIZES = {
  padding: 20,
  radius: 20,
  radiusSm: 12,
};
