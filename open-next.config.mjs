import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Serve prerendered shells from the included assets. Live Sanity data bypasses
// this read-only cache on Workers, so no R2/D1/paid image service is required.
export default defineCloudflareConfig({ incrementalCache: staticAssetsIncrementalCache });
