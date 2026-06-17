# Zongze Du Personal Website

Static one-page personal website for GitHub Pages.

## Edit Content

Most content lives in `data/site.yml`.

- Add papers under `publications`.
- Add project cards under `projects`.
- Put paper images in `assets/img/publications/`.
- Put project images in `assets/img/projects/`.
- CV PDFs live in `assets/files/`.

Each publication supports optional links:

```yaml
links:
  paper: https://example.com/paper.pdf
  code: https://github.com/example/repo
  project: https://example.com
```

Empty link fields are hidden automatically.

## Preview Locally

Run:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Deploy

Push the repository to `git@github.com:Yaoyaolingbro/yaoyaolingbro.github.io.git`.
GitHub Pages will serve the site from the repository root.
