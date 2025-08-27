/* =======================
   COOKIES + SESSION HELPERS
======================= */
function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days = 7) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${days * 86400}`;
}

function clearCookie(name) {
    document.cookie = `${name}=; path=/; max-age=0`;
}

/* =======================
   ELEMENTS
======================= */
const formContainer = document.getElementById("welcomeFormContainer");
const content = document.getElementById("websiteContent");
const greeting = document.getElementById("greeting");
const authBtn = document.getElementById("authBtn");
const button = document.getElementById("continueBtn");
const skipBtn = document.getElementById("skipBtn");

/* =======================
   LOGIN / LOGOUT STATE
======================= */
function isLoggedIn() {
    return (
        (sessionStorage.getItem("username") || getCookie("username")) &&
        (sessionStorage.getItem("gmail") || getCookie("gmail"))
    );
}

function hasSkipped() {
    return sessionStorage.getItem("skipped") || getCookie("skipped");
}

/* =======================
   UI UPDATE
======================= */
function showWebsite(name, gmail) {
    if (formContainer) formContainer.style.display = "none";
    if (content) content.style.display = "block";

    if (greeting) greeting.textContent = name ? `Hey ${name}! 🍜` : "";
}

function showLoginForm() {
    if (formContainer) formContainer.style.display = "block";
    if (content) content.style.display = "none";
}

function updateAuthUI() {
    if (!authBtn) return;

    if (isLoggedIn()) {
        // User logged in → show Logout
        authBtn.textContent = "Logout";
        authBtn.onclick = (e) => {
            e.preventDefault();

            // Clear session + cookies
            sessionStorage.clear();
            clearCookie("username");
            clearCookie("gmail");
            clearCookie("skipped");

            //Clear redirect history immediately
            localStorage.removeItem("redirectAfterLogin");
            sessionStorage.removeItem("redirectAfterLogin");

            // Show logout modal
            const logoutModal = document.getElementById("logoutModal");
            if (logoutModal) {
                logoutModal.style.display = "block";
                const okBtn = document.getElementById("modalOkBtn");

                if (okBtn) {
                    okBtn.onclick = () => {
                        logoutModal.style.display = "none";

                        //Switch to guest mode, not back to login form
                        if (formContainer) formContainer.style.display = "none";
                        if (content) content.style.display = "block";
                        if (greeting) greeting.textContent = ""; // clear greeting

                        // Clear album/history immediately
                        if (typeof clearAlbum === "function") {
                            clearAlbum();
                        }

                        updateAuthUI();
                        updateUI(); // <--- refresh state right away

                    };
                }
            } else {
                // If no modal on this page → just refresh or redirect home
                window.location.href = window.location.href;
            }
        };

    } else {
        // User not logged in → show Login
        authBtn.textContent = "Login";
        authBtn.onclick = (e) => {
            e.preventDefault();
            showLoginForm();

        };
    }
}

function updateUI() {
    if (isLoggedIn()) {
        const name = sessionStorage.getItem("username") || getCookie("username");
        const gmail = sessionStorage.getItem("gmail") || getCookie("gmail");
        showWebsite(name, gmail);

        // Ensure album/history refreshes right after login
        if (typeof loadAlbum === "function") {
            loadAlbum();
        }

    } else if (hasSkipped()) {
        showWebsite(null, null);
    } else {
        showLoginForm();
    }
}

/* =======================
   VALIDATION
======================= */
function showError(input, message) {
    removeError(input);
    const error = document.createElement("div");
    error.className = "error-msg";
    error.textContent = message;
    input.classList.add("error");
    input.parentNode.insertBefore(error, input.nextSibling);
}

function removeError(input) {
    input.classList.remove("error");
    const next = input.nextSibling;
    if (next && next.classList && next.classList.contains("error-msg")) {
        next.remove();
    }
}

function validateInputs(name, gmail) {
    let valid = true;
    const nameInput = document.getElementById("usernameInput");
    const gmailInput = document.getElementById("gmailInput");

    if (!name) {
        showError(nameInput, "⚠ Please enter your name.");
        valid = false;
    } else removeError(nameInput);

    if (!gmail) {
        showError(gmailInput, "⚠ Please enter your Gmail.");
        valid = false;
    } else if (!gmail.endsWith("@gmail.com")) {
        showError(gmailInput, "⚠ Please enter a valid Gmail address.");
        valid = false;
    } else removeError(gmailInput);

    return valid;
}

/* =======================
   EVENTS + REDIRECT FIX
======================= */
window.onload = () => {
    updateUI();
    updateAuthUI();

    // Handle redirect after login (only once)
    if (isLoggedIn()) {
        const redirectPage = localStorage.getItem("redirectAfterLogin");
        if (redirectPage) {
            localStorage.removeItem("redirectAfterLogin"); // clear right away
            if (!window.location.pathname.includes(redirectPage)) {
                window.location.href = redirectPage;
            }
        }
    }
};

if (button) {
    button.onclick = () => {
        const name = document.getElementById("usernameInput").value.trim();
        const gmail = document.getElementById("gmailInput").value.trim();

        if (!validateInputs(name, gmail)) return;

        sessionStorage.setItem("username", name);
        sessionStorage.setItem("gmail", gmail);
        setCookie("username", name);
        setCookie("gmail", gmail);

        //Check for redirect immediately after login
        const redirectPage = localStorage.getItem("redirectAfterLogin");
        localStorage.removeItem("redirectAfterLogin"); // clear once used
        if (redirectPage && !window.location.pathname.includes(redirectPage)) {
            window.location.href = redirectPage;
            return; // stop here so UI doesn’t flash
        }

        showWebsite(name, gmail);
        updateAuthUI();
        updateUI(); // refresh state

        // Refresh album/history if available
        if (typeof loadAlbum === "function") {
            loadAlbum();
        }
    };
}

if (skipBtn) {
    skipBtn.onclick = () => {
        sessionStorage.setItem("skipped", "true");
        setCookie("skipped", "true");
        showWebsite(null, null);
        updateAuthUI();
    };
}
