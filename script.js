document.addEventListener("DOMContentLoaded", function() {
  gsap.registerPlugin(ScrollTrigger);

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

  // Auto-scroll to paragraph when h1 leaves viewport, centering it in the viewport
  ScrollTrigger.create({
    trigger: "#main-title",
    start: "bottom top",
    onLeave: function() {
      document.getElementById("main-paragraph").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  // Animate paragraph in
  gsap.from("#main-paragraph", {
    scrollTrigger: {
      trigger: "#main-paragraph",
      start: "top 90%",
      toggleActions: "play none none none"
    },
    opacity: 0,
    y: 100,
    scale: 0.8,
    duration: 1.2
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