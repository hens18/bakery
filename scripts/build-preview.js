// Bundles site/ into one self-contained page for sharing a preview.
// Local CSS/JS are inlined and images become data URIs, so the single file opens anywhere
// (double-click, email, chat). Fonts still load from Google Fonts. Output: .preview/index.html (git-ignored).
// --artifact writes .preview/live.html for the live preview link instead: the artifact host wraps pages in
// its own <html>/<head>/<body>, so those are stripped, and the tab title is the plain business name.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const site = path.join(root, "site");
const artifact = process.argv.includes("--artifact");

const MIME = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml" };
const inlineImages = text => text.replace(/assets\/img\/[\w.-]+\.(webp|png|jpe?g|svg)/g, ref => {
  const file = path.join(site, ref);
  const mime = MIME[path.extname(file).toLowerCase()];
  return `data:${mime};base64,${fs.readFileSync(file).toString("base64")}`;
});

let html = fs.readFileSync(path.join(site, "index.html"), "utf8");

html = html
  .replace(/<link rel="preload" as="image"[^>]*>\s*/g, "")
  .replace(/<link rel="stylesheet" href="(assets\/[^"]+)">/g, (_, f) =>
    `<style>\n${fs.readFileSync(path.join(site, f), "utf8")}</style>`)
  .replace(/<script src="(assets\/[^"]+)"><\/script>/g, (_, f) =>
    `<script>\n${fs.readFileSync(path.join(site, f), "utf8")}</script>`);

html = inlineImages(html);

if (artifact) {
  html = html
    .replace(/<!doctype html>\s*/i, "")
    .replace(/<\/?(html|head|body)\b[^>]*>\s*/gi, "")
    .replace(/<meta (charset|name="viewport")[^>]*>\s*/gi, "")
    .replace(/<title>[^<]*<\/title>/, "<title>Mena Bakery &amp; Carry Out</title>");
}

const name = artifact ? "live.html" : "index.html";
fs.mkdirSync(path.join(root, ".preview"), { recursive: true });
const out = path.join(root, ".preview", name);
fs.writeFileSync(out, html);
console.log(`Wrote .preview/${name} (${Math.round(fs.statSync(out).size / 1024)} KB)`);
