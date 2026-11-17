const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('is-open');
    });
  });
}

const yearElement = document.getElementById('current-year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


// Scroll reveals: each card enters with its own motion style.
const revealItems = document.querySelectorAll(
  '.q-timeline-item, .skill-panel, .toolkit-card, .about-portrait-card, .about-main-panel, .compact-card, .skills-callout'
);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Home page: letter reveal, scroll entrances, progress indicator and project-card light.
(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  document.body.classList.add('home-motion-page');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Wrap the hero name in spans so each character can arrive in sequence.
  const title = document.getElementById('hero-title');
  if (title && !title.querySelector('.name-letter') && !reducedMotion) {
    const textNodes = [];
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim() || node.parentElement.closest('.heading-period')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    let letterIndex = 0;
    textNodes.forEach((textNode) => {
      const fragment = document.createDocumentFragment();
      [...textNode.nodeValue].forEach((character) => {
        if (/\s/.test(character)) {
          fragment.appendChild(document.createTextNode(character));
          return;
        }
        const letter = document.createElement('span');
        letter.className = 'name-letter';
        letter.setAttribute('aria-hidden', 'true');
        letter.style.setProperty('--letter-index', letterIndex++);
        letter.textContent = character;
        fragment.appendChild(letter);
      });
      textNode.replaceWith(fragment);
    });
  }

  // Keep the heading accessible even though its visual letters are split apart.
  if (title) title.setAttribute('aria-label', 'Nibin Shijo');

  if (reducedMotion) return;

  requestAnimationFrame(() => document.body.classList.add('home-motion-ready'));

  // Scroll progress indicator for the full home page.
  const progress = document.createElement('div');
  progress.className = 'home-scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  let progressPending = false;
  const updateProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollableHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    progressPending = false;
  };
  const requestProgressUpdate = () => {
    if (!progressPending) {
      progressPending = true;
      requestAnimationFrame(updateProgress);
    }
  };
  updateProgress();
  window.addEventListener('scroll', requestProgressUpdate, { passive: true });
  window.addEventListener('resize', requestProgressUpdate);

  // Bring each content block into view with its own direction and a small stagger.
  const homeRevealItems = [...document.querySelectorAll('[data-home-reveal]')];
  homeRevealItems.forEach((item, index) => {
    item.classList.add('home-reveal');
    item.style.setProperty('--home-delay', `${Math.min(index % 4, 3) * 95}ms`);
  });

  if ('IntersectionObserver' in window) {
    const homeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-home-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -42px 0px' });
    homeRevealItems.forEach((item) => homeObserver.observe(item));
  } else {
    homeRevealItems.forEach((item) => item.classList.add('is-home-visible'));
  }

  // A subtle cursor-following highlight and restrained 3D tilt on project cards.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer) {
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty('--spot-x', `${Math.round(x * 100)}%`);
        card.style.setProperty('--spot-y', `${Math.round(y * 100)}%`);
        card.style.setProperty('--tilt-x', `${((.5 - y) * 3).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${((x - .5) * 3).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }
})();


if ('IntersectionObserver' in window && !reduceMotion) {
  revealItems.forEach((item, index) => {
    item.classList.add('js-reveal');
    item.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 85}ms`);
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -45px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

// The qualification timeline fills its centre rail as the visitor scrolls.
const qualificationTimeline = document.querySelector('.q-timeline');
if (qualificationTimeline && !reduceMotion) {
  const updateTimelineProgress = () => {
    const bounds = qualificationTimeline.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1,
      (window.innerHeight * 0.72 - bounds.top) / Math.max(bounds.height, 1)
    ));
    qualificationTimeline.style.setProperty('--timeline-progress', `${progress * 100}%`);
  };

  updateTimelineProgress();
  window.addEventListener('scroll', updateTimelineProgress, { passive: true });
  window.addEventListener('resize', updateTimelineProgress);
}


/* ==========================================
   QUALIFICATION POPUP FUNCTIONALITY
========================================== */

(() => {

    const modal = document.getElementById("qualification-modal");

    if (!modal) return;

    const profiles = {

        mca: {
            title: "Santhigiri College of Computer Sciences",
            description: "The institution offering the Master of Computer Applications programme. The programme develops knowledge in programming, software development, databases and advanced computer applications.",
            facts: [
                ["Course", "Master of Computer Applications"],
                ["Period", "2025 – Present"],
                ["University", "Mahatma Gandhi University"],
                ["Location", "Vazhithala, Thodupuzha"],
                ["CGPA", "7.16 / 10"]
            ],
            website: "https://santhigiricollege.ac.in/"
        },

        bca: {
            title: "Santhigiri College of Computer Sciences",
            description: "The institution where the Bachelor of Computer Applications programme was completed. The programme provides a foundation in computer science, programming, databases and software development.",
            facts: [
                ["Course", "Bachelor of Computer Applications"],
                ["Period", "2022 – 2025"],
                ["University", "Mahatma Gandhi University"],
                ["Location", "Vazhithala, Thodupuzha"],
                ["CGPA", "6.23 / 10"]
            ],
            website: "https://santhigiricollege.ac.in/"
        },

        "higher-secondary": {
            title: "St Joseph HSS School, Karimannoor",
            description: "The school associated with the Higher Secondary qualification. It provides higher secondary education that prepares students for university studies and future career opportunities.",
            facts: [
                ["Qualification", "Higher Secondary"],
                ["Institution", "St Joseph HSS"],
                ["Location", "Karimannoor, Thodupuzha"],
                ["Percentage", "75%"]
            ],
            website: "https://share.google/6T91s14Z7utuvH4TU"
        },

        sslc: {
            title: "St Joseph HSS School, Karimannoor",
            description: "The school associated with the SSLC qualification. Secondary education provides a foundation in core academic subjects and prepares students for higher secondary studies.",
            facts: [
                ["Qualification", "SSLC"],
                ["Institution", "St Joseph HSS"],
                ["Location", "Karimannoor, Thodupuzha"],
                ["Percentage", "88%"]
            ],
            website: "https://share.google/6T91s14Z7utuvH4TU"
        }

    };

    const title = document.getElementById("modal-title");
    const description = document.getElementById("modal-description");
    const facts = document.getElementById("modal-facts");
    const website = document.getElementById("modal-website");
    const closeButton = document.getElementById("modal-close");

    let previousCard = null;

    function openPopup(card) {

        const data = profiles[card.dataset.qualification];

        if (!data) return;

        previousCard = card;

        title.textContent = data.title;
        description.textContent = data.description;

        facts.replaceChildren();

        data.facts.forEach(([label, value]) => {

            const item = document.createElement("div");
            item.className = "modal-fact-item";

            const heading = document.createElement("span");
            heading.className = "modal-fact-label";
            heading.textContent = label;

            const detail = document.createElement("strong");
            detail.className = "modal-fact-value";
            detail.textContent = value;

            item.append(heading, detail);
            facts.appendChild(item);

        });

        website.href = data.website;

        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-open");

        closeButton.focus();
    }

    function closePopup() {

        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("modal-open");

        if (previousCard) {
            previousCard.focus();
        }

    }

    // Click qualification cards
    document.querySelectorAll("[data-qualification]").forEach(card => {

        card.addEventListener("click", () => {
            openPopup(card);
        });

        card.addEventListener("keydown", event => {

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPopup(card);
            }

        });

    });

    // Close button
    closeButton.addEventListener("click", closePopup);

    // Close on background click
    modal.querySelectorAll("[data-modal-close]").forEach(button => {
        button.addEventListener("click", closePopup);
    });

    // Close using Escape
    document.addEventListener("keydown", event => {

        if (event.key === "Escape" && !modal.hidden) {
            closePopup();
        }

    });

})();
