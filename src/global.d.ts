export {}; // Damit diese Datei als Modul erkannt wird

declare global {
  interface Window {
    grecaptcha: {
      /** Führt reCAPTCHA v3 aus und liefert ein Promise mit dem Token */
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      /** Stellt sicher, dass reCAPTCHA-Bibliothek geladen ist */
      ready: (cb: () => void) => void;
    };
  }
}