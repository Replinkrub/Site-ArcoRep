declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    ARCO_ADMIN_EMAIL?: string;
  }
}
