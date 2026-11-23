import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
const require = createRequire(import.meta.url);
const cli = join(dirname(require.resolve("@opennextjs/cloudflare/package.json")), "dist/cli/index.js");
const result = spawnSync(process.execPath, [cli, "build", "--openNextConfigPath", "open-next.config.mjs", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: { ...process.env, MINA_CLOUDFLARE: "true", NEXT_BUILD_DIR: ".next" },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
// Direct Wrangler deployments also need the prerendered cache assets present.
const cache = spawnSync(process.execPath, [cli, "populateCache", "local"], {
  stdio: "inherit",
  env: { ...process.env, MINA_CLOUDFLARE: "true", NEXT_BUILD_DIR: ".next" },
});
if (cache.error) throw cache.error;
process.exit(cache.status ?? 1);
