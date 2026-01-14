export type Bindings = {
  CWD_DB: D1Database
  CWD_AUTH_KV: KVNamespace;
  ALLOW_ORIGIN: string
  RESEND_API_KEY?: string
  RESEND_FROM_EMAIL?: string
  EMAIL_ADDRESS?: string
  ADMIN_NAME: string
  ADMIN_PASSWORD: string
}