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
<<<<<<< HEAD


// Scroll reveal: progressive enhancement; content remains visible without JS.
const revealItems = document.querySelectorAll(
  '.q-timeline-item, .skill-panel, .technology-cloud-wrapper, .skills-callout'
);

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealItems.forEach((item, index) => {
    item.classList.add('js-reveal');
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
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
=======
>>>>>>> cb26e0d439cd6dea7c9ccc7ed27e814a634020cd
