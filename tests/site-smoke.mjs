import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");

const yaml = await import("../assets/vendor/js-yaml.min.js");
const site = yaml.load(read("data/site.yml"));

assert.equal(site.profile.name, "Zongze Du");
assert.match(site.profile.headline, /Multimodal AI/);
assert.ok(site.resume.english.endsWith("Zongze_Du_CV.pdf"));
assert.ok(site.resume.chinese.endsWith("Zongze_Du_CV_zh.pdf"));
assert.ok(site.publications.length >= 2);
assert.ok(site.projects.length >= 2);

const html = read("index.html");
for (const id of ["about", "publications", "projects", "experience", "education", "honors", "cv"]) {
  assert.ok(html.includes(`href="#${id}"`), `index.html should link to #${id}`);
}
assert.ok(html.includes("assets/vendor/js-yaml.min.js"));
assert.ok(html.includes("assets/js/main.js"));

const js = read("assets/js/main.js");
assert.ok(js.includes("fetch('data/site.yml'"));
assert.ok(js.includes("function renderLinks"));
assert.ok(js.includes("Unable to load site content"));

const css = read("assets/css/styles.css");
assert.ok(css.includes("grid-template-columns: minmax(220px, 280px) minmax(0, 1fr)"));
assert.ok(css.includes("@media (max-width: 760px)"));
assert.ok(css.includes("overflow-x: auto"));

console.log("site smoke checks passed");
