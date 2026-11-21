/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the REST API. Defaults to `/api`, which Vite proxies to the NestJS server. */
  readonly VITE_API_URL?: string;
  /** `"true"` in the static demo build, which answers API calls in the browser (see src/api/demo.ts). */
  readonly VITE_DEMO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
