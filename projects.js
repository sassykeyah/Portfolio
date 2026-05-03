const PROJECTS = [
  {
    id: "404-not-found",
    type: "web",
    title: "24hr Design Challenge — 404: Page Not Found",
    summary: "An interactive narrative built in 24 hours, exploring digital disconnection through the metaphor of 404 errors.",
    thumbnail: "assets/404-not-found.webp",
    thumbnailAlt: "Collation of screenshots from the 404: Page Not Found project showing a dark console-style interactive interface",
    year: "2024",
    featured: true,
    href: "project1.html"
  },
  {
    id: "spotify-rewind",
    type: "web",
    title: "Spotify Rewind",
    summary: "An interactive timeline pairing Australia's historical moments with the most popular ARIA songs of each year.",
    thumbnail: "assets/spotify-rewind.webp",
    thumbnailAlt: "Screenshot of the Spotify Rewind home page showing a retro 80s-style interactive timeline",
    year: "2024",
    featured: true,
    href: "project2.html"
  },
  {
    id: "tactile-maps",
    type: "graphic",
    title: "House of Representatives & Senate — Tactile Maps",
    summary: "Tactile chamber maps commissioned by the Parliamentary Education Office for visitors who are vision impaired.",
    thumbnail: "assets/tactile-maps.webp",
    thumbnailAlt: "Tactile maps of the House of Representatives and Senate chambers with raised textures and braille labels",
    year: "2024",
    featured: true,
    href: "project3.html"
  }
];

function validateProjects(projects) {
  const seenIds = new Set();
  const required = ["id", "type", "title", "summary", "thumbnail", "thumbnailAlt", "year", "featured", "href"];
  const allowedTypes = ["web", "graphic"];

  projects.forEach((p, i) => {
    required.forEach(key => {
      if (p[key] === undefined || p[key] === null || p[key] === "") {
        console.error(`[projects] Project at index ${i} (${p.id || "no id"}) is missing required field: ${key}`);
      }
    });

    if (!allowedTypes.includes(p.type)) {
      console.error(`[projects] Project ${p.id} has invalid type: ${p.type}. Must be "web" or "graphic".`);
    }

    if (seenIds.has(p.id)) {
      console.error(`[projects] Duplicate project id: ${p.id}`);
    }
    seenIds.add(p.id);

    if (typeof p.summary === "string" && p.summary.length > 200) {
      console.warn(`[projects] Summary for ${p.id} is longer than 200 chars — keep to one sentence.`);
    }
  });
}

validateProjects(PROJECTS);
