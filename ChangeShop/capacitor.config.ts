import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.changeshop.app',
  appName: 'ChangeShop',
  webDir: 'www', // Pon 'www' porque así lo tienes en tu angular.json
  server: {
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;
