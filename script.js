document.addEventListener("DOMContentLoaded", function() {
  // Auto-scroll to intro on the user's first scroll event, but allow free scrolling after
  function autoScrollToIntro() {
    gsap.to(window, {
      duration: 0.8,
      scrollTo: { y: document.querySelector('.intro'), offsetY: 0 },
      ease: "power2.inOut"
    });
    window.removeEventListener('scroll', autoScrollToIntro);
  }
  window.addEventListener('scroll', autoScrollToIntro, { once: true });
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);

 
// Animate each letter in .opacity-reveal on scroll using SplitText
  const introSection = document.querySelector('.intro');
  const intro = document.querySelector('.opacity-reveal');
  if (introSection && intro) {
    const splitLetters = SplitText.create(intro);
    gsap.set(splitLetters.chars, { opacity: 0.2, y: 0 });
    gsap.to(splitLetters.chars, {
      scrollTrigger: {
        trigger: introSection,
        start: 'top top',
        end: '+=400', // Pin for 400px scroll distance
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



  // Fade out main title on scroll
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

  

  // Animate each project layout in on scroll
  gsap.utils.toArray('.project-layout').forEach(function(project) {
    gsap.from(project, {
      scrollTrigger: {
        trigger: project,
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 100,
      duration: 1
    });
  });
});