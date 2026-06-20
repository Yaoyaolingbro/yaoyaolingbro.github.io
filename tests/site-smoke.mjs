import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read = (path) => fs.readFileSync(path, "utf8");

const yamlContext = {};
vm.createContext(yamlContext);
vm.runInContext(read("assets/vendor/js-yaml.min.js"), yamlContext);
const yaml = yamlContext.jsyaml;
const site = yaml.load(read("data/site.yml"));

assert.equal(site.profile.name, "Zongze Du");
assert.match(site.profile.headline, /Multimodal AI/);
assert.ok(site.resume.english.endsWith("Zongze_Du_CV.pdf"));
assert.ok(site.resume.chinese.endsWith("Zongze_Du_CV_zh.pdf"));
assert.ok(site.publications.length >= 2);
assert.ok(site.projects.length >= 2);
assert.equal(site.publications[0].title, "Agentic Evolution with Adaptive OCR Memory");
assert.equal(site.publications[0].image, "assets/img/publications/agentic-ocr-memory.png");
assert.ok(!site.publications.some((publication) => publication.title.includes("GAE:")));
assert.ok(!site.publications.some((publication) => publication.title.includes("NoTVLA")));
assert.ok(site.publications.every((publication) => publication.image.endsWith(".png")));
assert.equal(
  site.publications.find((publication) => publication.title.includes("Metric-Bench")).venue,
  "ECCV 2026"
);
assert.ok(!site.news.some((item) => item.text.includes("FrontierX")));
assert.ok(!site.projects.some((project) => project.title.includes("FrontierX")));
assert.equal(
  site.projects.find((project) => project.title.includes("AIRA")).image,
  "assets/img/projects/aira.png"
);
assert.equal(
  site.projects.find((project) => project.title.includes("High-Performance Computing")).image,
  "assets/img/projects/zjusct-logo.png"
);
assert.ok(fs.existsSync("assets/img/projects/zjusct-logo.png"));
for (const dir of ["assets/img/publications", "assets/img/projects"]) {
  const svgFiles = fs.readdirSync(dir).filter((file) => file.endsWith(".svg"));
  assert.deepEqual(svgFiles, [], `${dir} should not contain SVG files`);
}

const html = read("index.html");
for (const id of ["about", "publications", "projects", "experience", "education", "honors", "cv"]) {
  assert.ok(html.includes(`href="#${id}"`), `index.html should link to #${id}`);
}
assert.ok(html.includes("assets/img/zju-cs.png"));
assert.ok(html.includes("assets/vendor/js-yaml.min.js"));
assert.ok(html.includes("assets/js/main.js"));

const js = read("assets/js/main.js");
assert.ok(js.includes("fetch('data/site.yml'"));
assert.ok(js.includes("function renderLinks"));
assert.ok(js.includes("function renderNewsAside"));
assert.ok(js.includes("desktop-news"));
assert.ok(js.includes("mobile-news"));
assert.ok(js.includes("function scrollToCurrentHash"));
assert.ok(js.includes("Unable to load site content"));

const css = read("assets/css/styles.css");
assert.ok(css.includes("grid-template-columns: minmax(300px, 340px) minmax(0, 1fr) minmax(210px, 250px)"));
assert.ok(css.includes("@media (max-width: 760px)"));
assert.ok(css.includes("overflow-x: auto"));
assert.ok(css.includes(".brand-logo"));
assert.ok(css.includes(".desktop-news"));
assert.ok(css.includes(".mobile-news"));
assert.ok(css.includes("border-radius: 12px"));
assert.ok(css.includes("grid-template-columns: 280px minmax(0, 1fr)"));
assert.ok(css.includes("width: 280px"));
assert.ok(css.includes("height: 158px"));
assert.ok(css.includes("object-fit: contain"));

console.log("site smoke checks passed");
