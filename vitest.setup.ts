import '@testing-library/jest-dom';

// Mock DOM properties needed by React
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'localhost',
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    search: '',
    hash: '',
  },
  writable: true,
});

// Mock browser APIs that might not be available in test environment
Object.defineProperty(window, 'navigator', {
  value: {
    language: 'en-US',
    languages: ['en-US', 'en'],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
  writable: true,
});

// Mock import.meta.env if needed
global.process = global.process || {};
global.process.env = global.process.env || {};
global.process.env.NODE_ENV = 'test';