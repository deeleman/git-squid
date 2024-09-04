/// <reference types="vite/client" />

// Environment variables mapping interface for MAIN
interface ImportMetaEnv {
  // Main cryptographic key, generated on build time
  readonly SQUID_MAIN_KEY: string
  // Main interactive vector, generated on build time
  readonly SQUID_MAIN_IV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
