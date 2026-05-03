document.addEventListener("DOMContentLoaded", function() {
  // Only run animations on home page (check for main-title element)
  const isHomePage = document.querySelector('#main-title');

  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);

  // Render data-driven UI early so it runs before any code below that might throw.
  try { setupCarousel(); } catch (err) { console.error('[carousel] setup failed:', err); }
  try { setupLibrary();  } catch (err) { console.error('[library] setup failed:', err); }
  
  // RESPONSIVE DESIGN SYSTEM FOR GSAP ANIMATIONS
  const BREAKPOINTS = {
    smallMobile: 475,
    mobile: 768,
    laptop: 1024
  };
  
  // Get current screen size category
  function getScreenSize() {
    const width = window.innerWidth;
    if (width <= BREAKPOINTS.smallMobile) return 'smallMobile';
    if (width <= BREAKPOINTS.mobile) return 'mobile';
    if (width <= BREAKPOINTS.laptop) return 'laptop';
    return 'desktop';
  }
  
  // Responsive animation values based on screen size
  function getResponsiveValues() {
    const screenSize = getScreenSize();
    
    switch(screenSize) {
      case 'smallMobile':
        return {
          heroFadeDistance: -30,
          introScrollEnd: '+=400',
          splitTextStagger: 0.015,
          autoScrollDuration: 0.6,
          headerHideThreshold: 30
        };
      case 'mobile':
        return {
          heroFadeDistance: -50,
          introScrollEnd: '+=500',
          splitTextStagger: 0.02,
          autoScrollDuration: 0.8,
          headerHideThreshold: 50
        };
      case 'laptop':
        return {
          heroFadeDistance: -75,
          introScrollEnd: '+=350',
          splitTextStagger: 0.04,
          autoScrollDuration: 0.9,
          headerHideThreshold: 75
        };
      default: // desktop
        return {
          heroFadeDistance: -100,
          introScrollEnd: '+=400',
          splitTextStagger: 0.05,
          autoScrollDuration: 1,
          headerHideThreshold: 100
        };
    }
  }
  
  // Ensure header has consistent styling on all screen sizes
  function ensureHeaderStyling() {
    const header = document.querySelector('.header');
    const name = document.querySelector('.name');
    const navLinks = document.querySelectorAll('.nav a');
    
    if (header && !document.body.classList.contains('contact-page')) {
      // Always ensure header has background and dark text on all screen sizes
      header.style.background = 'var(--light-color)';
      
      
      // Ensure text is always dark (remove any white-text classes)
      if (name) {
        name.classList.remove('white-text');
        name.style.color = 'var(--secondary-color)';
      }
      
      navLinks.forEach(link => {
        link.classList.remove('white-text');
        link.style.color = 'var(--primary-color)';
      });
    }
  }
  
  // Responsive refresh function
  function refreshResponsiveAnimations() {
    ScrollTrigger.refresh();
    ensureHeaderStyling(); // Always maintain consistent header styling
  }
  
  // Initialize header styling immediately
  ensureHeaderStyling();
  
  // Listen for resize events and refresh animations
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(refreshResponsiveAnimations, 250);
  });

  // Intro paragraph: fade in chars as it enters the viewport (no pinning).
  if (isHomePage) {
    const intro = document.querySelector('.opacity-reveal');
    const screenSize = getScreenSize();
    if (intro && screenSize !== 'smallMobile' && screenSize !== 'mobile') {
      const values = getResponsiveValues();
      const splitLetters = SplitText.create(intro);
      gsap.set(splitLetters.chars, { opacity: 0.2, y: 0 });
      gsap.to(splitLetters.chars, {
        scrollTrigger: {
          trigger: intro,
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: true
        },
        opacity: 1,
        duration: 1,
        stagger: values.splitTextStagger,
        ease: 'none'
      });
    }
  }

  // Mobile header hide/show behavior 
  const screenSize = getScreenSize();
  if (screenSize === 'smallMobile' || screenSize === 'mobile') {
    const header = document.querySelector('.header');
    
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateMobileHeader() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down - hide header
        header.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up - show header
        header.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      ticking = false;
    }
    
    function requestMobileTick() {
      if (!ticking) {
        requestAnimationFrame(updateMobileHeader);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', requestMobileTick);
  }

  // Header hide/show on scroll for project pages
  const isProjectPage = document.querySelector('.project-detail');
  if (isProjectPage) {
    const values = getResponsiveValues();
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateHeader() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const header = document.querySelector('.header');
      
      if (scrollTop > lastScrollTop && scrollTop > values.headerHideThreshold) {
        // Scrolling down - hide header
        header.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up - show header
        header.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      ticking = false;
    }
    
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', requestTick);
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