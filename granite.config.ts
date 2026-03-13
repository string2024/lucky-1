import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'lucky-1',
  brand: {
    displayName: '가져봐 1등',
    primaryColor: '#3182F6',
    icon: '', // TODO: 토스 콘솔 앱 정보에서 아이콘 이미지 우클릭 → URL 복사 후 입력
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'tsc -b && vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
  webViewProps: {
    type: 'partner', // 비게임
  },
});
