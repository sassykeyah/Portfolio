document.addEventListener("DOMContentLoaded", function() {
  gsap.registerPlugin(ScrollTrigger);

  // Auto-scroll to paragraph when h1 leaves viewport
  ScrollTrigger.create({
    trigger: "#main-title",
    start: "bottom top",
    onLeave: function() {
      document.getElementById("main-paragraph").scrollIntoView({ behavior: "smooth" });
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
});