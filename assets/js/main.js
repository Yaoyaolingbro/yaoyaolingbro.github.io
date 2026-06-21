(function () {
  async function loadYaml(path, required = true) {
    const response = await fetch(path, { cache: 'no-cache' });
    if (!response.ok && !required) return null;
    if (!response.ok) throw new Error(`Failed to load site data: ${response.status}`);
    return jsyaml.load(await response.text());
  }

  async function loadSiteData() {
    const [site, scholar] = await Promise.all([
      loadYaml('data/site.yml'),
      loadYaml('data/scholar.yml', false)
    ]);
    return { ...site, scholar };
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

  function renderLinkedText(value, linkMap) {
    const source = text(value);
    const entries = Object.entries(linkMap || {})
      .filter(([, url]) => url)
      .sort((a, b) => b[0].length - a[0].length);
    if (entries.length === 0) return escapeHtml(source);

    let output = '';
    let index = 0;
    while (index < source.length) {
      let nextMatch = null;
      for (const [label, url] of entries) {
        const found = source.indexOf(label, index);
        if (found === -1) continue;
        if (!nextMatch || found < nextMatch.index || (found === nextMatch.index && label.length > nextMatch.label.length)) {
          nextMatch = { index: found, label, url };
        }
      }
      if (!nextMatch) {
        output += escapeHtml(source.slice(index));
        break;
      }
      output += escapeHtml(source.slice(index, nextMatch.index));
      output += `<a href="${escapeHtml(nextMatch.url)}" target="_blank" rel="noopener">${escapeHtml(nextMatch.label)}</a>`;
      index = nextMatch.index + nextMatch.label.length;
    }
    return output;
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
    const order = ['paper', 'code', 'project', 'demo', 'video', 'bibtex'];
    return order
      .filter((label) => links && Object.prototype.hasOwnProperty.call(links, label))
      .map((label) => [label, links[label]])
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

  function renderScholarMetrics(scholar) {
    if (!scholar || !scholar.metrics) return '';
    const metrics = [
      ['Citations', scholar.metrics.citations],
      ['h-index', scholar.metrics.h_index],
      ['i10-index', scholar.metrics.i10_index]
    ].filter(([, value]) => value !== undefined && value !== null && value !== '');
    if (metrics.length === 0) return '';
    const items = metrics.map(([label, value]) => `
      <span>
        <strong>${escapeHtml(value)}</strong>
        <em>${escapeHtml(label)}</em>
      </span>
    `).join('');
    return `
      <a class="scholar-metrics" href="${escapeHtml(scholar.profile_url || '#')}" target="_blank" rel="noopener" aria-label="Google Scholar metrics">
        ${items}
      </a>
    `;
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
          ${renderScholarMetrics(data.scholar)}
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
      .map((paragraph) => `<p>${renderLinkedText(paragraph, data.about.links)}</p>`)
      .join('');
    return renderSection('about', 'About', `<div class="prose">${paragraphs}</div>`);
  }

  function renderNews(news, extraClass = '') {
    if (!news || news.length === 0) return '';
    const items = news.map((item) => `
      <li>
        <time>${escapeHtml(item.date)}</time>
        <span>${escapeHtml(item.text)}</span>
      </li>
    `).join('');
    return renderSection('news', 'News', `<ul class="news-list">${items}</ul>`, extraClass);
  }

  function renderNewsAside(news) {
    if (!news || news.length === 0) return '';
    const items = news.map((item) => `
      <li>
        <time>${escapeHtml(item.date)}</time>
        <span>${escapeHtml(item.text)}</span>
      </li>
    `).join('');
    return `
      <aside class="desktop-news" aria-label="News">
        <h2>News</h2>
        <ul class="side-news-list">${items}</ul>
      </aside>
    `;
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

  function renderExperienceCards(experience) {
    const cards = (experience || []).map((entry) => {
      const linkHtml = renderLinks(entry.links);
      return `
        <article class="project-card">
          <img src="${escapeHtml(entry.image)}" alt="${escapeHtml(entry.image_alt || entry.title)}">
          <div class="card-body">
            <p class="venue">${escapeHtml(entry.period)}</p>
            <h3>${escapeHtml(entry.title)}</h3>
            <p class="summary">${escapeHtml(entry.summary)}</p>
            ${linkHtml ? `<div class="link-row">${linkHtml}</div>` : ''}
          </div>
        </article>
      `;
    }).join('');
    return renderSection('experience', 'Experience', cards);
  }

  function renderEducation(education) {
    const items = (education || []).map((entry) => {
      const details = (entry.details || [])
        .map((detail) => `<li>${escapeHtml(detail)}</li>`)
        .join('');
      return `
        <article class="education-card">
          <div class="education-logo-wrap">
            <img class="education-logo" src="${escapeHtml(entry.image)}" alt="${escapeHtml(entry.image_alt || entry.institution)}">
          </div>
          <div class="education-body">
            <p class="venue">${escapeHtml(entry.period)}</p>
            <h3>${escapeHtml(entry.institution)}</h3>
            <p class="meta">${escapeHtml(entry.degree)} · ${escapeHtml(entry.location)}</p>
            <ul>${details}</ul>
          </div>
        </article>
      `;
    }).join('');
    return renderSection('education', 'Education', `<div class="education-list">${items}</div>`);
  }

  function renderHonors(honors) {
    const items = (honors || [])
      .map((honor) => `<li>${escapeHtml(honor)}</li>`)
      .join('');
    return renderSection('honors', 'Honors', `<ul class="honor-list">${items}</ul>`);
  }

  function renderCollaborators(collaborators) {
    const items = (collaborators || []).map((collaborator) => `
      <li>
        ${collaborator.url ? `<a href="${escapeHtml(collaborator.url)}" target="_blank" rel="noopener">${escapeHtml(collaborator.name)}</a>` : `<span>${escapeHtml(collaborator.name)}</span>`}
        ${collaborator.note ? `<em>${escapeHtml(collaborator.note)}</em>` : ''}
      </li>
    `).join('');
    return renderSection('collaborators', 'Collaborators', `<ul class="collaborator-list">${items}</ul>`);
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
      <div class="content-layout">
        <main class="main-content">
          ${renderAbout(data)}
          ${renderNews(data.news, 'mobile-news')}
          ${renderPublications(data.publications)}
          ${renderExperienceCards(data.experience)}
          ${renderEducation(data.education)}
          ${renderCollaborators(data.collaborators)}
          ${renderHonors(data.honors)}
          ${renderCv(data.resume)}
        </main>
        ${renderNewsAside(data.news)}
      </div>
    `;
  }

  function enableSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const hash = link.getAttribute('href');
        if (!document.querySelector(hash)) return;
        event.preventDefault();
        history.pushState(null, '', hash);
        scrollToCurrentHash('smooth');
      });
    });
  }

  function scrollToCurrentHash(behavior = 'auto') {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    target.scrollIntoView({ behavior, block: 'start' });
  }

  function enableGlassHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  async function init() {
    const app = document.getElementById('app');
    try {
      const data = await loadSiteData();
      app.innerHTML = renderSite(data);
      enableSmoothAnchors();
      enableGlassHeader();
      requestAnimationFrame(() => scrollToCurrentHash());
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
