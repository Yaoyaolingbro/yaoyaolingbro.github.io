# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished one-page English personal website for Zongze Du, driven by `data/site.yml`, with responsive desktop C layout and mobile single-column layout.

**Architecture:** The site is a static GitHub Pages site with no build step. `index.html` owns the semantic shell, `data/site.yml` owns editable content, `assets/js/main.js` renders repeated sections in the browser, and `assets/css/styles.css` owns visual design and responsive behavior.

**Tech Stack:** HTML, CSS, vanilla JavaScript, vendored `js-yaml`, Python static server for local preview, Playwright or browser screenshot checks when available.

---

## File Structure

- Create `index.html`: semantic page shell, SEO metadata, nav anchors, loading container, template targets.
- Create `data/site.yml`: readable editable content derived from the CV YAML but rewritten for a web homepage.
- Create `assets/css/styles.css`: desktop C layout, mobile single-column layout, cards, buttons, navigation, accessibility states.
- Create `assets/js/main.js`: load YAML, render profile, about, news, publications, projects, experience, education, honors, CV links, smooth anchor behavior.
- Create `assets/vendor/js-yaml.min.js`: local YAML parser dependency.
- Create `assets/img/profile.jpg`: copied from `../个人简历/22-1.jpg`.
- Create `assets/img/publications/*.svg`: lightweight generated visual thumbnails for papers.
- Create `assets/img/projects/*.svg`: lightweight generated visual thumbnails for projects.
- Create `assets/files/Zongze_Du_CV.pdf`: copied from `../个人简历/rendercv_output/Zongze_Du_CV.pdf`.
- Create `assets/files/Zongze_Du_CV_zh.pdf`: copied from `../个人简历/rendercv_output_zh/杜宗泽_CV.pdf`.
- Create `README.md`: edit/deploy instructions.

---

### Task 1: Project Scaffold and Assets

**Files:**
- Create: `assets/css/styles.css`
- Create: `assets/js/main.js`
- Create: `assets/vendor/js-yaml.min.js`
- Create: `assets/img/profile.jpg`
- Create: `assets/img/publications/*.svg`
- Create: `assets/img/projects/*.svg`
- Create: `assets/files/Zongze_Du_CV.pdf`
- Create: `assets/files/Zongze_Du_CV_zh.pdf`

- [ ] **Step 1: Create directories**

Run:

```bash
mkdir -p assets/css assets/js assets/vendor assets/img/publications assets/img/projects assets/files data
```

Expected: directories exist.

- [ ] **Step 2: Copy CV assets**

Run:

```bash
cp ../个人简历/22-1.jpg assets/img/profile.jpg
cp ../个人简历/rendercv_output/Zongze_Du_CV.pdf assets/files/Zongze_Du_CV.pdf
cp ../个人简历/rendercv_output_zh/杜宗泽_CV.pdf assets/files/Zongze_Du_CV_zh.pdf
```

Expected: profile image and both PDFs exist in `assets/`.

- [ ] **Step 3: Vendor YAML parser**

Run:

```bash
curl -L https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js -o assets/vendor/js-yaml.min.js
```

Expected: `assets/vendor/js-yaml.min.js` exists and contains a minified parser.

- [ ] **Step 4: Commit scaffold assets**

Run:

```bash
git add assets
git commit -m "Add website assets"
```

Expected: commit succeeds.

---

### Task 2: YAML Content Model

**Files:**
- Create: `data/site.yml`

- [ ] **Step 1: Write homepage content**

Create `data/site.yml` with these top-level keys:

```yaml
profile:
  name: Zongze Du
  headline: AI Research Engineer | Multimodal AI, Embodied Intelligence, Builder
  photo: assets/img/profile.jpg
  photo_alt: Portrait of Zongze Du
  location: Hangzhou, China
  email: 3220105581@zju.edu.cn
  website: https://yaoyaolingbro.github.io
  links:
    - label: GitHub
      url: https://github.com/Yaoyaolingbro
    - label: Google Scholar
      url: ""

resume:
  english: assets/files/Zongze_Du_CV.pdf
  chinese: assets/files/Zongze_Du_CV_zh.pdf

about:
  paragraphs:
    - I am an incoming PhD student at Zhejiang University CAD&CG Lab, advised by Prof. Chunhua Shen and Prof. Hao Chen. My work sits at the intersection of multimodal reasoning, embodied intelligence, and video generation.
    - Beyond research, I founded AIRA at Zhejiang University and work as a core CUDA programmer at ZJUSCT. I am interested in turning frontier AI research into real systems, tools, and industry-facing products.
  tags:
    - Multimodal Reasoning
    - Embodied AI
    - Video Generation
    - High-Performance Computing

news:
  - date: 2026.01
    text: FrontierX AURA companion robot was showcased at CES 2026.
  - date: 2025.12
    text: Omni-R1 was accepted to NeurIPS 2025.

publications:
  - title: "Preserving Source Video Realism: High-Fidelity Face Swapping for Cinematic Quality"
    authors:
      - Zekai Luo
      - Zongze Du
      - Zhouhang Zhu
      - Hao Zhong
      - Muzhi Zhu
      - Wen Wang
      - Yuling Xi
      - Chenchen Jing
      - Hao Chen
      - Chunhua Shen
    highlight_author: Zongze Du
    venue: CVPR 2026
    image: assets/img/publications/livingswap.svg
    image_alt: Abstract video face swapping research thumbnail
    summary: A high-fidelity face swapping pipeline focused on preserving source video realism for cinematic-quality generation.
    links: {}
  - title: "Omni-R1: Reinforcement Learning for Omnimodal Reasoning via Two-System Collaboration"
    authors:
      - Hao Zhong*
      - Muzhi Zhu*
      - Zongze Du*
      - Zheng Huang
      - Canyu Zhao
      - Mingyu Liu
      - Wen Wang
      - Hao Chen
      - Chunhua Shen
    highlight_author: Zongze Du
    venue: NeurIPS 2025
    image: assets/img/publications/omni-r1.svg
    image_alt: Abstract omnimodal reasoning research thumbnail
    summary: A reinforcement learning framework for omnimodal reasoning built around two-system collaboration.
    note: "* Equal contribution"
    links: {}
```

Expected: YAML parses with `js-yaml` and has no tab indentation.

- [ ] **Step 2: Commit YAML content**

Run:

```bash
git add data/site.yml
git commit -m "Add homepage content data"
```

Expected: commit succeeds.

---

### Task 3: HTML Shell

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write semantic HTML shell**

Create `index.html` with:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Zongze Du</title>
  <meta name="description" content="Zongze Du is an AI research engineer working on multimodal reasoning, embodied intelligence, video generation, and high-performance computing.">
  <link rel="canonical" href="https://yaoyaolingbro.github.io/">
  <meta property="og:title" content="Zongze Du">
  <meta property="og:description" content="AI research engineer working on multimodal reasoning, embodied intelligence, video generation, and high-performance computing.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://yaoyaolingbro.github.io/">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="#about" aria-label="Zongze Du homepage">Zongze Du</a>
    <nav class="site-nav" aria-label="Primary navigation">
      <a href="#about">About</a>
      <a href="#publications">Publications</a>
      <a href="#projects">Projects</a>
      <a href="#experience">Experience</a>
      <a href="#education">Education</a>
      <a href="#honors">Honors</a>
      <a href="#cv">CV</a>
    </nav>
  </header>
  <div id="app" class="app-shell" aria-live="polite">
    <p class="loading">Loading profile...</p>
  </div>
  <noscript>
    <main class="noscript">
      <h1>Zongze Du</h1>
      <p>This site uses a small JavaScript renderer to load editable YAML content. Please enable JavaScript to view the full homepage.</p>
    </main>
  </noscript>
  <script src="assets/vendor/js-yaml.min.js"></script>
  <script src="assets/js/main.js"></script>
</body>
</html>
```

Expected: opening through a local server shows loading text before JavaScript renders content.

- [ ] **Step 2: Commit HTML shell**

Run:

```bash
git add index.html
git commit -m "Add static homepage shell"
```

Expected: commit succeeds.

---

### Task 4: JavaScript Renderer

**Files:**
- Create: `assets/js/main.js`

- [ ] **Step 1: Implement YAML loading and rendering**

Implement functions:

```javascript
async function loadSiteData() {
  const response = await fetch('data/site.yml', { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Failed to load site data: ${response.status}`);
  return jsyaml.load(await response.text());
}

function text(value) {
  return value == null ? '' : String(value);
}

function escapeHtml(value) {
  return text(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderAuthors(authors, highlight) {
  return (authors || []).map((author) => {
    const clean = text(author);
    const escaped = escapeHtml(clean);
    return clean.includes(highlight) ? `<strong>${escaped}</strong>` : escaped;
  }).join(', ');
}
```

Then render the profile column, about, news, publication cards, project cards,
experience, education, honors, and CV download links from `data/site.yml`.

Expected: no hardcoded publication cards in `index.html`; repeated content comes from YAML.

- [ ] **Step 2: Add resilient optional field rendering**

Ensure:

```javascript
function renderLinks(links) {
  return Object.entries(links || {})
    .filter(([, url]) => Boolean(url))
    .map(([label, url]) => `<a class="pill-link" href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`)
    .join('');
}
```

Expected: empty paper/code/project links do not render broken buttons.

- [ ] **Step 3: Add initialization error state**

If loading fails, render:

```html
<main class="error-state">
  <h1>Unable to load site content</h1>
  <p>Please serve this folder through a local static server and refresh the page.</p>
</main>
```

Expected: opening `index.html` directly gives a useful error instead of a blank page.

- [ ] **Step 4: Commit renderer**

Run:

```bash
git add assets/js/main.js
git commit -m "Render homepage from YAML data"
```

Expected: commit succeeds.

---

### Task 5: Visual Design and Responsive CSS

**Files:**
- Create: `assets/css/styles.css`

- [ ] **Step 1: Implement desktop C layout**

Add CSS for:

```css
.app-shell {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: 48px;
  max-width: 1180px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}
```

Expected: desktop has a left profile and right content column.

- [ ] **Step 2: Implement mobile single-column layout**

Add CSS:

```css
@media (max-width: 760px) {
  .app-shell {
    display: block;
    padding: 24px 16px 56px;
  }

  .profile-card {
    position: static;
    display: grid;
    grid-template-columns: 84px 1fr;
    gap: 16px;
  }

  .publication-card,
  .project-card {
    grid-template-columns: 1fr;
  }

  .site-nav {
    overflow-x: auto;
    white-space: nowrap;
  }
}
```

Expected: no sidebar squeeze on phones; cards become image-top text-bottom.

- [ ] **Step 3: Style cards and links**

Add restrained academic-builder visual styling:

```css
.publication-card,
.project-card {
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  gap: 20px;
  padding: 22px 0;
  border-top: 1px solid var(--line);
}
```

Expected: publication image, title, summary, authors, and links scan cleanly.

- [ ] **Step 4: Commit CSS**

Run:

```bash
git add assets/css/styles.css
git commit -m "Style responsive personal homepage"
```

Expected: commit succeeds.

---

### Task 6: README and Local Preview

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write editing instructions**

Create `README.md` with:

```markdown
# Zongze Du Personal Website

Static one-page personal website for GitHub Pages.

## Edit Content

Most content lives in `data/site.yml`.

- Add papers under `publications`.
- Add project cards under `projects`.
- Put paper images in `assets/img/publications/`.
- Put project images in `assets/img/projects/`.
- CV PDFs live in `assets/files/`.

## Preview Locally

Run:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Deploy

Push the repository to `git@github.com:Yaoyaolingbro/yaoyaolingbro.github.io.git`.
GitHub Pages will serve the site from the repository root.
```

Expected: future editing path is clear.

- [ ] **Step 2: Commit README**

Run:

```bash
git add README.md
git commit -m "Document website editing workflow"
```

Expected: commit succeeds.

---

### Task 7: Verification

**Files:**
- Read: `index.html`
- Read: `data/site.yml`
- Read: `assets/js/main.js`
- Read: `assets/css/styles.css`

- [ ] **Step 1: Validate YAML syntax**

Run:

```bash
node -e "const fs=require('fs'); const yaml=require('./assets/vendor/js-yaml.min.js'); yaml.load(fs.readFileSync('data/site.yml','utf8')); console.log('YAML OK')"
```

Expected: prints `YAML OK`.

- [ ] **Step 2: Start local server**

Run:

```bash
python3 -m http.server 8000
```

Expected: server listens at `http://localhost:8000`.

- [ ] **Step 3: Browser smoke test**

Open `http://localhost:8000` and verify:

- Profile renders.
- Anchor nav jumps to sections.
- Publication cards render from YAML.
- Empty links are hidden.
- English and Chinese CV links open PDFs.
- Desktop layout uses profile-left/content-right.
- Phone width uses top profile and single-column cards.

- [ ] **Step 4: Check Git status**

Run:

```bash
git status --short --branch
```

Expected: only intentionally untracked local files remain, or working tree is clean.

- [ ] **Step 5: Final commit if verification fixes were needed**

Run:

```bash
git add index.html data/site.yml assets README.md
git commit -m "Polish homepage verification issues"
```

Expected: commit succeeds only if verification required fixes.
