document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page || "";
  const host = window.location.hostname || "";
  const pageNames = {
    home: "Inicio",
    estudio: "Estudio",
    galeria: "Galeria",
    equipo: "Equipo",
    blog: "Blog",
    reservas: "Reservas"
  };

  const toTitleCase = (value) => value
    .replace(/([0-9]+)([a-zA-Z])/g, "$1 $2")
    .replace(/([a-zA-Z])([0-9]+)/g, "$1 $2")
    .split(/[-\s_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

  const getStudioName = () => {
    const parts = host.split(".").filter(Boolean);
    if (!parts.length) {
      return "Nocturne Ink";
    }

    const cleanParts = parts[0] === "www" ? parts.slice(1) : parts;
    const domainLabel = cleanParts[0];
    if (!domainLabel) {
      return "Nocturne Ink";
    }

    return toTitleCase(domainLabel);
  };

  const studioName = getStudioName();

  document.querySelectorAll(".brand").forEach((brand) => {
    brand.innerHTML = studioName.toUpperCase().replace(/\s+/g, "<span>&middot;</span>");
    brand.setAttribute("aria-label", studioName);
  });

  document.querySelectorAll("[data-page-link]").forEach((link) => {
    if (link.dataset.pageLink === page) {
      link.classList.add("active");
    }
  });

  const footerCopy = document.querySelector(".footer-copy");
  if (footerCopy) {
    footerCopy.textContent = `(c) 2026 ${studioName} · Madrid · Tattoo studio by appointment only`;
  }

  const pageLabel = pageNames[page];
  if (pageLabel) {
    document.title = page === "home" ? `${studioName} | Tattoo Studio Madrid` : `${pageLabel} | ${studioName}`;
  }

  const form = document.querySelector("[data-reserve-form]");
  const status = document.querySelector("[data-form-status]");
  if (form && status) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = form.querySelector('[name="name"]')?.value?.trim() || "tu solicitud";
      status.textContent = `Solicitud enviada. Revisamos ${name} y respondemos en menos de 24 horas.`;
      form.reset();
    });
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealNodes = document.querySelectorAll(".reveal");

  const showFallback = () => {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  };

  if (prefersReducedMotion) {
    showFallback();
    return;
  }

  if (window.gsap) {
    if (window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    window.gsap.defaults({ ease: "power3.out", duration: 1 });
    const mm = window.gsap.matchMedia();

    window.gsap.set(revealNodes, { autoAlpha: 0, y: 34 });

    mm.add("(min-width: 0px)", () => {
      revealNodes.forEach((node) => {
        window.gsap.to(node, {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          scrollTrigger: window.ScrollTrigger ? {
            trigger: node,
            start: "top 86%"
          } : undefined,
          onComplete: () => node.classList.add("is-visible")
        });
      });

      const heroTitle = document.querySelector(".hero-title");
      const heroText = document.querySelector(".hero-text");
      const heroActions = document.querySelector(".hero-actions");
      const heroVisual = document.querySelector(".hero-visual");
      const heroImage = document.querySelector(".hero-image");
      const floatingNotes = document.querySelectorAll(".floating-note");
      const statCards = document.querySelectorAll(".stat-card");
      const marqueeTrack = document.querySelector(".marquee-track");
      const quoteCards = document.querySelectorAll(".quote-card");
      const galleryCards = document.querySelectorAll(".gallery-card, .artist-card, .blog-card");

      const heroTl = window.gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTl
        .from(".site-header", { y: -28, autoAlpha: 0, duration: 0.9 })
        .from(heroTitle, { yPercent: 18, autoAlpha: 0, duration: 1.2 }, "-=0.45")
        .from(heroText, { y: 20, autoAlpha: 0, duration: 0.9 }, "-=0.8")
        .from(heroActions, { y: 20, autoAlpha: 0, duration: 0.8 }, "-=0.6")
        .from(statCards, { y: 26, autoAlpha: 0, stagger: 0.1, duration: 0.8 }, "-=0.55")
        .from(heroVisual, { scale: 0.96, autoAlpha: 0, duration: 1.15 }, "-=1")
        .from(floatingNotes, { y: 24, autoAlpha: 0, stagger: 0.16, duration: 0.8 }, "-=0.75");

      if (heroImage && window.ScrollTrigger && window.innerWidth > 980) {
        window.gsap.to(heroImage, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            scrub: true
          }
        });
      }

      if (marqueeTrack) {
        const distance = Math.max(marqueeTrack.scrollWidth / 2, 300);
        window.gsap.to(marqueeTrack, {
          x: -distance,
          duration: 20,
          ease: "none",
          repeat: -1
        });
      }

      quoteCards.forEach((card, index) => {
        window.gsap.from(card, {
          y: 32,
          rotation: index % 2 === 0 ? -1.2 : 1.2,
          autoAlpha: 0,
          duration: 0.9,
          scrollTrigger: window.ScrollTrigger ? {
            trigger: card,
            start: "top 88%"
          } : undefined
        });
      });

      galleryCards.forEach((card) => {
        const media = card.querySelector("img");
        if (!media) return;

        window.gsap.from(card, {
          y: 32,
          autoAlpha: 0,
          duration: 0.9,
          scrollTrigger: window.ScrollTrigger ? {
            trigger: card,
            start: "top 88%"
          } : undefined
        });

        if (window.ScrollTrigger) {
          window.gsap.to(media, {
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              scrub: true,
              start: "top bottom",
              end: "bottom top"
            }
          });
        }
      });

      return () => {
        if (window.ScrollTrigger) {
          window.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        }
      };
    });

    return;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealNodes.forEach((node) => observer.observe(node));
    return;
  }

  showFallback();
});
