/* =======================
   CONTACTS FORM
   ======================= */
// Get form elements
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const formMessage = document.getElementById("formMessage");

// 1️⃣ Populate form from sessionStorage on page load
window.addEventListener("load", () => {
    if (sessionStorage.getItem("name")) nameInput.value = sessionStorage.getItem("name");
    if (sessionStorage.getItem("email")) emailInput.value = sessionStorage.getItem("email");
    if (sessionStorage.getItem("message")) messageInput.value = sessionStorage.getItem("message");
});

// 2️⃣ Save to sessionStorage as user types
[nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener("input", () => {
        sessionStorage.setItem(input.id, input.value);
    });
});

// 3️⃣ On form submit
contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
        formMessage.style.color = "red";
        formMessage.textContent = "⚠ Please fill out all fields.";
        return;
    }

    // ✅ Save to localStorage (permanent)
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    contacts.push({ name, email, message, date: new Date().toISOString() });
    localStorage.setItem("contacts", JSON.stringify(contacts));

    // Clear message sessionStorage after successful submit
    sessionStorage.removeItem("message");

    // Show success message
    formMessage.style.color = "green";
    formMessage.textContent = "✅ Thank you! Your message has been sent successfully.";

    // Clear message visually
    messageInput.value = "";
});
