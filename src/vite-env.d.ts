/// <reference types="vite/client" />

// Allow CSS imports in TypeScript
declare module '*.css' {
  const css: string;
  export default css;
}
