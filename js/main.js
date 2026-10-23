const root = document.documentElement;
const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const topicSearchInputs = [...document.querySelectorAll("[data-topic-search]")];
const tutorialCards = [...document.querySelectorAll(".tutorial-card")];
const searchEmpty = document.querySelector("[data-search-empty]");
const codeTabs = [...document.querySelectorAll("[data-code-tab]")];
const codeOutput = document.querySelector("[data-code-output]");
const copyButton = document.querySelector("[data-copy-code]");
const previewAction = document.querySelector("[data-preview-action]");
const year = document.querySelector("[data-year]");
const revealElements = [...document.querySelectorAll("[data-reveal]")];

const tutorialCode = {
  html: '<p>Start learning.</p>',
  css: 'p {\n  color: #102d35;\n  font-family: sans-serif;\n  font-size: 1.5rem;\n}',
  js: 'const button = document.querySelector("button");\n\nbutton.addEventListener("click", () => {\n  button.textContent = "Nice work!";\n});',
};

let lastSearch = "";

const closeMenu = () => {
  menuToggle.setAttribute("aria-expanded", "false");
  mobileMenu.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuToggle.querySelector(".sr-only").textContent = "Open navigation menu";
};

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  mobileMenu.classList.toggle("is-open", !open);
  document.body.classList.toggle("menu-open", !open);
  menuToggle.querySelector(".sr-only").textContent = open
    ? "Open navigation menu"
    : "Close navigation menu";
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
    closeMenu();
    menuToggle.focus();
  }
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || savedTheme === "dark") {
  root.dataset.theme = savedTheme;
}

const updateThemeLabel = () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  themeToggle.setAttribute("aria-label", `Switch to ${next} theme`);
};

updateThemeLabel();

themeToggle.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", root.dataset.theme);
  updateThemeLabel();
});

const updateScrollState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 4);
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const amount = available > 0 ? (window.scrollY / available) * 100 : 0;
  progress.style.width = `${Math.min(100, amount)}%`;
};

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);

const filterTopics = (value) => {
  const query = value.trim().toLowerCase();
  lastSearch = query;
  let visible = 0;

  tutorialCards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    const matches = !query || text.includes(query);
    card.hidden = !matches;
    if (matches) visible += 1;
  });

  if (searchEmpty) searchEmpty.hidden = visible !== 0;
};

topicSearchInputs.forEach((input) => {
  input.addEventListener("input", () => {
    topicSearchInputs.forEach((other) => {
      if (other !== input) other.value = input.value;
    });
    filterTopics(input.value);
  });

  input.form.addEventListener("submit", (event) => {
    event.preventDefault();
    filterTopics(input.value);
    document.querySelector("#tutorials").scrollIntoView();
  });
});

codeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    codeTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    codeOutput.textContent = tutorialCode[tab.dataset.codeTab];
  });
});

copyButton.addEventListener("click", async () => {
  const text = codeOutput.textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "Copied";
  } catch {
    copyButton.textContent = "Select the code to copy";
  }

  window.setTimeout(() => {
    copyButton.textContent = "Copy code";
  }, 1600);
});

previewAction.addEventListener("click", () => {
  const clicked = previewAction.textContent === "Click me";
  previewAction.textContent = clicked ? "Nice work!" : "Click me";
  previewAction.style.background = clicked ? "#c9574b" : "";
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

year.textContent = String(new Date().getFullYear());

if (lastSearch) filterTopics(lastSearch);
