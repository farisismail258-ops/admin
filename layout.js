// Shared layout, sidebar, search, theme, mock data
const NAV = [
  { group: "Overview", items: [
    { id: "dashboard", label: "Dashboard", icon: "home", href: "index.html" },
    { id: "analytics", label: "Analytics", icon: "chart", href: "pages/analytics.html" },
  ]},
  { group: "Catalog", items: [
    { id: "products", label: "Products", icon: "package", href: "pages/products.html" },
    { id: "categories", label: "Categories", icon: "grid", href: "pages/categories.html" },
    { id: "collections", label: "Collections", icon: "layers", href: "pages/collections.html" },
    { id: "brands", label: "Brands", icon: "award", href: "pages/brands.html" },
    { id: "featured", label: "Featured", icon: "star", href: "pages/featured.html" },
    { id: "inventory", label: "Inventory", icon: "package", href: "pages/inventory.html" },
  ]},
  { group: "Sales", items: [
    { id: "orders", label: "Orders", icon: "cart", href: "pages/orders.html", badge: "12" },
    { id: "customers", label: "Customers", icon: "users", href: "pages/customers.html" },
    { id: "reviews", label: "Reviews", icon: "message", href: "pages/reviews.html" },
    { id: "promos", label: "Promo codes", icon: "ticket", href: "pages/promos.html" },
    { id: "shipping", label: "Shipping", icon: "truck", href: "pages/shipping.html" },
  ]},
  { group: "Content", items: [
    { id: "homepage", label: "Homepage builder", icon: "layout", href: "pages/homepage.html" },
    { id: "pages-cms", label: "Pages & content", icon: "edit", href: "pages/cms.html" },
    { id: "navigation", label: "Navigation", icon: "menu", href: "pages/navigation.html" },
    { id: "blog", label: "Blog", icon: "book", href: "pages/blog.html" },
    { id: "media", label: "Media library", icon: "image", href: "pages/media.html" },
    { id: "seo", label: "SEO manager", icon: "search", href: "pages/seo.html" },
  ]},
  { group: "Marketing", items: [
    { id: "newsletter", label: "Newsletter", icon: "mail", href: "pages/newsletter.html" },
    { id: "campaigns", label: "Campaigns", icon: "mail", href: "pages/campaigns.html" },
  ]},
  { group: "System", items: [
    { id: "settings", label: "Store settings", icon: "settings", href: "pages/settings.html" },
    { id: "permissions", label: "Team & roles", icon: "users", href: "pages/permissions.html" },
    { id: "notifications", label: "Notifications", icon: "bell", href: "pages/notifications.html" },
  ]},
];

function relTo(path) {
  return (window.PAGE_DEPTH || 0) === 0 ? path : "../" + path;
}

function renderLayout(activeId) {
  const depth = window.PAGE_DEPTH || 0;
  const prefix = depth === 0 ? "" : "../";
  const sidebar = document.getElementById("sidebar");
  const topbar = document.getElementById("topbar");

  // Sidebar
  let html = `
    <div class="brand">
      <div class="brand-mark">G</div>
      <span>Glow Admin</span>
    </div>
    <div class="store-switcher">
      <div class="avatar">LU</div>
      <div class="meta"><b>Lumière Skincare</b><span>lumiere.shop · Pro</span></div>
      ${icon("chevron", 16)}
    </div>
    <nav class="nav">`;
  for (const grp of NAV) {
    html += `<div class="nav-group"><div class="nav-label">${grp.group}</div>`;
    for (const it of grp.items) {
      const active = it.id === activeId ? "active" : "";
      const href = prefix + it.href;
      html += `<a class="nav-item ${active}" href="${href}">${icon(it.icon)} <span>${it.label}</span>${it.badge ? `<span class="badge">${it.badge}</span>` : ""}</a>`;
    }
    html += `</div>`;
  }
  html += `</nav>
    <div class="sidebar-footer">
      <div class="avatar">AM</div>
      <div class="meta"><b>Aria Mendez</b><span>Owner</span></div>
      <button class="icon-btn" title="Sign out">${icon("chevron", 16)}</button>
    </div>`;
  sidebar.innerHTML = html;

  // Topbar
  topbar.innerHTML = `
    <button class="icon-btn menu-btn" id="menuBtn" aria-label="Menu">${icon("menu")}</button>
    <div class="search" id="searchOpener">
      ${icon("search", 16)}
      <input placeholder="Search products, orders, customers..." readonly />
      <kbd>⌘ K</kbd>
    </div>
    <div class="topbar-actions">
      <button class="icon-btn" id="themeBtn" title="Toggle theme">${icon("moon")}</button>
      <button class="icon-btn" title="Help">${icon("globe")}</button>
      <button class="icon-btn" title="Notifications">${icon("bell")}<span class="dot"></span></button>
      <div class="divider-v"></div>
      <button class="avatar-btn">AM</button>
    </div>
  `;

  // Mobile menu
  document.getElementById("menuBtn")?.addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });

  // Theme
  const themeBtn = document.getElementById("themeBtn");
  const saved = localStorage.getItem("glow-theme") || "light";
  if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");
  themeBtn.innerHTML = saved === "dark" ? icon("sun") : icon("moon");
  themeBtn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) { document.documentElement.removeAttribute("data-theme"); localStorage.setItem("glow-theme", "light"); themeBtn.innerHTML = icon("moon"); }
    else { document.documentElement.setAttribute("data-theme", "dark"); localStorage.setItem("glow-theme", "dark"); themeBtn.innerHTML = icon("sun"); }
    // Re-render charts
    window.dispatchEvent(new Event("theme-changed"));
  });

  // Command palette
  document.getElementById("searchOpener").addEventListener("click", openCmdK);
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openCmdK(); }
    if (e.key === "Escape") closeCmdK();
  });
}

function openCmdK() {
  let el = document.getElementById("cmdk");
  if (!el) {
    el = document.createElement("div");
    el.id = "cmdk";
    el.className = "cmdk-backdrop";
    const depth = window.PAGE_DEPTH || 0;
    const prefix = depth === 0 ? "" : "../";
    const all = [];
    NAV.forEach(g => g.items.forEach(it => all.push({ ...it, href: prefix + it.href, group: g.group })));
    el.innerHTML = `
      <div class="cmdk" onclick="event.stopPropagation()">
        <div class="cmdk-input">${icon("search", 18)}<input id="cmdkInput" placeholder="Type a command or search..."/><kbd>ESC</kbd></div>
        <div class="cmdk-results" id="cmdkResults"></div>
      </div>`;
    el.addEventListener("click", closeCmdK);
    document.body.appendChild(el);

    const input = el.querySelector("#cmdkInput");
    const results = el.querySelector("#cmdkResults");
    function render(q) {
      const filtered = all.filter(it => it.label.toLowerCase().includes(q.toLowerCase()));
      const groups = {};
      filtered.forEach(it => (groups[it.group] = groups[it.group] || []).push(it));
      results.innerHTML = Object.keys(groups).map(g =>
        `<div class="cmdk-group">${g}</div>` +
        groups[g].map(it => `<a class="cmdk-item" href="${it.href}">${icon(it.icon)}<span>${it.label}</span><span class="arrow">↵</span></a>`).join("")
      ).join("") || `<div class="cmdk-group">No results</div>`;
    }
    input.addEventListener("input", e => render(e.target.value));
    render("");
  }
  el.classList.add("open");
  setTimeout(() => el.querySelector("#cmdkInput")?.focus(), 50);
}
function closeCmdK() { document.getElementById("cmdk")?.classList.remove("open"); }

function toast(msg) {
  let stack = document.querySelector(".toast-stack");
  if (!stack) { stack = document.createElement("div"); stack.className = "toast-stack"; document.body.appendChild(stack); }
  const t = document.createElement("div"); t.className = "toast"; t.innerHTML = `${icon("star",16)} ${msg}`;
  stack.appendChild(t);
  setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateY(8px)"; t.style.transition = "all .2s"; }, 2200);
  setTimeout(() => t.remove(), 2500);
}

// Chart helpers
function chartColors() {
  const css = getComputedStyle(document.documentElement);
  return {
    text: css.getPropertyValue("--text-3").trim() || "#6b7c93",
    border: css.getPropertyValue("--border").trim() || "#e6ebf1",
    primary: "#635bff",
    accent: "#00d4ff",
    success: "#1ec48b",
    warning: "#ffb547",
    danger: "#ff5a5f",
  };
}
function chartDefaults() {
  const c = chartColors();
  Chart.defaults.color = c.text;
  Chart.defaults.borderColor = c.border;
  Chart.defaults.font.family = '"Inter", system-ui, sans-serif';
  Chart.defaults.font.size = 12;
}
