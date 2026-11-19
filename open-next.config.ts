// OpenNext adapter for Cloudflare Workers.
// No incremental cache: every page loads its data in the browser from Supabase.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
