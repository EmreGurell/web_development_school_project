// Production-safe logger utility for client-side
export const logger = {
  log: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  error: (...args) => {
    // Errors should always be logged
    console.error(...args);
  },
  warn: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(...args);
    }
  },
  info: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(...args);
    }
  },
};

