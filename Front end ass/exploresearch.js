
/* =======================
    Search Function with Session Storage
  ======================= */

// 1️⃣ Get form, input, and grid items
const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const figures = document.querySelectorAll('#grid figure');
const noResults = document.getElementById('noResults');

// 2️⃣ Add event when user submits the form
form.addEventListener('submit', function (e) {
  e.preventDefault(); // stop page reload

  // 3️⃣ Get the search text (lowercase for case-insensitive match)
  let query = input.value.toLowerCase().trim();

  // Save search to sessionStorage
  sessionStorage.setItem('lastSearch', query);

  let found = false; // track if we found anything

  // 4️⃣ Loop through each figure (state)
  figures.forEach(fig => {
    let caption = fig.querySelector('figcaption').textContent.toLowerCase();

    // 5️⃣ If caption includes search text → show it
    if (caption.includes(query)) {
      fig.style.display = "block";
      found = true;
    }
    // 6️⃣ If not matching → hide it
    else {
      fig.style.display = "none";
    }
  });

  // 7️⃣ Show "No results" if nothing matched
  if (!found) {
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
  }
});