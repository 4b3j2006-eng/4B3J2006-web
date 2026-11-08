const yearElement = document.querySelector("#current-year");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const portfolioVideo = document.querySelector(".video-frame video");

if (portfolioVideo) {
  portfolioVideo.addEventListener("ended", () => {
    portfolioVideo.load();
  });
}

const navigationLinks = [...document.querySelectorAll(".nav-links a")];
const sections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter((section) => section instanceof HTMLElement);

for (const link of navigationLinks) {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!(target instanceof HTMLElement)) return;

    event.preventDefault();
    history.pushState(null, "", link.getAttribute("href"));
    target.scrollIntoView({ block: "start", inline: "center" });
  });
}

if ("IntersectionObserver" in window && sections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const currentLink = navigationLinks.find(
          (link) => link.getAttribute("href") === `#${entry.target.id}`,
        );

        for (const link of navigationLinks) {
          if (link === currentLink) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        }
      }
    },
    { rootMargin: "-30% 0px -55% 0px" },
  );

  for (const section of sections) {
    sectionObserver.observe(section);
  }
}

for (const flipbook of document.querySelectorAll("[data-flipbook]")) {
  const pages = [...flipbook.querySelectorAll(".flipbook-page")];
  const card = flipbook.closest(".work-card");
  const status = card.querySelector(".flipbook-status");
  const previousButton = card.querySelector('[data-flip-direction="-1"]');
  const nextButton = card.querySelector('[data-flip-direction="1"]');
  let currentPage = 0;

  const showPage = (pageIndex) => {
    currentPage = Math.max(0, Math.min(pageIndex, pages.length - 1));
    flipbook.classList.toggle("is-flipped", currentPage === 1);

    for (const [index, page] of pages.entries()) {
      page.setAttribute("aria-hidden", String(index !== currentPage));
    }

    status.textContent = `${String(currentPage + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}`;
    previousButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === pages.length - 1;
  };

  previousButton.addEventListener("click", () => showPage(currentPage - 1));
  nextButton.addEventListener("click", () => showPage(currentPage + 1));
  showPage(0);
}

const photoTrack = document.querySelector("#photo-track");

if (photoTrack) {
  const photoCards = [...photoTrack.querySelectorAll(".photo-card")];
  const previousButton = document.querySelector('[data-photo-direction="-1"]');
  const nextButton = document.querySelector('[data-photo-direction="1"]');

  const updateCarouselControls = () => {
    const trackStyle = getComputedStyle(photoTrack);
    const startPadding = Number.parseFloat(trackStyle.paddingLeft) || 0;
    const maxScroll = photoTrack.scrollWidth - photoTrack.clientWidth;

    previousButton.disabled = photoTrack.scrollLeft <= startPadding + 1;
    nextButton.disabled = photoTrack.scrollLeft >= maxScroll - 1;
  };

  const moveCarousel = (direction) => {
    const trackStyle = getComputedStyle(photoTrack);
    const gap = Number.parseFloat(trackStyle.columnGap) || 0;
    const step = photoCards[0].getBoundingClientRect().width + gap;

    photoTrack.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  previousButton.addEventListener("click", () => moveCarousel(-1));
  nextButton.addEventListener("click", () => moveCarousel(1));
  photoTrack.addEventListener("scroll", updateCarouselControls, { passive: true });
  photoTrack.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    moveCarousel(event.key === "ArrowRight" ? 1 : -1);
  });
  window.addEventListener("resize", updateCarouselControls);
  updateCarouselControls();
}