document.addEventListener("DOMContentLoaded", function() {
  // Only run animations on home page (check for main-title element)
  const isHomePage = document.querySelector('#main-title');
  
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);

  if (isHomePage) {
    // Auto-scroll to intro on first scroll event (only if starting at top of page)
    function autoScrollToIntro() {
      // Only auto-scroll if we're near the top of the page (not coming from a link)
      if (window.scrollY < 100) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: document.querySelector('.intro'), offsetY: 0 },
          ease: "power2.inOut"
        });
      }
      window.removeEventListener('scroll', autoScrollToIntro);
      window.removeEventListener('wheel', autoScrollToIntro);
    }
    
    // Only add listeners if we're starting near the top of the page
    if (window.scrollY < 100) {
      window.addEventListener('scroll', autoScrollToIntro, { once: true });
      window.addEventListener('wheel', autoScrollToIntro, { once: true });
    }
  }

 
//SplitText - only on home page
  if (isHomePage) {
    const introSection = document.querySelector('.intro');
    const intro = document.querySelector('.opacity-reveal');
    if (introSection && intro) {
      const splitLetters = SplitText.create(intro);
      gsap.set(splitLetters.chars, { opacity: 0.2, y: 0 });
      gsap.to(splitLetters.chars, {
        scrollTrigger: {
          trigger: introSection,
          start: 'top top',
          end: '+=400', 
          scrub: true,
          pin: true,
          pinSpacing: true
        },
        opacity: 1,
        duration: 1,
        stagger: 0.05,
        ease: 'none'
      });
    }
  }



 
  // Main title fade animation - only on home page
  if (isHomePage) {
    gsap.to("#main-title", {
      scrollTrigger: {
        trigger: "#main-title",
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      opacity: 0,
      y: -100,
      duration: 1
    });
  }


  // Change header colors when scrolling to intro section (only on home page)
  const introSectionForHeader = document.querySelector('.intro');
  if (introSectionForHeader) {
    ScrollTrigger.create({
      trigger: ".intro",
      start: "top top",
      end: "bottom top",
      toggleClass: {
        targets: [".name", ".nav a"],
        className: "white-text"
      }
    });
  }

  // Header hide/show on scroll for project pages
  const isProjectPage = document.querySelector('.project-detail');
  if (isProjectPage) {
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateHeader() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const header = document.querySelector('.header');
      
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
    
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', requestTick);
  }

});