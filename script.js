document.addEventListener("DOMContentLoaded", function() {
  // Only run animations on home page (check for main-title element)
  const isHomePage = document.querySelector('#main-title');
  
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);
  

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
  
  // Responsive refresh function
  function refreshResponsiveAnimations() {
    ScrollTrigger.refresh();
  }
  
  // Listen for resize events and refresh animations
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(refreshResponsiveAnimations, 250);
  });

  if (isHomePage) {
    // Auto-scroll to intro on first scroll event (only if starting at top of page)
    // Disabled on mobile devices for better control
    function autoScrollToIntro() {
      const values = getResponsiveValues();
      const screenSize = getScreenSize();
      
      // Skip auto-scroll on mobile devices
      if (screenSize === 'smallMobile' || screenSize === 'mobile') {
        return;
      }
      
      // Only auto-scroll if we're near the top of the page (not coming from a link)
      if (window.scrollY < 100) {
        gsap.to(window, {
          duration: values.autoScrollDuration,
          scrollTo: { y: document.querySelector('.intro'), offsetY: 0 },
          ease: "power2.inOut"
        });
      }
      window.removeEventListener('scroll', autoScrollToIntro);
      window.removeEventListener('wheel', autoScrollToIntro);
    }
    
    // Only add listeners if we're starting near the top of the page and not on mobile
    const screenSize = getScreenSize();
    if (window.scrollY < 100 && screenSize !== 'smallMobile' && screenSize !== 'mobile') {
      window.addEventListener('scroll', autoScrollToIntro, { once: true });
      window.addEventListener('wheel', autoScrollToIntro, { once: true });
    }
  }

 
//SplitText - only on home page
  if (isHomePage) {
    const introSection = document.querySelector('.intro');
    const intro = document.querySelector('.opacity-reveal');
    if (introSection && intro) {
      const values = getResponsiveValues();
      const screenSize = getScreenSize();
      
      // Only desktop gets animations - mobile has no intro animations
      if (screenSize !== 'smallMobile' && screenSize !== 'mobile') {
        const splitLetters = SplitText.create(intro);
        gsap.set(splitLetters.chars, { opacity: 0.2, y: 0 });
        
        // Desktop: Keep original pinned scrub behavior
        gsap.to(splitLetters.chars, {
          scrollTrigger: {
            trigger: introSection,
            start: 'top top',
            end: values.introScrollEnd, 
            scrub: true,
            pin: true,
            pinSpacing: true
          },
          opacity: 1,
          duration: 1,
          stagger: values.splitTextStagger,
          ease: 'none'
        });
      }
    }
  }



 
  // Main title fade animation - only on home page (disabled on mobile)
  if (isHomePage) {
    const values = getResponsiveValues();
    const screenSize = getScreenSize();
    
    // Only apply hero fade on laptop and desktop, not on mobile
    if (screenSize !== 'smallMobile' && screenSize !== 'mobile') {
      gsap.to("#main-title", {
        scrollTrigger: {
          trigger: "#main-title",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        opacity: 0,
        y: values.heroFadeDistance,
        duration: 1
      });
    }
  }


  // Change header colors when scrolling to intro section (only on home page)
  const introSectionForHeader = document.querySelector('.intro');
  if (introSectionForHeader) {
    // Simple color change: black at hero, white at intro for all devices
    ScrollTrigger.create({
      trigger: ".intro",
      start: "top center",
      end: "bottom center",
      toggleClass: {
        targets: [".name", ".nav a"],
        className: "white-text"
      }
    });
  }

  // Mobile header hide/show behavior with background
  const screenSize = getScreenSize();
  if (screenSize === 'smallMobile' || screenSize === 'mobile') {
    const header = document.querySelector('.header');
    
    // Add background color to header on mobile
    header.style.backgroundColor = '#F7F1E5';
    header.style.zIndex = '9999';
    header.style.borderBottom = '1px solid rgba(26, 26, 25, 0.1)';
    
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
  
  // ==========================================================================
  // RESPONSIVE DESIGN RULE AND DOCUMENTATION
  // ==========================================================================
  
  /*
  RESPONSIVE DESIGN RULE FOR GSAP/JAVASCRIPT:
  
  1. ALL new animations must use getResponsiveValues() function
  2. Define responsive values in the getResponsiveValues() switch statement
  3. Test animations on all four breakpoints: small mobile (≤475px), mobile (≤768px), laptop (≤1024px), desktop (>1024px)
  4. Use consistent breakpoint values that match CSS media queries
  5. Consider performance on mobile devices - reduce complex animations if needed
  6. Always include ScrollTrigger.refresh() for resize events
  7. Responsive values to consider:
     - Animation distances (y, x transforms)
     - Duration and timing
     - Stagger values for text animations
     - Trigger points and thresholds
     - Pin spacing and offsets
  
  IMPLEMENTATION CHECKLIST:
  ☐ Define responsive values in getResponsiveValues()
  ☐ Use values object instead of hardcoded numbers
  ☐ Test on small mobile, mobile, laptop, and desktop
  ☐ Ensure smooth resize behavior
  ☐ Check performance on lower-end devices
  
  BREAKPOINTS:
  - Small Mobile: ≤475px (Minimal animations, optimized for very small screens)
  - Mobile: ≤768px (Touch-first, simplified animations)
  - Laptop: ≤1024px (Medium complexity, moderate values)
  - Desktop: >1024px (Full complexity, optimal experience)
  */

  // Email SVG Animation for Contact Page
  console.log("Looking for email elements...");
  const emailContainer = document.getElementById("email-hover-area");
  const emailLink = document.getElementById("email-link");
  const emailPath = document.getElementById("email-path");
  const emailText = document.querySelector(".email-text");
  
  console.log("Email container:", emailContainer);
  console.log("Email link:", emailLink);
  console.log("Email path:", emailPath);
  console.log("Email text:", emailText);
  
  if (emailContainer && emailPath) {
    console.log("Email elements found, setting up animation...");
    
    // Set initial path state
    gsap.set("#email-path", {
      attr: { d: "M 70,175 Q 700,175 1330,175" }
    });

    const animateTo = (d, ease, duration = 1) => {
      console.log("Animating to:", d);
      gsap.killTweensOf("#email-path");
      gsap.to("#email-path", {
        attr: { d },
        ease,
        duration
      });
    };

    // Function to handle hover in
    const handleHoverIn = () => {
      console.log("Hover in detected");
      animateTo("M 70,175 Q 700,125 1330,175", "elastic.out(1.4, 0.4)", 0.8);
    };

    // Function to handle hover out
    const handleHoverOut = () => {
      console.log("Hover out detected");
      animateTo("M 70,175 Q 700,175 1330,175", "elastic.out(1.8, 0.2)", 1.5);
    };

    // Add event listeners to the container for larger hover area
    emailContainer.addEventListener("mouseenter", handleHoverIn);
    emailContainer.addEventListener("mouseleave", handleHoverOut);
    
    // Also add to link as backup
    if (emailLink) {
      emailLink.addEventListener("mouseenter", handleHoverIn);
      emailLink.addEventListener("mouseleave", handleHoverOut);
    }
    
    console.log("Event listeners added successfully");
  } else {
    console.log("Email elements not found!");
  }

});