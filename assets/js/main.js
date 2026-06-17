(function () {
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

  function attrs(items) {
    return Object.entries(items)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
      .join(' ');
  }

  function renderAuthors(authors, highlight) {
    return (authors || []).map((author) => {
      const clean = text(author);
      const escaped = escapeHtml(clean);
      return clean.includes(highlight) ? `<strong>${escaped}</strong>` : escaped;
    }).join(', ');
  }

  function renderLinks(links) {
    return Object.entries(links || {})
      .filter(([, url]) => Boolean(url))
      .map(([label, url]) => `<a class="pill-link" href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(formatLabel(label))}</a>`)
      .join('');
  }

  function formatLabel(label) {
    const labels = {
      paper: 'Paper',
      code: 'Code',
      project: 'Project',
      demo: 'Demo',
      video: 'Video',
      bibtex: 'BibTeX'
    };
    return labels[text(label).toLowerCase()] || text(label);
  }

  function renderProfileLinks(profile) {
    const profileLinks = (profile.links || [])
      .filter((link) => link.url)
      .map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a>`);
    const contact = [
      profile.email ? `<a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>` : '',
      profile.website ? `<a href="${escapeHtml(profile.website)}" target="_blank" rel="noopener">Website</a>` : ''
    ].filter(Boolean);
    return [...contact, ...profileLinks].join('');
  }

  function renderProfile(data) {
    const profile = data.profile;
    const tags = (data.about.tags || [])
      .map((tag) => `<span>${escapeHtml(tag)}</span>`)
      .join('');

    return `
      <aside class="profile-card" aria-label="Profile">
        <img class="profile-photo" src="${escapeHtml(profile.photo)}" alt="${escapeHtml(profile.photo_alt || profile.name)}">
        <div class="profile-main">
          <p class="eyebrow">Personal Homepage</p>
          <h1>${escapeHtml(profile.name)}</h1>
          <p class="headline">${escapeHtml(profile.headline)}</p>
          <p class="location">${escapeHtml(profile.location)}</p>
          <div class="profile-links">${renderProfileLinks(profile)}</div>
          <div class="tag-list">${tags}</div>
        </div>
      </aside>
    `;
  }

  function renderSection(id, title, content, extraClass = '') {
    if (!content) return '';
    return `
      <section id="${escapeHtml(id)}" class="content-section ${escapeHtml(extraClass)}">
        <div class="section-heading">
          <h2>${escapeHtml(title)}</h2>
        </div>
        ${content}
      </section>
    `;
  }

  function renderAbout(data) {
    const paragraphs = (data.about.paragraphs || [])
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join('');
    return renderSection('about', 'About', `<div class="prose">${paragraphs}</div>`);
  }

  function renderNews(news) {
    if (!news || news.length === 0) return '';
    const items = news.map((item) => `
      <li>
        <time>${escapeHtml(item.date)}</time>
        <span>${escapeHtml(item.text)}</span>
      </li>
    `).join('');
    return renderSection('news', 'News', `<ul class="news-list">${items}</ul>`);
  }

  function renderPublications(publications) {
    const cards = (publications || []).map((paper) => {
      const linkHtml = renderLinks(paper.links);
      return `
        <article class="publication-card">
          <a class="card-image-link" ${paper.links && paper.links.project ? attrs({ href: paper.links.project, target: '_blank', rel: 'noopener' }) : ''}>
            <img src="${escapeHtml(paper.image)}" alt="${escapeHtml(paper.image_alt || paper.title)}">
          </a>
          <div class="card-body">
            <p class="venue">${escapeHtml(paper.venue)}</p>
            <h3>${escapeHtml(paper.title)}</h3>
            <p class="authors">${renderAuthors(paper.authors, paper.highlight_author)}</p>
            <p class="summary">${escapeHtml(paper.summary)}</p>
            ${paper.note ? `<p class="note">${escapeHtml(paper.note)}</p>` : ''}
            ${linkHtml ? `<div class="link-row">${linkHtml}</div>` : ''}
          </div>
        </article>
      `;
    }).join('');
    return renderSection('publications', 'Publications', cards);
  }

  function renderProjects(projects) {
    const cards = (projects || []).map((project) => {
      const linkHtml = renderLinks(project.links);
      return `
        <article class="project-card">
          <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.image_alt || project.title)}">
          <div class="card-body">
            <p class="venue">${escapeHtml(project.period)}</p>
            <h3>${escapeHtml(project.title)}</h3>
            <p class="summary">${escapeHtml(project.summary)}</p>
            ${linkHtml ? `<div class="link-row">${linkHtml}</div>` : ''}
          </div>
        </article>
      `;
    }).join('');
    return renderSection('projects', 'Projects', cards);
  }

  function renderExperience(experience) {
    const items = (experience || []).map((entry) => {
      const bullets = (entry.bullets || [])
        .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
        .join('');
      return `
        <article class="timeline-item">
          <div>
            <p class="venue">${escapeHtml(entry.period)}</p>
            <h3>${escapeHtml(entry.role)}</h3>
            <p class="meta">${escapeHtml(entry.organization)} · ${escapeHtml(entry.location)}</p>
          </div>
          <ul>${bullets}</ul>
        </article>
      `;
    }).join('');
    return renderSection('experience', 'Experience', items);
  }

  function renderEducation(education) {
    const items = (education || []).map((entry) => {
      const details = (entry.details || [])
        .map((detail) => `<li>${escapeHtml(detail)}</li>`)
        .join('');
      return `
        <article class="timeline-item compact">
          <div>
            <p class="venue">${escapeHtml(entry.period)}</p>
            <h3>${escapeHtml(entry.institution)}</h3>
            <p class="meta">${escapeHtml(entry.degree)} · ${escapeHtml(entry.location)}</p>
          </div>
          <ul>${details}</ul>
        </article>
      `;
    }).join('');
    return renderSection('education', 'Education', items);
  }

  function renderHonors(honors) {
    const items = (honors || [])
      .map((honor) => `<li>${escapeHtml(honor)}</li>`)
      .join('');
    return renderSection('honors', 'Honors', `<ul class="honor-list">${items}</ul>`);
  }

  function renderCv(resume) {
    return renderSection('cv', 'Resume / CV', `
      <div class="cv-panel">
        <p>Download the current academic CV in English, or the Chinese resume version.</p>
        <div class="link-row">
          <a class="primary-link" href="${escapeHtml(resume.english)}" target="_blank" rel="noopener">English CV</a>
          <a class="pill-link" href="${escapeHtml(resume.chinese)}" target="_blank" rel="noopener">Chinese Resume</a>
        </div>
      </div>
    `);
  }

  function renderSite(data) {
    return `
      ${renderProfile(data)}
      <main class="main-content">
        ${renderAbout(data)}
        ${renderNews(data.news)}
        ${renderPublications(data.publications)}
        ${renderProjects(data.projects)}
        ${renderExperience(data.experience)}
        ${renderEducation(data.education)}
        ${renderHonors(data.honors)}
        ${renderCv(data.resume)}
      </main>
    `;
  }

  function enableSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', link.getAttribute('href'));
      });
    });
  }

  async function init() {
    const app = document.getElementById('app');
    try {
      const data = await loadSiteData();
      app.innerHTML = renderSite(data);
      enableSmoothAnchors();
    } catch (error) {
      console.error(error);
      app.className = 'error-shell';
      app.innerHTML = `
        <main class="error-state">
          <h1>Unable to load site content</h1>
          <p>Please serve this folder through a local static server and refresh the page.</p>
        </main>
      `;
    }
  }

  init();
})();
