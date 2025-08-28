


// <!===== Search Function with Session Storage=====> //
    // Get form, input, and grid items
    const form = document.getElementById('searchForm');
    const input = document.getElementById('searchInput');
    const items = document.querySelectorAll('.column');
    const noResults = document.getElementById('noResults');

    // Add event when user submits the form
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // stop page reload

      // Get the search text (lowercase for case-insensitive match)
      let query = input.value.toLowerCase().trim();

      // Save search to sessionStorage
      sessionStorage.setItem('lastSearch', query);

      let found = false; // track if we found anything

      // Loop through each food
      items.forEach(item => {
        let title = item.querySelector('.foodName').textContent.toLowerCase();

        // If caption includes search text → show it
        if (title.includes(query)) {
          item.style.display = "block";
          found = true;
        }
        // If not matching → hide it
        else {
          item.style.display = "none";
        }
      });

      // Show "No results" if nothing matched
      if (!found) {
        noResults.style.display = "block";
      } else {
        noResults.style.display = "none";
      }

    });
