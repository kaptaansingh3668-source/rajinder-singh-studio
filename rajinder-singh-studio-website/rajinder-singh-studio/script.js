const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const form = document.querySelector("#enquiry-form");
const status = document.querySelector("#form-status");

function updateHeader() {
  if (window.scrollY > 24) header.classList.add("scrolled");
  else header.classList.remove("scrolled");
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
nav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  });
});
document.querySelector("#year").textContent = new Date().getFullYear();

/*
  IMPORTANT: This form is a front-end demo until connected.
  To receive real enquiries, create a Formspree form and replace
  YOUR_FORMSPREE_ID below with the form ID from your Formspree dashboard.
*/
const FORMSPREE_ENDPOINT = ""; // Example: "https://formspree.io/f/abcdefgh"

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  if (!FORMSPREE_ENDPOINT) {
    status.textContent = "Your form is designed, but not connected yet. Add your Formspree endpoint in script.js before publishing.";
    status.setAttribute("data-state", "demo");
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.textContent = "Sending enquiry…";
  status.textContent = "";

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Form submission failed");
    form.reset();
    status.textContent = "Thank you. Your enquiry has been sent.";
    status.setAttribute("data-state", "success");
  } catch (error) {
    status.textContent = "Sorry, the enquiry could not be sent. Please try again later.";
    status.setAttribute("data-state", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalText;
  }
});
