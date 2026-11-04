/**
 * ============================================
 * QUESUDOS MONCHO - JavaScript Principal
 * ============================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // ---- Header Scroll Effect ----
  const header = document.querySelector(".header");
  const scrollTopBtn = document.querySelector(".scroll-top");

  function handleScroll() {
    const scrollY = window.scrollY;
    if (header && scrollY > 50) {
      header.classList.add("scrolled");
    } else if (header) {
      header.classList.remove("scrolled");
    }

    if (scrollTopBtn) {
      if (scrollY > 400) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    }

    // Update active nav link
    updateActiveNav();
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  // ---- Scroll to Top ----
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---- Mobile Menu ----
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  function closeMobileMenu() {
    if (!hamburger || !navMenu) return;
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Abrir menú de navegación");
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.classList.toggle("active", !isExpanded);
      if (navMenu) navMenu.classList.toggle("active", !isExpanded);
      hamburger.setAttribute("aria-expanded", String(!isExpanded));
      hamburger.setAttribute(
        "aria-label",
        isExpanded ? "Abrir menú de navegación" : "Cerrar menú de navegación"
      );
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // ---- Active Navigation ----
  function updateActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  handleScroll();

  // ---- Render Menu ----
  renderMenu();

  // ---- Menu Category Filter ----
  const categoryBtns = document.querySelectorAll(".category-btn");

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.dataset.category;
      renderMenu(category);
    });
  });

  // ---- Scroll Animations (Intersection Observer) ----
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".fade-in, .fade-in-left, .fade-in-right, .scale-in")
    .forEach((el) => {
      observer.observe(el);
    });

  // ---- Gallery Lightbox ----
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;
  let lightboxTrigger = null;

  const galleryGrid = document.getElementById("gallery-grid");
  if (galleryGrid) {
    galleryGrid.addEventListener("click", (event) => {
      const item = event.target.closest(".gallery-item");
      if (!item) return;
      const img = item.querySelector("img");
      if (lightboxImg && img) {
        lightboxTrigger = item;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        if (lightboxClose) lightboxClose.focus();
      }
    });
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lightboxTrigger) lightboxTrigger.focus();
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "Escape") closeMobileMenu();
  });

  // ---- Render Gallery ----
  renderGallery();

  const currentYear = document.getElementById("current-year");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
});

/**
 * Render the menu items into the menu grid
 * @param {string} filterCategory - Category ID to filter ("all" for all)
 */
function renderMenu(filterCategory = "all") {
  const menuGrid = document.getElementById("menu-grid");
  const categoryInfo = document.getElementById("category-info");
  if (!menuGrid) return;

  let html = "";
  let infoHtml = "";

  const categories =
    filterCategory === "all"
      ? MENU_DATA
      : MENU_DATA.filter((cat) => cat.id === filterCategory);

  categories.forEach((category, catIdx) => {
    if (filterCategory !== "all" || categories.length === 1) {
      infoHtml = `<p>${category.icon} ${category.description}</p>`;
    }

    category.items.forEach((item, idx) => {
      const delay = idx * 0.1;
      const whatsappUrl = `${BUSINESS_INFO.whatsappLink}`;

      html += `
        <div class="menu-card scale-in" style="transition-delay: ${delay}s">
          <div class="menu-card-image">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <span class="menu-card-badge">${category.icon} ${category.category}</span>
          </div>
          <div class="menu-card-body">
            <h3 class="menu-card-name">${item.name}</h3>
            ${item.extra ? `<p class="menu-card-extra">✦ ${item.extra}</p>` : ""}
            ${item.description ? `<p class="menu-card-description">${item.description}</p>` : ""}
            <div class="menu-card-footer">
              <span class="menu-card-price">${formatPrice(item.price)}</span>
              <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer"
                 class="menu-card-order" title="Pedir por WhatsApp" aria-label="Pedir ${item.name} por WhatsApp">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      `;
    });
  });

  menuGrid.innerHTML = html;
  if (categoryInfo) {
    categoryInfo.innerHTML = infoHtml;
    categoryInfo.hidden = !infoHtml;
  }

  // Re-observe new elements for animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  menuGrid.querySelectorAll(".scale-in").forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Render gallery items
 */
function renderGallery() {
  const galleryGrid = document.getElementById("gallery-grid");
  if (!galleryGrid) return;

  let html = "";

  GALLERY_IMAGES.forEach((image) => {
    html += `
      <button class="gallery-item" type="button" aria-label="Ampliar imagen: ${image.alt}">
        <img src="${image.src}" alt="${image.alt}" loading="lazy">
        <span class="gallery-item-caption">${image.alt}</span>
      </div>
    `;
  });

  galleryGrid.innerHTML = html;
}
