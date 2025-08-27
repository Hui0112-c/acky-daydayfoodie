document.querySelectorAll(".dropdown > a").forEach(link=> {
        link.addEventListener("click", e=> {
                e.preventDefault();
                const dropdown=link.nextElementSibling;
                dropdown.style.display=dropdown.style.display==="block" ? "none" : "block";
            });
    });