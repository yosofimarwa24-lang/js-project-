// ===============================
// MAHPOOSH FASHION STORE
// ===============================

// محصولات پیش‌فرض
const fallbackProducts = [
  {
    id: 101,
    title: "پیراهن لینن تابستانی",
    price: 38,
    image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=700",
    description: "پیراهنی سبک و راحت برای روزهای گرم.",
  },
  {
    id: 102,
    title: "مانتو مینیمال کرم",
    price: 52,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=700",
    description: "طراحی ساده با پارچه لطیف و خوش‌فرم.",
  },
  {
    id: 103,
    title: "کت روزمره کلاسیک",
    price: 75,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700",
    description: "انتخابی شیک برای استایل روزمره.",
  },
  {
    id: 104,
    title: "هودی راحتی",
    price: 44,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700",
    description: "نرم، کاربردی و مناسب استفاده روزانه.",
  },
  {
    id: 105,
    title: "کیف مینیمال",
    price: 29,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",
    description: "اکسسوری جمع‌وجور برای تکمیل استایل.",
  },
];

let products = [...fallbackProducts];

let currentSlide = 0;

// دریافت سبد خرید از LocalStorage
let cart = [];

try {
  cart = JSON.parse(localStorage.getItem("mahpoosh-cart") || "[]");

  if (!Array.isArray(cart)) {
    cart = [];
  }
} catch {
  cart = [];
}

// ===============================
// PRICE FORMAT
// ===============================

function formatPrice(price) {
  return (
    new Intl.NumberFormat("fa-IR").format(Math.round(price * 60000)) + " افغانی"
  );
}

// ===============================
// SAVE CART
// ===============================

function saveCart() {
  localStorage.setItem("mahpoosh-cart", JSON.stringify(cart));

  updateCartCount();
}

// ===============================
// CART COUNT
// ===============================

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById("cartCount").textContent = count;
}

// ===============================
// FETCH PRODUCTS FROM API
// ===============================

async function fetchProducts() {
  const loading = document.getElementById("loadingText");

  loading.style.display = "block";

  try {
    const response = await fetch("https://fakestoreapi.com/products?limit=8");

    if (!response.ok) {
      throw new Error("API Error");
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No products");
    }

    products = data.map((product) => ({
      id: product.id,

      title: product.title,

      price: product.price,

      image: product.image,

      description: product.description,
    }));
  } catch (error) {
    console.log("API unavailable. Using local products.");

    products = [...fallbackProducts];
  }

  loading.style.display = "none";

  renderProducts();
}

// ===============================
// RENDER PRODUCTS
// ===============================

function renderProducts() {
  const slider = document.getElementById("productSlider");

  slider.innerHTML = "";

  const visibleProducts = [];

  for (let i = 0; i < 4; i++) {
    const index = (currentSlide + i) % products.length;

    visibleProducts.push(products[index]);
  }

  visibleProducts.forEach((product) => {
    const card = document.createElement("article");

    card.className = "product-card";

    card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${escapeHTML(product.title)}"
                    loading="lazy"
                >

                <span class="tag">جدید</span>

            </div>

            <div class="product-info">

                <div>

                    <h3>${escapeHTML(product.title)}</h3>

                    <p>${formatPrice(product.price)}</p>

                </div>

                <button
                    class="add-btn"
                    onclick="addToCart(${product.id})"
                    aria-label="افزودن به سبد"
                >
                    +
                </button>

            </div>

            <button
                class="details-btn"
                onclick="showProductDetails(${product.id})"
            >
                مشاهده جزئیات
            </button>

        `;

    slider.appendChild(card);
  });
}

// جلوگیری از ورود متن محصول به HTML به صورت ناامن
function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char],
  );
}

// ===============================
// PRODUCT SLIDER
// ===============================

function nextSlide(direction) {
  if (!products.length) return;

  currentSlide = (currentSlide + direction + products.length) % products.length;

  renderProducts();
}

// ===============================
// ADD TO CART
// ===============================

function addToCart(id) {
  const product = products.find((item) => item.id === id);

  if (!product) return;

  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: product.id,

      title: product.title,

      price: product.price,

      image: product.image,

      quantity: 1,
    });
  }

  saveCart();

  renderCart();

  alert("محصول به سبد خرید اضافه شد!");
}

// ===============================
// REMOVE PRODUCT
// ===============================

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);

  saveCart();

  renderCart();
}

// ===============================
// CHANGE QUANTITY
// ===============================

function changeQuantity(id, amount) {
  const item = cart.find((product) => product.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(id);

    return;
  }

  saveCart();

  renderCart();
}

// ===============================
// CLEAR CART
// ===============================

function clearCart() {
  if (!cart.length) return;

  const confirmDelete = confirm("آیا از حذف تمام محصولات مطمئن هستید؟");

  if (!confirmDelete) return;

  cart = [];

  saveCart();

  renderCart();
}

// ===============================
// CART TOTAL
// ===============================

function calculateTotal() {
  return cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

// ===============================
// RENDER CART
// ===============================

function renderCart() {
  const content = document.getElementById("cartContent");

  if (!content) return;

  if (cart.length === 0) {
    content.innerHTML = `

            <div class="empty-cart">

                <h2>🛍️</h2>

                <h2>سبد خرید شما خالی است</h2>

                <p>
                    محصولات مورد علاقه خود را انتخاب کنید.
                </p>

                <button
                    class="primary-btn"
                    onclick="showPage('home')"
                >
                    بازگشت به فروشگاه
                </button>

            </div>

        `;

    return;
  }

  let html = `

        <div class="cart-layout">

            <div>

    `;

  cart.forEach((item) => {
    html += `

            <div class="cart-row">

                <img
                    src="${item.image}"
                    alt="${escapeHTML(item.title)}"
                >

                <div class="cart-description">

                    <h3>${escapeHTML(item.title)}</h3>

                    <p>${formatPrice(item.price)}</p>

                    <div class="quantity">

                        <button
                            onclick="changeQuantity(${item.id}, -1)"
                        >
                            −
                        </button>

                        <strong>${item.quantity}</strong>

                        <button
                            onclick="changeQuantity(${item.id}, 1)"
                        >
                            +
                        </button>

                    </div>

                </div>

                <button
                    class="delete-btn"
                    onclick="removeFromCart(${item.id})"
                >
                    🗑
                </button>

            </div>

        `;
  });

  html += `

                <button
                    class="clear-btn"
                    onclick="clearCart()"
                >
                    حذف تمام محصولات
                </button>

            </div>

            <div class="summary">

                <h3>خلاصه سفارش</h3>

                <div class="summary-row">

                    <span>تعداد محصولات</span>

                    <strong>
                        ${cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </strong>

                </div>

                <div class="summary-row">

                    <span>هزینه ارسال</span>

                    <strong>رایگان</strong>

                </div>

                <div class="summary-total">

                    <span>مبلغ نهایی</span>

                    <strong>
                        ${formatPrice(calculateTotal())}
                    </strong>

                </div>

                <button
                    class="primary-btn full-width"
                    onclick="showPage('checkout')"
                >
                    ادامه و پرداخت
                </button>

            </div>

        </div>

    `;

  content.innerHTML = html;
}

// ===============================
// CHECKOUT
// ===============================

function updateCheckout() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById("checkoutCount").textContent = count;

  document.getElementById("checkoutTotal").textContent =
    formatPrice(calculateTotal());
}

document
  .getElementById("checkoutForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("سبد خرید شما خالی است!");

      return;
    }

    const name = document.getElementById("customerName").value.trim();

    const phone = document.getElementById("customerPhone").value.trim();

    const address = document.getElementById("customerAddress").value.trim();

    if (!name || !phone || !address) {
      alert("لطفاً تمام اطلاعات را وارد کنید.");

      return;
    }

    const order = {
      name: name,

      phone: phone,

      address: address,

      items: [...cart],

      total: calculateTotal(),

      date: new Date().toISOString(),
    };

    console.log("New order:", order);

    alert("سفارش شما با موفقیت ثبت شد! (نسخه نمایشی)");

    cart = [];

    saveCart();

    this.reset();

    showPage("home");
  });

// ===============================
// PRODUCT DETAILS
// ===============================

function showProductDetails(id) {
  const product = products.find((item) => item.id === id);

  if (!product) return;

  const detail = document.getElementById("detailContent");

  detail.innerHTML = `

        <div class="detail-content">

            <img
                src="${product.image}"
                alt="${escapeHTML(product.title)}"
            >

            <div>

                <span class="eyebrow">
                    جزئیات محصول
                </span>

                <h1>
                    ${escapeHTML(product.title)}
                </h1>

                <p>
                    ${escapeHTML(product.description)}
                </p>

                <h2>
                    ${formatPrice(product.price)}
                </h2>

                <button
                    class="primary-btn"
                    onclick="addToCart(${product.id})"
                >
                    افزودن به سبد خرید
                </button>

            </div>

        </div>

    `;

  showPage("detail");
}

// ===============================
// COLOR CUSTOMIZER
// ===============================

function changeColor(color) {
  document.getElementById("shirtShape").setAttribute("fill", color);

  document.getElementById("customColor").value = color;

  document.getElementById("colorCode").textContent = color;
}

// ===============================
// PAGE NAVIGATION
// ===============================

const pageIds = {
  home: "homePage",

  cart: "cartPage",

  checkout: "checkoutPage",

  about: "aboutPage",

  contact: "contactPage",

  customize: "customizePage",

  detail: "detailPage",
};

function showPage(pageName) {
  document.getElementById("homePage").style.display = "none";

  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  if (pageName === "home") {
    document.getElementById("homePage").style.display = "block";

    history.pushState(null, "", "#home");
  } else {
    const pageId = pageIds[pageName];

    if (!pageId) return;

    document.getElementById(pageId).classList.add("active");

    history.pushState(null, "", "#" + pageName);
  }

  if (pageName === "cart") {
    renderCart();
  }

  if (pageName === "checkout") {
    updateCheckout();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  document.getElementById("navLinks").classList.remove("show");
}

// ===============================
// HANDLE NAVIGATION LINKS
// ===============================

function handleHashNavigation() {
  const hash = location.hash.replace("#", "") || "home";

  const homeSections = ["products"];

  if (homeSections.includes(hash)) {
    showPage("home");

    setTimeout(() => {
      document.getElementById(hash).scrollIntoView({
        behavior: "smooth",
      });
    }, 100);

    return;
  }

  if (pageIds[hash]) {
    // از اضافه شدن تاریخچه تکراری جلوگیری می‌کنیم
    const page = hash;

    document.getElementById("homePage").style.display = "none";

    document.querySelectorAll(".page").forEach((item) => {
      item.classList.remove("active");
    });

    if (page === "home") {
      document.getElementById("homePage").style.display = "block";
    } else {
      document.getElementById(pageIds[page]).classList.add("active");
    }

    if (page === "cart") renderCart();

    if (page === "checkout") updateCheckout();

    window.scrollTo(0, 0);
  }
}

window.addEventListener("hashchange", handleHashNavigation);

window.addEventListener("popstate", handleHashNavigation);

// ===============================
// MOBILE MENU
// ===============================

document.getElementById("menuBtn").addEventListener("click", function () {
  document.getElementById("navLinks").classList.toggle("show");
});

// ===============================
// CONTACT FORM
// ===============================

document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    alert("پیام شما ثبت شد!");

    this.reset();
  });

// ===============================
// NEWSLETTER
// ===============================

document
  .getElementById("newsletterForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    alert("عضویت شما با موفقیت ثبت شد!");

    this.reset();
  });

// ===============================
// INITIALIZE
// ===============================

updateCartCount();

fetchProducts();

handleHashNavigation();