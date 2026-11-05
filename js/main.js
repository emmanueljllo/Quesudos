/**
 * ============================================
 * QUESUDOS MONCHO - JavaScript Principal
 * ============================================
 */

let cart = [];

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

  // ---- Cart ----
  const cartToggle = document.getElementById("cart-toggle");
  const cartDrawer = document.getElementById("cart-drawer");
  const cartBackdrop = document.getElementById("cart-backdrop");
  const cartClose = document.getElementById("cart-close");
  const menuGrid = document.getElementById("menu-grid");
  const checkoutForm = document.getElementById("checkout-form");
  const deliveryMethod = document.getElementById("delivery-method");
  const addressField = document.getElementById("checkout-address-field");
  const customerAddress = document.getElementById("customer-address");
  renderCart();

  function updateAddressRequirement() {
    if (!deliveryMethod || !addressField || !customerAddress) return;
    const needsAddress = deliveryMethod.value === "domicilio";
    addressField.hidden = !needsAddress;
    customerAddress.required = needsAddress;
  }

  if (deliveryMethod) {
    deliveryMethod.addEventListener("change", updateAddressRequirement);
    updateAddressRequirement();
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (cart.length === 0) return;

      const formData = new FormData(checkoutForm);
      const customerName = formData.get("customerName").trim();
      const customerPhone = formData.get("customerPhone").trim();
      const delivery = formData.get("deliveryMethod");
      const payment = formData.get("paymentMethod");
      const address = formData.get("customerAddress").trim();
      const notes = formData.get("orderNotes").trim();
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const orderLines = cart.map(
        (item) => `• ${item.quantity} x ${item.name} — ${formatPrice(item.price * item.quantity)}`
      );
      const message = [
        `Hola, quiero hacer un pedido en ${BUSINESS_INFO.name}.`,
        `Nombre: ${customerName}`,
        `Teléfono: ${customerPhone}`,
        `Entrega: ${
          delivery === "domicilio"
            ? "Domicilio"
            : `Recoger en el local (${BUSINESS_INFO.address})`
        }`,
        ...(delivery === "domicilio" ? [`Dirección: ${address}`] : []),
        `Pago: ${payment}`,
        "",
        "Productos:",
        ...orderLines,
        `Total de productos: ${formatPrice(total)}`,
        ...(notes ? [`Notas: ${notes}`] : []),
        delivery === "domicilio"
          ? "Por favor confirmen cobertura y costo del domicilio."
          : "Por favor confirmen cuándo puedo recoger el pedido.",
        ...(payment.startsWith("Transferencia")
          ? ["Por favor envíen los datos para realizar la transferencia."]
          : []),
      ].join("\n");
      const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  }

  function openCart() {
    if (!cartDrawer || !cartBackdrop || !cartToggle) return;
    cartDrawer.hidden = false;
    cartBackdrop.hidden = false;
    cartDrawer.setAttribute("aria-hidden", "false");
    cartToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      cartDrawer.classList.add("open");
      cartBackdrop.classList.add("visible");
    });
    if (cartClose) cartClose.focus();
  }

  function closeCart() {
    if (!cartDrawer || !cartBackdrop || !cartToggle) return;
    cartDrawer.classList.remove("open");
    cartBackdrop.classList.remove("visible");
    cartDrawer.setAttribute("aria-hidden", "true");
    cartToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    cartToggle.focus();
    window.setTimeout(() => {
      if (cartDrawer.getAttribute("aria-hidden") === "true") {
        cartDrawer.hidden = true;
        cartBackdrop.hidden = true;
      }
    }, 300);
  }

  if (cartToggle) cartToggle.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener("click", closeCart);

  if (menuGrid) {
    menuGrid.addEventListener("click", (event) => {
      const addButton = event.target.closest(".menu-card-add");
      if (!addButton) return;

      const category = MENU_DATA.find(
        (menuCategory) => menuCategory.id === addButton.dataset.categoryId
      );
      const itemIndex = Number(addButton.dataset.itemIndex);
      const item = category && category.items[itemIndex];
      if (!item) return;

      const key = `${category.id}-${itemIndex}`;
      const existingItem = cart.find((cartItem) => cartItem.key === key);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          key,
          name: item.name,
          price: item.price,
          quantity: 1,
        });
      }

      renderCart();
    });
  }

  const cartItems = document.getElementById("cart-items");
  if (cartItems) {
    cartItems.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-cart-action]");
      if (!actionButton) return;

      const itemIndex = Number(actionButton.dataset.itemIndex);
      const item = cart[itemIndex];
      if (!item) return;

      if (actionButton.dataset.cartAction === "increase") {
        item.quantity += 1;
      } else if (actionButton.dataset.cartAction === "decrease") {
        item.quantity -= 1;
        if (item.quantity === 0) cart.splice(itemIndex, 1);
      } else if (actionButton.dataset.cartAction === "remove") {
        cart.splice(itemIndex, 1);
      }

      renderCart();
    });
  }

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
    if (e.key === "Escape" && cartDrawer && !cartDrawer.hidden) closeCart();
  });

  // ---- Render Gallery ----
  renderGallery();

  const currentYear = document.getElementById("current-year");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
});

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const cartEmpty = document.getElementById("cart-empty");
  const cartCheckout = document.getElementById("cart-checkout");
  const cartToggle = document.getElementById("cart-toggle");
  if (!cartItems || !cartCount || !cartTotal || !cartEmpty || !cartCheckout) return;

  const quantity = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = String(quantity);
  cartTotal.textContent = formatPrice(total);
  cartEmpty.hidden = cart.length > 0;
  cartItems.replaceChildren();

  cart.forEach((item, index) => {
    const row = document.createElement("article");
    row.className = "cart-item";

    const name = document.createElement("h3");
    name.className = "cart-item-name";
    name.textContent = item.name;

    const subtotal = document.createElement("strong");
    subtotal.className = "cart-item-subtotal";
    subtotal.textContent = formatPrice(item.price * item.quantity);

    const controls = document.createElement("div");
    controls.className = "cart-item-controls";

    const quantityControl = document.createElement("div");
    quantityControl.className = "cart-quantity-control";

    const decreaseButton = createCartActionButton("decrease", index, "−", `Restar ${item.name}`);
    const quantityLabel = document.createElement("span");
    quantityLabel.textContent = String(item.quantity);
    const increaseButton = createCartActionButton("increase", index, "+", `Sumar ${item.name}`);

    quantityControl.append(decreaseButton, quantityLabel, increaseButton);
    controls.append(
      quantityControl,
      createCartActionButton("remove", index, "×", `Quitar ${item.name}`, "cart-remove")
    );
    row.append(name, subtotal, controls);
    cartItems.append(row);
  });

  if (cartToggle) {
    cartToggle.setAttribute(
      "aria-label",
      `Abrir carrito, ${quantity} ${quantity === 1 ? "producto" : "productos"}`
    );
  }

  if (cart.length === 0) {
    cartCheckout.disabled = true;
    return;
  }

  cartCheckout.disabled = false;
}

function createCartActionButton(action, itemIndex, label, accessibleName, className = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.dataset.cartAction = action;
  button.dataset.itemIndex = String(itemIndex);
  button.textContent = label;
  button.setAttribute("aria-label", accessibleName);
  return button;
}

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

  categories.forEach((category) => {
    if (filterCategory !== "all" || categories.length === 1) {
      infoHtml = `<p>${category.icon} ${category.description}</p>`;
    }

    category.items.forEach((item, idx) => {
      const delay = idx * 0.1;
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
              <button class="menu-card-add" type="button" data-category-id="${category.id}" data-item-index="${idx}" aria-label="Agregar ${item.name} al pedido">
                <span aria-hidden="true">+</span> Agregar
              </button>
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
