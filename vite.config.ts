/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import dts from 'vite-plugin-dts';
import { copyFileSync, mkdirSync } from 'node:fs';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Plugin to copy theme CSS files to dist/themes
function copyThemesPlugin() {
  return {
    name: 'copy-themes',
    writeBundle() {
      const themesDir = path.join(dirname, 'dist', 'themes');
      const srcThemesDir = path.join(dirname, 'src', 'themes');
      
      try {
        mkdirSync(themesDir, { recursive: true });
        
        const themeFiles = ['minimal.css', 'material.css', 'bootstrap.css', 'dark.css'];
        themeFiles.forEach(file => {
          const src = path.join(srcThemesDir, file);
          const dest = path.join(themesDir, file);
          
          try {
            copyFileSync(src, dest);
            console.log(`Copied ${file} to dist/themes/`);
          } catch (error) {
            console.error(`Failed to copy ${file}:`, error.message);
            throw error;
          }
        });
      } catch (error) {
        console.error('Failed to copy theme files:', error.message);
        throw error;
      }
    }
  };
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react(), 
    dts({
      insertTypesEntry: true, // Ensures type definitions are included in the package entry
    }),
    copyThemesPlugin()
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ReactCountryStateSelector',
      fileName: format => `react-country-state-selector.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // Ensure to externalize deps that shouldn't be bundled
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        'src/stories/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        '.storybook/',
      ]
    },
    projects: [
      {
        test: {
          name: 'unit',
          include: ['src/tests/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          globals: true,
        }
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{
              browser: 'chromium'
            }]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        }
      }]
  }
});