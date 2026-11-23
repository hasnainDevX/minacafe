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
process.exit(result.status ?? 1);
