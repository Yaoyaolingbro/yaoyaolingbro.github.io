# Personal Website Design

Date: 2026-06-17

## Goal

Build a simple, one-page personal website for Zongze Du at `yaoyaolingbro.github.io`.
The site should feel like a polished academic and builder homepage rather than a
copy of the CV. It will use the existing CV YAML in `../个人简历/` as a reference
source, but the website content should be reorganized for web reading.

The first version prioritizes:

- English as the primary language.
- A compact research plus builder identity.
- Publication cards with image, title, authors, venue, short summary, and links.
- Easy editing through a YAML data file instead of hand-editing dense HTML.
- Responsive support for desktop, tablet, phone portrait, and phone landscape.
- Simple GitHub Pages deployment with no build step.

## Selected Direction

Use the "Balanced Research + Builder" layout.

Desktop and wide tablet layout:

- Top navigation bar with `About`, `Publications`, `Projects`, `Experience`,
  `Education`, `Honors`, and `CV` anchor links.
- Left profile column with photo, name, headline, location, email, GitHub,
  Google Scholar, website, and CV links.
- Right main column with the section content.
- Publications and projects use visual cards so research outputs are scannable.

Mobile layout:

- Collapse the left profile column into a top profile block.
- Keep the navigation as compact horizontal anchor links.
- Convert publication cards from "image left, text right" to "image top, text
  below".
- Keep link buttons large enough to tap comfortably.

This keeps the desktop C layout while avoiding a squeezed sidebar on phones.

## Content Structure

The page will include these sections, in this order:

1. `About`
   - Short web-native introduction based on the CV summary.
   - Emphasize incoming PhD at ZJU CAD&CG Lab, multimodal reasoning, embodied
     intelligence, video generation, AIRA, and high-performance computing.

2. `News`
   - Optional short list of recent updates.
   - Kept data-driven so it can be hidden when empty.

3. `Publications`
   - Primary section for papers.
   - Each item includes image, venue badge, title, authors, venue/date, summary,
     and optional `Paper`, `Code`, `Project`, `Demo`, `Video`, or `BibTeX`
     links.
   - Missing links are simply not rendered.

4. `Projects`
   - Selected engineering and research projects.
   - Initial candidates: FrontierX AURA/VEX companion robots, AIRA platform and
     community work, high-performance computing optimization.

5. `Experience`
   - More compact than the CV.
   - Focus on ZJU CAD&CG Lab and ZJUSCT/AIRA.

6. `Education`
   - Zhejiang University PhD and undergraduate entries.

7. `Honors`
   - Compact list of awards.

8. `Resume / CV`
   - Download links for English CV and Chinese CV.
   - The Chinese resume download link is preserved here only; the website itself
     remains English.

## Data Model

Use `data/site.yml` as the editing surface.

Planned top-level shape:

```yaml
profile:
  name: Zongze Du
  headline: AI Research Engineer | Multimodal AI, Embodied Intelligence, Builder
  photo: assets/img/profile.jpg
  location: Hangzhou, China
  email: 3220105581@zju.edu.cn
  links:
    - label: GitHub
      url: https://github.com/Yaoyaolingbro
    - label: Google Scholar
      url:

resume:
  english: assets/files/Zongze_Du_CV.pdf
  chinese: assets/files/Zongze_Du_CV_zh.pdf

about:
  paragraphs:
    - I am an incoming PhD student at ZJU CAD&CG Lab, working on multimodal reasoning, embodied intelligence, and video generation.
    - I also build research communities and applied AI systems through AIRA, ZJUSCT, and industry collaborations.

news:
  - date: 2026-01
    text: FrontierX AURA companion robot was showcased at CES 2026.

publications:
  - title: Omni-R1: Reinforcement Learning for Omnimodal Reasoning via Two-System Collaboration
    authors:
      - Hao Zhong*
      - Muzhi Zhu*
      - Zongze Du*
    highlight_author: Zongze Du
    venue: NeurIPS 2025
    image: assets/img/publications/omni-r1.jpg
    summary: Short one-sentence web description.
    links:
      paper:
      code:
      project:

projects:
  - title: FrontierX AURA & VEX Companion Robots
    period: 2025.09 - 2026.01
    image: assets/img/projects/frontierx.jpg
    summary: Led perception and algorithm work for companion robots under embedded hardware constraints.
    links:
      project: https://tech.ifeng.com/c/8pfR9nQ6ADv
```

These field names are the implementation contract unless a concrete blocker is
found during development. Future edits should mostly happen in this one readable
YAML file.

## Technical Approach

Use a lightweight static site:

- `index.html` provides the semantic page structure and a tiny renderer.
- `assets/css/styles.css` contains all styling and responsive rules.
- `data/site.yml` stores editable content.
- `assets/js/main.js` loads YAML, renders repeated sections, and enables smooth
  anchor scrolling.
- `assets/vendor/js-yaml.min.js` is vendored locally so the browser can parse
  `data/site.yml`.

This keeps GitHub Pages deployment simple: push static files to the repository
and serve directly.

Local preview should run through a tiny static server so browser-side loading of
`data/site.yml` works consistently.

## Assets

Initial assets should be copied from the local CV directory when implementation
starts:

- Profile image from `../个人简历/22-1.jpg`.
- English CV from `../个人简历/rendercv_output/Zongze_Du_CV.pdf`.
- Chinese CV from `../个人简历/rendercv_output_zh/杜宗泽_CV.pdf`.

Publication/project images can start with placeholders generated from the site
style or use existing research figures if available. Each card should still have
a stable image slot so later replacement is easy.

Planned directories:

```text
assets/
  css/
  js/
  img/
    profile.jpg
    publications/
    projects/
  files/
data/
  site.yml
```

## Responsive Rules

Use CSS breakpoints:

- Wide screens: two-column layout with sticky or semi-sticky left profile.
- Medium screens: narrower left profile and less spacing.
- Small screens: single-column layout, top profile, full-width cards.

Navigation behavior:

- Top labels are real anchor links.
- Smooth scrolling is enabled.
- Active section highlighting is optional for the first version.
- On mobile, navigation scrolls horizontally to avoid wrapping labels into
  multiple rows.

## Accessibility and SEO

- Use semantic headings and sections.
- Add meaningful `alt` text for profile, paper, and project images.
- Ensure link buttons have descriptive labels.
- Keep color contrast readable.
- Add basic SEO metadata: title, description, canonical URL, Open Graph title,
  and Open Graph description.

## Testing

Manual verification:

- Desktop width around 1440px.
- Tablet landscape around 1024px.
- Phone portrait around 390px.
- Phone landscape around 844px wide.
- Anchor navigation scrolls to the correct sections.
- PDF links open or download correctly.
- Publication cards remain readable when images or links are missing.

Automated checks, if tooling is available:

- Run a local static server.
- Use browser screenshots for desktop and mobile.
- Check the page for console errors.

## Out of Scope for First Version

- Blog system.
- Multi-page routing.
- Search.
- Automatic Google Scholar citation syncing.
- Analytics.
- Dark mode.
- Complex build pipeline.

These can be added later without changing the core YAML content model.
