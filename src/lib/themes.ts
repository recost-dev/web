export interface ThemeColors {
  id: string;
  name: string;
  bg: string;
  skyGradient: string;
  horizonGlow: string;
  mistColor: string;
  groundColor1: string;
  groundColor2: string;
  treeBarkGrad: [string, string, string];
  foliageColor: string;
  particleColors: [string, string];
  btnGradient: [string, string];
  btnShadow: string;
  textTitleGrad: [string, string];
  textTagline: string;
}

const GREEN_FOLIAGE = '#2e7d32';

const GALAXY_BG = '#020617';
const GALAXY_SKY = 'linear-gradient(180deg, #0a0a20 0%, #050512 40%, #020617 100%)';
const GALAXY_MIST = 'rgba(10, 10, 32, 0.4)';

export const galaxySunsetTheme: ThemeColors = {
  id: 'galaxy-sunset',
  name: 'Galaxy Sunset',
  bg: GALAXY_BG,
  skyGradient: GALAXY_SKY,
  horizonGlow: '#064e3b',
  mistColor: GALAXY_MIST,
  groundColor1: '#020617',
  groundColor2: '#000000',
  treeBarkGrad: ['#451a03', '#78350f', '#451a03'],
  foliageColor: GREEN_FOLIAGE,
  particleColors: ['rgba(34, 197, 94, 1)', 'rgba(74, 222, 128, 0.8)'],
  btnGradient: ['#16a34a', '#15803d'],
  btnShadow: 'rgba(22, 163, 74, 0.2)',
  textTitleGrad: ['#ffffff', '#4ade80'],
  textTagline: 'rgba(255, 255, 255, 0.9)',
};
