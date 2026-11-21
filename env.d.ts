/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the REST API. Defaults to `/api`, which Vite proxies to the NestJS server. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
