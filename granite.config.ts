import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'lucky-1',
  brand: {
    displayName: '가져봐 1등',
    primaryColor: '#3182F6',
    icon: 'https://static.toss.im/appsintoss/24537/2a2c5894-5380-44a4-ae7d-90423ede5c53.png',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
  webViewProps: {
    type: 'partner', // 비게임
  },
});
