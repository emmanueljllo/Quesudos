/**
 * ============================================
 * QUESUDOS MONCHO - JavaScript Principal
 * ============================================
 */

let cart = [];
let pendingMenuItem = null;
let modifierTrigger = null;
let capturedLocation = "";

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
  const stickyCart = document.getElementById("sticky-cart");
  const checkoutStatus = document.getElementById("checkout-status");
  const modifierDialog = document.getElementById("modifier-dialog");
  const modifierForm = document.getElementById("modifier-form");
  const modifierOptions = document.getElementById("modifier-options");
  const menuStatus = document.getElementById("menu-status");
  const receiptDialog = document.getElementById("receipt-dialog");
  const receiptContent = document.getElementById("receipt-content");
  const receiptWhatsapp = document.getElementById("receipt-whatsapp");

  cart = readStoredCart();
  restoreCustomerDetails();
  renderCart();
  renderMenu();
  loadMenuFeed()
    .then(() => {
      renderMenu();
      renderCart();
    })
    .catch((error) => {
      console.error("No se pudo actualizar el menú publicado.", error);
      if (menuStatus) {
        menuStatus.textContent = "No fue posible actualizar el menú. Mostramos los productos guardados en el sitio.";
        menuStatus.hidden = false;
      }
    });

  function updateAddressRequirement() {
    if (!deliveryMethod || !addressField || !customerAddress) return;
    const needsAddress = deliveryMethod.value === "domicilio";
    addressField.hidden = !needsAddress;
    customerAddress.required = needsAddress;
  }

  if (deliveryMethod) {
    deliveryMethod.addEventListener("change", () => {
      updateAddressRequirement();
      updateBenefitProgress(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    });
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
      const orderNumber = createOrderNumber();
      const freeDelivery = delivery === "domicilio" && total >= MENU_SETTINGS.freeDeliveryThreshold;
      const order = {
        number: orderNumber,
        createdAt: new Date().toISOString(),
        customerName,
        customerPhone,
        delivery,
        address: delivery === "domicilio" ? address : "",
        payment,
        notes,
        location: delivery === "domicilio" ? capturedLocation : "",
        items: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          modifiers: (item.modifiers || []).map((modifier) => modifier.name),
        })),
        subtotal: total,
        deliveryBenefit: freeDelivery,
        status: "Pendiente de confirmación",
      };
      const orderLines = order.items.map((item) => {
        const modifiers = item.modifiers.length
          ? ` (Adiciones: ${item.modifiers.join(", ")})`
          : "";
        return `• ${item.quantity} x ${item.name}${modifiers} — ${formatPrice(item.unitPrice * item.quantity)}`;
      });
      const message = [
        `🧾 *PEDIDO ${orderNumber}*`,
        `Fecha: ${formatOrderDate(order.createdAt)}`,
        `Cliente: ${customerName}`,
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
        `*Subtotal de productos: ${formatPrice(total)}*`,
        ...(delivery === "domicilio"
          ? [`Domicilio gratis: ${freeDelivery ? "Alcanza el umbral; confirmar cobertura" : "No aplica"}`]
          : []),
        ...(capturedLocation && delivery === "domicilio" ? [`Ubicación: ${capturedLocation}`] : []),
        ...(notes ? [`Notas: ${notes}`] : []),
        delivery === "domicilio"
          ? freeDelivery
            ? "Por favor confirmen cobertura y aplicación del beneficio de domicilio gratis."
            : "Por favor confirmen cobertura y costo del domicilio."
          : "Por favor confirmen cuándo puedo recoger el pedido.",
        ...(payment.startsWith("Transferencia")
          ? ["Por favor envíen los datos para realizar la transferencia."]
          : []),
        "",
        "Pedido pendiente de confirmación del negocio.",
      ].join("\n");
      const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
      saveCustomerDetails({
        name: customerName,
        phone: customerPhone,
        delivery,
        address,
        payment,
      });
      writeStoredValue("quesudos-last-order", cart);
      renderReceipt(order);
      receiptWhatsapp.href = whatsappUrl;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      closeCart();
      openReceipt();
      if (checkoutStatus) {
        checkoutStatus.textContent = `Pedido ${orderNumber} listo. El recibo está disponible para imprimir o guardar como PDF.`;
      }
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
  if (stickyCart) stickyCart.addEventListener("click", openCart);
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
      if (!item || item.available === false) return;
      if (item.modifiers && item.modifiers.length) {
        showModifierDialog(category, itemIndex);
      } else {
        addMenuItem(category, itemIndex, [], category.id === "hamburguesas");
      }
    });
  }

  function addMenuItem(category, itemIndex, modifiers, openAfterAdd = false) {
    const item = category && category.items[itemIndex];
    if (!item || item.available === false) return;
    const modifierTotal = modifiers.reduce((sum, modifier) => sum + modifier.price, 0);
    const modifierKey = modifiers.map((modifier) => modifier.name).sort().join(",");
    const key = `${category.id}-${itemIndex}-${modifierKey}`;
    const existingItem = cart.find((cartItem) => cartItem.key === key);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        key,
        productKey: `${category.id}-${itemIndex}`,
        productName: item.name,
        name: item.name,
        basePrice: item.price,
        price: item.price + modifierTotal,
        modifiers,
        quantity: 1,
      });
    }
    saveStoredCart();
    renderCart();
    if (checkoutStatus) checkoutStatus.textContent = `${item.name} agregado al pedido.`;
    if (openAfterAdd) openCart();
  }

  function showModifierDialog(category, itemIndex) {
    const item = category.items[itemIndex];
    pendingMenuItem = { category, itemIndex };
    modifierTrigger = document.activeElement;
    document.getElementById("modifier-title").textContent = `Personaliza: ${item.name}`;
    modifierOptions.replaceChildren();
    item.modifiers.forEach((modifier, index) => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "modifier";
      checkbox.value = String(index);
      label.append(checkbox, document.createTextNode(` ${modifier.name} +${formatPrice(modifier.price)}`));
      modifierOptions.append(label);
    });
    modifierDialog.hidden = false;
    modifierDialog.setAttribute("aria-hidden", "false");
    modifierOptions.querySelector("input")?.focus();
  }

  function closeModifierDialog() {
    modifierDialog.hidden = true;
    modifierDialog.setAttribute("aria-hidden", "true");
    pendingMenuItem = null;
    if (modifierTrigger) modifierTrigger.focus();
    modifierTrigger = null;
  }

  document.getElementById("modifier-cancel").addEventListener("click", closeModifierDialog);
  modifierDialog.addEventListener("click", (event) => {
    if (event.target === modifierDialog) closeModifierDialog();
  });
  modifierForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!pendingMenuItem) return;
    const selectedItem = pendingMenuItem;
    const item = selectedItem.category.items[selectedItem.itemIndex];
    const modifiers = Array.from(modifierOptions.querySelectorAll("input:checked"))
      .map((input) => item.modifiers[Number(input.value)]);
    closeModifierDialog();
    addMenuItem(selectedItem.category, selectedItem.itemIndex, modifiers, true);
  });

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

      saveStoredCart();
      renderCart();
    });
  }

  const suggestionsList = document.getElementById("cart-suggestions-list");
  if (suggestionsList) {
    suggestionsList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-suggested-category]");
      if (!button) return;
      const category = MENU_DATA.find(
        (menuCategory) => menuCategory.id === button.dataset.suggestedCategory
      );
      const itemIndex = Number(button.dataset.suggestedIndex);
      if (category) addMenuItem(category, itemIndex, []);
    });
  }

  document.getElementById("repeat-order").addEventListener("click", () => {
    const previousOrder = readStoredValue("quesudos-last-order", []);
    if (!Array.isArray(previousOrder) || previousOrder.length === 0) return;
    cart = previousOrder;
    saveStoredCart();
    renderCart();
    if (checkoutStatus) checkoutStatus.textContent = "Tu último pedido se agregó al carrito.";
  });

  checkoutForm.addEventListener("change", () => {
    saveCustomerDetails({
      name: document.getElementById("customer-name").value,
      phone: document.getElementById("customer-phone").value,
      delivery: deliveryMethod.value,
      address: customerAddress.value,
      payment: document.getElementById("payment-method").value,
    });
  });

  document.getElementById("use-location").addEventListener("click", () => {
    const locationStatus = document.getElementById("location-status");
    if (!navigator.geolocation) {
      locationStatus.textContent = "Este navegador no permite obtener la ubicación.";
      return;
    }
    locationStatus.textContent = "Obteniendo ubicación...";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        capturedLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
        locationStatus.textContent = "Ubicación lista; se incluirá en el pedido.";
      },
      (error) => {
        console.error("No se pudo obtener la ubicación del cliente.", error);
        locationStatus.textContent = "No se pudo obtener la ubicación. Puedes escribir la dirección manualmente.";
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  });

  document.getElementById("receipt-close").addEventListener("click", closeReceipt);
  document.getElementById("receipt-done").addEventListener("click", closeReceipt);
  receiptDialog.addEventListener("click", (event) => {
    if (event.target === receiptDialog) closeReceipt();
  });
  document.getElementById("receipt-print").addEventListener("click", () => window.print());

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
    if (e.key === "Escape" && receiptDialog && !receiptDialog.hidden) {
      closeReceipt();
      return;
    }
    if (e.key === "Escape" && cartDrawer && !cartDrawer.hidden) closeCart();
    if (e.key === "Escape" && modifierDialog && !modifierDialog.hidden) closeModifierDialog();
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
  const stickyCart = document.getElementById("sticky-cart");
  const suggestionPanel = document.getElementById("cart-suggestions");
  const suggestionList = document.getElementById("cart-suggestions-list");
  const repeatOrder = document.getElementById("repeat-order");
  if (!cartItems || !cartCount || !cartTotal || !cartEmpty || !cartCheckout) return;

  const quantity = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = String(quantity);
  cartTotal.textContent = formatPrice(total);
  if (stickyCart) {
    stickyCart.textContent = `Ver pedido (${quantity}) · ${formatPrice(total)}`;
    stickyCart.hidden = quantity === 0;
  }
  cartEmpty.hidden = cart.length > 0;
  if (repeatOrder) {
    const lastOrder = readStoredValue("quesudos-last-order", []);
    repeatOrder.hidden = !Array.isArray(lastOrder) || lastOrder.length === 0;
  }
  cartItems.replaceChildren();

  cart.forEach((item, index) => {
    const row = document.createElement("article");
    row.className = "cart-item";

    const name = document.createElement("h3");
    name.className = "cart-item-name";
    name.textContent = item.name;
    if (item.modifiers && item.modifiers.length) {
      const modifiers = document.createElement("p");
      modifiers.className = "cart-item-modifiers";
      modifiers.textContent = item.modifiers.map((modifier) => modifier.name).join(", ");
      name.append(modifiers);
    }

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

  renderSuggestions(suggestionPanel, suggestionList);
  updateBenefitProgress(total);
  if (cartToggle) {
    cartToggle.setAttribute(
      "aria-label",
      `Abrir carrito, ${quantity} ${quantity === 1 ? "producto" : "productos"}`
    );
  }

  cartCheckout.disabled = cart.length === 0;
}

function renderSuggestions(panel, list) {
  if (!panel || !list) return;
  const suggestedNames = new Set();
  cart.forEach((cartItem) => {
    const suggestions = PRODUCT_SUGGESTIONS[cartItem.productName] || [];
    suggestions.forEach((name) => suggestedNames.add(name));
  });
  const suggestions = [];
  MENU_DATA.forEach((category) => {
    category.items.forEach((item, index) => {
      if (suggestedNames.has(item.name) && item.available !== false) {
        suggestions.push({ category, item, index });
      }
    });
  });
  list.replaceChildren();
  suggestions.slice(0, 3).forEach(({ category, item, index }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.suggestedCategory = category.id;
    button.dataset.suggestedIndex = String(index);
    button.textContent = `+ ${item.name} · ${formatPrice(item.price)}`;
    list.append(button);
  });
  panel.hidden = suggestions.length === 0;
}

function updateBenefitProgress(subtotal) {
  const message = document.getElementById("benefit-message");
  const bar = document.getElementById("benefit-progress-bar");
  const track = bar && bar.parentElement;
  if (!message || !bar || !track) return;
  const threshold = Math.max(0, Number(MENU_SETTINGS.freeDeliveryThreshold) || 0);
  const progress = threshold === 0 ? 100 : Math.min(100, (subtotal / threshold) * 100);
  bar.style.width = `${progress}%`;
  track.setAttribute("aria-valuenow", String(Math.round(progress)));
  if (document.getElementById("delivery-method")?.value === "recoger") {
    message.textContent = "El beneficio de domicilio gratis aplica solo a pedidos a domicilio.";
  } else if (subtotal >= threshold) {
    message.textContent = "¡Alcanzaste el beneficio de domicilio gratis! Sujeto a cobertura.";
  } else {
    message.textContent = `Te faltan ${formatPrice(threshold - subtotal)} para alcanzar el beneficio de domicilio gratis.`;
  }
}

function readStoredValue(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`No se pudo leer ${key} desde el almacenamiento local.`, error);
    return fallback;
  }
}

function writeStoredValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`No se pudo guardar ${key} en el almacenamiento local.`, error);
    const status = document.getElementById("checkout-status");
    if (status) status.textContent = "No fue posible guardar los datos en este dispositivo.";
    return false;
  }
}

function readStoredCart() {
  const savedCart = readStoredValue("quesudos-cart", []);
  if (!Array.isArray(savedCart)) return [];
  return savedCart.filter((item) =>
    item && typeof item.key === "string" && typeof item.name === "string" &&
    Number.isFinite(item.price) && Number.isInteger(item.quantity) && item.quantity > 0
  );
}

function saveStoredCart() {
  writeStoredValue("quesudos-cart", cart);
}

function restoreCustomerDetails() {
  const customer = readStoredValue("quesudos-customer", null);
  if (!customer || typeof customer !== "object") return;
  const values = {
    "customer-name": customer.name,
    "customer-phone": customer.phone,
    "delivery-method": customer.delivery,
    "customer-address": customer.address,
    "payment-method": customer.payment,
  };
  Object.entries(values).forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (field && typeof value === "string" && value) field.value = value;
  });
}

function saveCustomerDetails(customer) {
  writeStoredValue("quesudos-customer", customer);
}

function createOrderNumber() {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const key = `quesudos-order-sequence-${date}`;
  const sequence = Number(readStoredValue(key, 0)) + 1;
  writeStoredValue(key, sequence);
  const suffix = Math.floor(Math.random() * (36 ** 4)).toString(36).toUpperCase().padStart(4, "0");
  return `QM-${date}-${String(sequence).padStart(3, "0")}-${suffix}`;
}

function formatOrderDate(value) {
  return new Date(value).toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function renderReceipt(order) {
  const content = document.getElementById("receipt-content");
  if (!content) return;
  content.replaceChildren();

  const number = document.createElement("p");
  number.className = "receipt-number";
  number.textContent = `Pedido ${order.number}`;
  const date = document.createElement("p");
  date.className = "receipt-date";
  date.textContent = formatOrderDate(order.createdAt);
  content.append(number, date);

  const details = [
    ["Cliente", order.customerName],
    ["Teléfono", order.customerPhone],
    ["Entrega", order.delivery === "domicilio" ? "Domicilio" : `Recoger en el local (${BUSINESS_INFO.address})`],
    ...(order.address ? [["Dirección", order.address]] : []),
    ["Pago", order.payment],
  ];
  details.forEach(([label, value]) => {
    const row = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    row.append(strong, document.createTextNode(value));
    content.append(row);
  });
  if (order.location) {
    const locationRow = document.createElement("p");
    const locationLink = document.createElement("a");
    locationLink.href = order.location;
    locationLink.target = "_blank";
    locationLink.rel = "noopener noreferrer";
    locationLink.textContent = "Abrir ubicación en Google Maps";
    locationRow.append(locationLink);
    content.append(locationRow);
  }

  const itemsTitle = document.createElement("h3");
  itemsTitle.textContent = "Productos";
  content.append(itemsTitle);
  const itemList = document.createElement("ul");
  order.items.forEach((item) => {
    const listItem = document.createElement("li");
    const modifiers = item.modifiers.length ? ` (${item.modifiers.join(", ")})` : "";
    listItem.textContent = `${item.quantity} × ${item.name}${modifiers} — ${formatPrice(item.quantity * item.unitPrice)}`;
    itemList.append(listItem);
  });
  content.append(itemList);

  const subtotal = document.createElement("p");
  subtotal.className = "receipt-total";
  subtotal.textContent = `Subtotal de productos: ${formatPrice(order.subtotal)}`;
  content.append(subtotal);
  const deliveryNote = document.createElement("p");
  deliveryNote.textContent = order.delivery === "domicilio"
    ? order.deliveryBenefit
      ? "Domicilio: beneficio sujeto a cobertura y confirmación."
      : "Domicilio: costo por confirmar; no incluido en el subtotal."
    : "Entrega en el local: sin costo de domicilio.";
  content.append(deliveryNote);
  if (order.notes) {
    const notes = document.createElement("p");
    const label = document.createElement("strong");
    label.textContent = "Notas: ";
    notes.append(label, document.createTextNode(order.notes));
    content.append(notes);
  }
}

function openReceipt() {
  const dialog = document.getElementById("receipt-dialog");
  if (!dialog) return;
  dialog.hidden = false;
  dialog.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("receipt-close").focus();
}

function closeReceipt() {
  const dialog = document.getElementById("receipt-dialog");
  if (!dialog) return;
  dialog.hidden = true;
  dialog.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  const cartToggle = document.getElementById("cart-toggle");
  if (cartToggle) cartToggle.focus();
}

async function loadMenuFeed() {
  if (!MENU_SETTINGS.feedUrl) return;
  const response = await fetch(MENU_SETTINGS.feedUrl, { cache: "no-store" });
  if (!response.ok) throw new Error(`El servidor respondió ${response.status}.`);
  const csv = await response.text();
  const rows = parseCsv(csv);
  if (rows.length < 2) throw new Error("La hoja publicada no contiene productos.");
  const headers = rows[0].map((header) => header.replace(/^\uFEFF/, "").trim().toLowerCase());
  const records = rows.slice(1).filter((row) => row.some((value) => value.trim()));
  const feedSuggestions = {};
  const getValue = (row, key) => {
    const column = headers.indexOf(key);
    return column === -1 ? "" : row[column] || "";
  };
  const categories = new Map();
  records.forEach((row) => {
    const id = getValue(row, "category_id").trim();
    const label = getValue(row, "category").trim();
    const name = getValue(row, "name").trim();
    const priceText = getValue(row, "price").trim();
    const price = parseCopAmount(priceText);
    if (!id || !label || !name || !priceText || !Number.isFinite(price) || price < 0) {
      throw new Error("Cada fila requiere category_id, category, name y price válido.");
    }
    if (!categories.has(id)) {
      const existing = MENU_DATA.find((category) => category.id === id);
      categories.set(id, {
        id,
        category: label,
        icon: existing ? existing.icon : "🍽️",
        description: existing ? existing.description : "",
        items: [],
      });
    }
    const availableValue = getValue(row, "available").trim().toLowerCase();
    const suggested = getValue(row, "suggested").split("|").map((value) => value.trim()).filter(Boolean);
    const existingItem = (MENU_DATA.find((menuCategory) => menuCategory.id === id)?.items || [])
      .find((menuItem) => menuItem.name === name);
    const item = {
      id: slugify(name),
      name,
      price,
      image: getValue(row, "image").trim() || "img/Menu.jpg",
      description: getValue(row, "description").trim(),
      available: !["false", "0", "no", "agotado"].includes(availableValue),
      suggested,
      modifiers: existingItem
        ? existingItem.modifiers || []
        : id === "hamburguesas"
          ? Object.entries(PRODUCT_MODIFIERS).map(([modifierName, modifierPrice]) => ({
              name: modifierName,
              price: modifierPrice,
            }))
          : [],
    };
    categories.get(id).items.push(item);
    if (suggested.length) feedSuggestions[name] = suggested;
  });
  if (categories.size === 0) throw new Error("La hoja publicada no contiene filas válidas.");
  const thresholdValue = records
    .map((row) => getValue(row, "free_delivery_threshold").trim())
    .find(Boolean);
  if (thresholdValue) {
    const threshold = parseCopAmount(thresholdValue);
    if (!Number.isFinite(threshold) || threshold < 0) {
      throw new Error("free_delivery_threshold debe ser un valor numérico en COP.");
    }
    MENU_SETTINGS.freeDeliveryThreshold = threshold;
  }
  MENU_DATA = Array.from(categories.values());
  Object.assign(PRODUCT_SUGGESTIONS, feedSuggestions);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"' && quoted && text[index + 1] === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function slugify(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parseCopAmount(value) {
  const cleaned = value.trim().replace(/[^\d.,-]/g, "");
  if (!/\d/.test(cleaned)) return NaN;
  if (/^-?\d{1,3}(\.\d{3})+$/.test(cleaned)) return Number(cleaned.replace(/\./g, ""));
  if (/^-?\d{1,3}(,\d{3})+$/.test(cleaned)) return Number(cleaned.replace(/,/g, ""));
  return Number(cleaned.replace(/,/g, ""));
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
      const available = item.available !== false;
      html += `
        <div class="menu-card scale-in" style="transition-delay: ${delay}s">
          <div class="menu-card-image">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">
            <span class="menu-card-badge">${escapeHtml(category.icon)} ${escapeHtml(category.category)}</span>
            ${available ? "" : '<span class="menu-card-sold-out">Agotado</span>'}
          </div>
          <div class="menu-card-body">
            <h3 class="menu-card-name">${escapeHtml(item.name)}</h3>
            ${item.extra ? `<p class="menu-card-extra">✦ ${escapeHtml(item.extra)}</p>` : ""}
            ${item.description ? `<p class="menu-card-description">${escapeHtml(item.description)}</p>` : ""}
            <div class="menu-card-footer">
              <span class="menu-card-price">${formatPrice(item.price)}</span>
              <button class="menu-card-add" type="button" data-category-id="${escapeHtml(category.id)}" data-item-index="${idx}" aria-label="Agregar ${escapeHtml(item.name)} al pedido" ${available ? "" : "disabled"}>
                <span aria-hidden="true">+</span> ${available ? "Agregar" : "Agotado"}
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

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);
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
