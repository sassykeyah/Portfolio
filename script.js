document.addEventListener("DOMContentLoaded", function() {
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

 
//SplitText
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


  ScrollTrigger.create({
    trigger: ".intro",
    start: "top top",
    end: "bottom top",
    toggleClass: {
      targets: [".name", ".nav a"],
      className: "white-text"
    }
  });

  
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