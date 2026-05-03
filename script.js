document.addEventListener("DOMContentLoaded", function() {
  // Render data-driven UI first so it runs before anything else that might throw.
  try { setupCarousel(); } catch (err) { console.error('[carousel] setup failed:', err); }
  try { setupLibrary();  } catch (err) { console.error('[library] setup failed:', err); }

  // Header styling: cream background with green name + dark nav on every page.
  const header = document.querySelector('.header');
  const name = document.querySelector('.name');
  const navLinks = document.querySelectorAll('.nav a');
  if (header) {
    header.style.background = 'var(--light-color)';
    if (name) {
      name.classList.remove('white-text');
      name.style.color = 'var(--secondary-color)';
    }
    navLinks.forEach(link => {
      link.classList.remove('white-text');
      link.style.color = 'var(--primary-color)';
    });
  }

  // ===== PROJECT CARD FACTORY (shared by carousel + library) =====
  function buildProjectCard(project) {
    const card = document.createElement('article');
    card.className = `project-card project-card--${project.type}`;
    card.dataset.projectId = project.id;

    const link = document.createElement('a');
    link.href = project.href;
    link.className = 'project-card__link';
    link.setAttribute('aria-label', `View case study: ${project.title}`);

    const img = document.createElement('img');
    img.src = project.thumbnail;
    img.alt = project.thumbnailAlt || '';
    img.className = 'project-card__image';
    img.loading = 'lazy';
    link.appendChild(img);

    const body = document.createElement('div');
    body.className = 'project-card__body';

    const metaTop = document.createElement('div');
    metaTop.className = 'project-card__meta-top';

    const typeBadge = document.createElement('span');
    typeBadge.className = 'project-card__type';
    typeBadge.textContent = project.type === 'web' ? 'Web / UX' : 'Graphic Design';
    metaTop.appendChild(typeBadge);

    const year = document.createElement('span');
    year.className = 'project-card__year';
    year.textContent = project.year;
    metaTop.appendChild(year);

    body.appendChild(metaTop);

    const title = document.createElement('h3');
    title.className = 'project-card__title';
    title.textContent = project.title;
    body.appendChild(title);

    const summary = document.createElement('p');
    summary.className = 'project-card__summary';
    summary.textContent = project.summary;
    body.appendChild(summary);

    link.appendChild(body);
    card.appendChild(link);
    return card;
  }

  // ===== FEATURED CAROUSEL =====
  function setupCarousel() {
    const carousel = document.querySelector('#featured-carousel');
    if (!carousel || typeof PROJECTS === 'undefined') return;

    const track = carousel.querySelector('.carousel-track');
    const indicators = carousel.querySelector('.carousel-indicators');
    const featured = PROJECTS.filter(p => p.featured);
    if (featured.length === 0) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    featured.forEach((p, i) => {
      const slide = document.createElement('li');
      slide.className = 'carousel-slide';
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${i + 1} of ${featured.length}: ${p.title}`);
      slide.dataset.index = String(i);
      slide.appendChild(buildProjectCard(p));
      track.appendChild(slide);

      const dot = document.createElement('li');
      const dotBtn = document.createElement('button');
      dotBtn.type = 'button';
      dotBtn.setAttribute('aria-label', `Go to slide ${i + 1}: ${p.title}`);
      dotBtn.setAttribute('aria-selected', 'false');
      dotBtn.addEventListener('click', () => go(i));
      dot.appendChild(dotBtn);
      indicators.appendChild(dot);
    });

    let current = 0;
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const dots = Array.from(indicators.querySelectorAll('button'));

    function getOffsets() {
      const w = window.innerWidth;
      if (w <= 429) return { peek: 0, scale: 0.85, opacity: 0 };
      if (w <= 768) return { peek: 0, scale: 0.85, opacity: 0 };
      if (w <= 1024) return { peek: 60, scale: 0.78, opacity: 0.45 };
      return { peek: 70, scale: 0.78, opacity: 0.5 };
    }

    function update(animated = true) {
      const { peek, scale, opacity } = getOffsets();
      const n = featured.length;

      slides.forEach((slide, i) => {
        let offset = i - current;
        if (offset > n / 2) offset -= n;
        if (offset < -n / 2) offset += n;

        const isCurrent = offset === 0;
        const isPeek = Math.abs(offset) === 1;
        const visible = isCurrent || isPeek;

        const targetProps = {
          xPercent: offset * peek,
          scale: isCurrent ? 1 : scale,
          opacity: isCurrent ? 1 : (isPeek ? opacity : 0),
          zIndex: isCurrent ? 3 : (isPeek ? 1 : 0)
        };

        if (animated && !reduced) {
          gsap.to(slide, { ...targetProps, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
        } else {
          gsap.set(slide, targetProps);
        }

        slide.setAttribute('aria-hidden', isCurrent ? 'false' : 'true');
        const innerLink = slide.querySelector('a');
        if (innerLink) innerLink.tabIndex = isCurrent ? 0 : -1;
        slide.style.pointerEvents = visible ? 'auto' : 'none';
      });

      dots.forEach((d, i) => {
        d.setAttribute('aria-selected', String(i === current));
      });
    }

    function go(n) {
      const len = featured.length;
      current = ((n % len) + len) % len;
      update(true);
    }
    function next() { go(current + 1); }
    function prev() { go(current - 1); }

    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => update(false), 150);
    });

    update(false);
  }

  // ===== PROJECT LIBRARY (grid + type filter) =====
  function setupLibrary() {
    const grid = document.querySelector('#project-library-grid');
    if (!grid || typeof PROJECTS === 'undefined') return;

    const filterButtons = Array.from(document.querySelectorAll('.library-filter button'));
    let currentFilter = 'all';

    function render() {
      grid.innerHTML = '';
      const list = PROJECTS.filter(p => currentFilter === 'all' || p.type === currentFilter);
      if (list.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'library-empty';
        empty.textContent = 'No projects in this category yet.';
        grid.appendChild(empty);
        return;
      }
      list.forEach(p => grid.appendChild(buildProjectCard(p)));
    }

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        currentFilter = btn.dataset.filter || 'all';
        render();
      });
    });

    render();
  }


});