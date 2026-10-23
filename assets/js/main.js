/* AICantiere — main.js */

// Navbar scroll effect
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 60) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
}, { passive: true });

// Hamburger menu
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen.toString());
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

// IntersectionObserver for fade-up animations
const fadeEls = document.querySelectorAll(".fade-up");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
fadeEls.forEach(el => observer.observe(el));

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// Toast notification
function showToast(msg, duration = 4000) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

// Contact form submission
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("btn-form-submit");
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    if (!nome || !email) {
      showToast("⚠️ Compila nome e email prima di inviare.");
      return;
    }
    btn.textContent = "⏳ Invio in corso...";
    btn.disabled = true;
    try {
      const formData = new FormData(form);
      const res = await fetch("invia_mail.php", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        showToast("✅ Richiesta inviata! Ti contatteremo presto.");
        form.reset();
      } else {
        throw new Error("Server error");
      }
    } catch {
      // Fallback: open mailto
      const sub = encodeURIComponent("Richiesta Info AICantiere - " + nome);
      const body = encodeURIComponent(
        "Nome: " + nome + "\n" +
        "Email: " + email + "\n" +
        "Azienda: " + (document.getElementById("azienda")?.value || "—") + "\n" +
        "Telefono: " + (document.getElementById("telefono")?.value || "—") + "\n" +
        "Richiesta: " + (document.getElementById("interesse")?.value || "—") + "\n\n" +
        "Messaggio:\n" + (document.getElementById("messaggio")?.value || "—")
      );
      window.location.href = "mailto:info@aicantiere.eu?subject=" + sub + "&body=" + body;
      showToast("📧 Apertura client email...");
      form.reset();
    }
    btn.textContent = "📤 Invia Richiesta";
    btn.disabled = false;
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll("section[id]");
const navAs = document.querySelectorAll(".nav-links a");
if (sections.length > 0 && navbar) {
  window.addEventListener("scroll", () => {
    let current = "";
    const offset = navbar.offsetHeight + 30;
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - offset) current = s.id;
    });
    navAs.forEach(a => {
      if (a.getAttribute("href")?.startsWith("#")) {
        a.style.color = a.getAttribute("href") === "#" + current
          ? "var(--clr-white)" : "";
      }
    });
  }, { passive: true });
}

// Blog Category Filter
const filterBtns = document.querySelectorAll(".filter-btn");
const blogCards = document.querySelectorAll(".blog-card[data-category]");
if (filterBtns.length > 0 && blogCards.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const cat = btn.getAttribute("data-filter");
      blogCards.forEach(card => {
        if (cat === "all" || card.getAttribute("data-category") === cat) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}
