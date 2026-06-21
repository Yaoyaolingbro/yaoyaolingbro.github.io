import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read = (path) => fs.readFileSync(path, "utf8");

const yamlContext = {};
vm.createContext(yamlContext);
vm.runInContext(read("assets/vendor/js-yaml.min.js"), yamlContext);
const yaml = yamlContext.jsyaml;
const site = yaml.load(read("data/site.yml"));
const scholar = yaml.load(read("data/scholar.yml"));
const siteSchema = JSON.parse(read("data/site.schema.json"));
const vscodeSettings = JSON.parse(read(".vscode/settings.json"));

assert.equal(site.profile.name, "Zongze Du");
assert.ok(site.profile.headline.length > 0);
assert.ok(!read("data/site.yml").includes("core CUDA programmer"));
assert.match(site.about.paragraphs.join(" "), /high-performance profiling and optimization/);
assert.equal(site.about.links["Prof. Chunhua Shen"], "https://cshen.github.io/");
assert.equal(site.about.links["Prof. Hao Chen"], "https://stan-haochen.github.io/");
assert.ok(scholar.metrics.citations >= 0);
assert.ok(scholar.metrics.h_index >= 0);
assert.ok(scholar.metrics.i10_index >= 0);
assert.match(scholar.profile_url, /scholar\.google\.com\/citations\?user=wy0YRHUAAAAJ/);
assert.equal(siteSchema.title, "Personal Website Content");
assert.equal(vscodeSettings["yaml.schemas"]["./data/site.schema.json"], "data/site.yml");
assert.ok(site.resume.english.endsWith("Zongze_Du_CV.pdf"));
assert.ok(site.resume.chinese.endsWith("Zongze_Du_CV_zh.pdf"));
assert.ok(site.publications.length >= 2);
assert.ok(site.experience.length >= 2);
assert.ok(!Object.prototype.hasOwnProperty.call(site, "projects"));
assert.ok(site.collaborators.length >= 6);
assert.equal(
  site.collaborators.find((collaborator) => collaborator.name === "Muzhi Zhu").url,
  "https://z-mu-z.github.io/"
);
assert.equal(
  site.collaborators.find((collaborator) => collaborator.name === "Hao Zhong").url,
  ""
);
assert.equal(site.education[0].image, "assets/img/institution/zju-cs.png");
assert.equal(site.education[1].image, "assets/img/institution/ckc.png");
assert.match(site.education[1].degree, /Chu Kochen Honors College Mixed Class/);
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
assert.ok(!site.experience.some((entry) => entry.title.includes("FrontierX")));
assert.equal(
  site.experience.find((entry) => entry.title.includes("AIRA")).image,
  "assets/img/projects/aira.png"
);
const airaPng = fs.readFileSync("assets/img/projects/aira.png");
assert.equal(airaPng.subarray(1, 4).toString("ascii"), "PNG");
assert.equal(airaPng[25], 6, "AIRA logo should use an RGBA PNG with transparency");
assert.equal(
  site.experience.find((entry) => entry.title.includes("High-Performance Computing")).image,
  "assets/img/projects/zjusct-logo.png"
);
assert.ok(fs.existsSync("assets/img/projects/zjusct-logo.png"));
for (const dir of ["assets/img/publications", "assets/img/projects"]) {
  const svgFiles = fs.readdirSync(dir).filter((file) => file.endsWith(".svg"));
  assert.deepEqual(svgFiles, [], `${dir} should not contain SVG files`);
}

const html = read("index.html");
for (const id of ["about", "publications", "experience", "education", "collaborators", "honors", "cv"]) {
  assert.ok(html.includes(`href="#${id}"`), `index.html should link to #${id}`);
}
assert.ok(!html.includes('href="#projects"'));
assert.ok(html.includes("assets/img/institution/zju-cs.png"));
assert.ok(html.includes("assets/vendor/js-yaml.min.js"));
assert.ok(html.includes("assets/js/main.js"));

const js = read("assets/js/main.js");
assert.ok(js.includes("fetch(path"));
assert.ok(js.includes("loadYaml('data/site.yml')"));
assert.ok(js.includes("loadYaml('data/scholar.yml', false)"));
assert.ok(js.includes("function renderLinkedText"));
assert.ok(js.includes("function renderLinks"));
assert.ok(js.includes("function renderScholarMetrics"));
assert.ok(js.includes("function renderExperienceCards"));
assert.ok(js.includes("function renderCollaborators"));
assert.ok(js.includes("function enableGlassHeader"));
assert.ok(!js.includes("function renderProjects"));
assert.ok(js.includes("education-card"));
assert.ok(js.includes("education-logo"));
assert.ok(js.includes("function renderNewsAside"));
assert.ok(js.includes("desktop-news"));
assert.ok(js.includes("mobile-news"));
assert.ok(js.includes("function scrollToCurrentHash"));
assert.ok(js.includes("Unable to load site content"));

const css = read("assets/css/styles.css");
assert.ok(css.includes("grid-template-columns: minmax(300px, 340px) minmax(0, 1fr) minmax(210px, 250px)"));
assert.ok(css.includes("@media (max-width: 760px)"));
assert.ok(css.includes("overflow-x: auto"));
assert.ok(css.includes("-webkit-overflow-scrolling: touch"));
assert.ok(css.includes(".site-header.is-scrolled"));
assert.ok(css.includes(".brand-logo"));
assert.ok(css.includes(".education-card"));
assert.ok(css.includes(".education-logo"));
assert.ok(css.includes(".education-list"));
assert.ok(css.includes(".scholar-metrics"));
assert.ok(css.includes(".collaborator-list"));
assert.ok(css.includes(".desktop-news"));
assert.ok(css.includes(".mobile-news"));
assert.ok(css.includes("border-radius: 12px"));
assert.ok(css.includes("grid-template-columns: 280px minmax(0, 1fr)"));
assert.ok(css.includes("width: 280px"));
assert.ok(css.includes("height: 158px"));
assert.ok(css.includes("width: 320px"));
assert.ok(css.includes("height: 180px"));
assert.ok(css.includes("max-width: calc(100vw - 64px)"));
assert.ok(css.includes(".project-card img"));
assert.ok(css.includes("width: 280px"));
assert.ok(css.includes("object-fit: contain"));

const scholarScript = read("scripts/update-scholar.mjs");
assert.ok(scholarScript.includes("scholar.google.com/citations?user=wy0YRHUAAAAJ"));
assert.ok(scholarScript.includes("parseMetrics"));
const scholarWorkflow = read(".github/workflows/update-scholar.yml");
assert.ok(scholarWorkflow.includes("node scripts/update-scholar.mjs"));

console.log("site smoke checks passed");
