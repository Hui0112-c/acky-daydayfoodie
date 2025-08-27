/* =======================
   ALBUM HANDLING
======================= */

// Check if user is logged in
function isLoggedIn() {
  return (
    (sessionStorage.getItem("username") || getCookie("username")) &&
    (sessionStorage.getItem("gmail") || getCookie("gmail"))
  );
}

// Get current user’s album
function getUserAlbum() {
  const username = sessionStorage.getItem("username") || getCookie("username");
  if (!username) return [];
  return JSON.parse(localStorage.getItem(username + "_album")) || [];
}

// Save album
function saveUserAlbum(album) {
  const username = sessionStorage.getItem("username") || getCookie("username");
  if (!username) return;
  localStorage.setItem(username + "_album", JSON.stringify(album));
}

// Clear album UI
function clearAlbum() {
  const list = document.getElementById("albumList");
  if (list) list.innerHTML = "";
}

// Load album UI
function loadAlbum() {
  const list = document.getElementById("albumList");
  if (!list) return;

  if (!isLoggedIn()) {
    clearAlbum();
    return;
  }

  const album = getUserAlbum();
  list.innerHTML = "";

  album.forEach(item => {
    const li = document.createElement("li");
    li.className = "album-item";

    const img = document.createElement("img");
    img.src = item.img;
    img.alt = item.name;

    const caption = document.createElement("p");
    caption.textContent = item.name;

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Remove';
    removeBtn.className = "remove-btn";

    li.appendChild(img);
    li.appendChild(caption);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

/* =======================
   MODAL + LOGIN HANDLER
======================= */
window.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("loginModal");
  const loginOkBtn = document.getElementById("loginModalOkBtn");
  const formContainer = document.getElementById("welcomeFormContainer");
  const content = document.getElementById("websiteContent");

  // Modal OK button: show login form
  if (loginOkBtn) {
    loginOkBtn.addEventListener("click", () => {
      loginModal.style.display = "none";
      formContainer.style.display = "block";
      content.style.display = "none";
    });
  }

  // "My Album" link click handler
  const myAlbumLink = document.getElementById("myAlbumLink");
  if (myAlbumLink) {
    myAlbumLink.addEventListener("click", (e) => {
      e.preventDefault(); // prevent default navigation

      if (!isLoggedIn()) {
        // Save desired page to redirect after login
        localStorage.setItem("redirectAfterLogin", "album.html");

        // Show login modal
        if (loginModal) loginModal.style.display = "flex";
        return;
      }

      // If logged in → navigate to album.html
      window.location.href = "album.html";
    });
  }

  // Automatically redirect if login completed and a page is saved
  const redirectPage = localStorage.getItem("redirectAfterLogin");
  if (isLoggedIn() && redirectPage) {
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = redirectPage;
  }

  // Attach click handlers for like buttons
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!isLoggedIn()) {
        localStorage.setItem("redirectAfterLogin", window.location.pathname);
        if (loginModal) loginModal.style.display = "flex";
        return;
      }

      const food = btn.getAttribute("data-food");
      const img = btn.getAttribute("data-img");

      let album = getUserAlbum();
      if (!album.some(item => item.name === food)) {
        album.push({ name: food, img: img });
        saveUserAlbum(album);
        // Success
        showNotification("❤️ " + food + " added to your album!", 3500, "success");
      } else {
        // Error / already in album
        showNotification("⚠️ " + food + " is already in your album!", 3500, "error");
      }

      loadAlbum();
    });
  });

  // Load album on page load
  if (document.getElementById("albumList")) {
    loadAlbum();
  }
});

/* =======================
   NOTIFICATION BOX
======================= */
function showNotification(message, duration = 3500, type = "success") {
  const notification = document.getElementById("notification");
  if (!notification) return;

  notification.textContent = message;

  // Remove previous type classes
  notification.classList.remove("success", "error");

  // Add new type class
  notification.classList.add(type);

  // Show notification
  notification.style.display = "block";
  notification.style.opacity = "1";

  // Hide after duration
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      notification.style.display = "none";
    }, 300);
  }, duration);
}

/* =======================
   REMOVE CONFIRMATION MODAL
======================= */
document.addEventListener("DOMContentLoaded", () => {
  const albumList = document.getElementById("albumList");
  const removeModal = document.getElementById("removeConfirmModal");
  const removeYes = document.getElementById("removeConfirmYes");
  const removeCancel = document.getElementById("removeConfirmCancel");

  let itemToRemove = null;

  // Delegate remove button clicks
  albumList.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-btn");
    if (!btn) return;

    itemToRemove = btn.closest(".album-item");
    removeModal.style.display = "flex"; // show confirmation modal
  });

  // Confirm removal
  removeYes.onclick = () => {
    if (itemToRemove) {
      const itemName = itemToRemove.querySelector("p").textContent;
      let album = getUserAlbum();
      album = album.filter(f => f.name !== itemName);
      saveUserAlbum(album);

      itemToRemove.remove();
      showNotification("🗑️ This dish has been removed from your album.", 3500, "success");
      itemToRemove = null;
    }
    removeModal.style.display = "none";
  };

  // Cancel removal
  removeCancel.onclick = () => {
    removeModal.style.display = "none";
    itemToRemove = null;
  };
});



