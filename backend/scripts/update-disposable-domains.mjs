// Regenerate data/disposableEmailDomains.js from the upstream blocklist.
//
//   node scripts/update-disposable-domains.mjs
//
// The list is community-maintained and new throwaway domains appear
// constantly, so re-run this every few months and commit the result.
//
// Why a generated .js module rather than reading the .conf at runtime:
// Vercel's @vercel/node builder decides which files to include in the
// deployment by statically analysing imports. A fs.readFileSync() of a data
// file is invisible to that analysis, so the file can be missing in
// production while working perfectly in local dev — the blocklist would
// silently degrade to empty and every disposable address would sail through.
// An ordinary import cannot fail that way.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const SOURCE =
  "https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf";

const here = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.join(here, "..", "data", "disposableEmailDomains.js");

const res = await fetch(SOURCE);
if (!res.ok) {
  console.error(`Fetch failed: HTTP ${res.status} from ${SOURCE}`);
  process.exitCode = 1;
} else {
  const domains = (await res.text())
    .split("\n")
    .map((line) => line.trim().toLowerCase())
    .filter((line) => line && !line.startsWith("#") && line.includes("."))
    .sort();

  const unique = [...new Set(domains)];

  const body = `// GENERATED FILE — do not edit by hand.
// Regenerate with: node scripts/update-disposable-domains.mjs
// Source: ${SOURCE}
// Fetched: ${new Date().toISOString().slice(0, 10)}
// Domains: ${unique.length}

export const DISPOSABLE_EMAIL_DOMAINS = ${JSON.stringify(unique, null, 0)};

export default DISPOSABLE_EMAIL_DOMAINS;
`;

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, body, "utf8");
  console.log(`Wrote ${unique.length} domains to ${path.relative(process.cwd(), outFile)}`);
}
