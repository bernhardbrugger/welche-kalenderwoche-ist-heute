/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_RECAPTCHA_SITE_KEY?: string;
    // ggf. weitere VITE_-Variablen ...
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  