/* =======================
   ABOUT SETTINGS
   ======================= */
// Animate sections on scroll
const scrollElements = document.querySelectorAll(".animate-on-scroll");
const funFacts = document.querySelectorAll(".fact");

const elementInView = (el, offset = 100) => {
    return el.getBoundingClientRect().top <= (window.innerHeight - offset);
};

const displayScrollElement = (element) => element.classList.add("active");

const handleScrollAnimation = () => {
    scrollElements.forEach(el => {
        if (elementInView(el, 100)) displayScrollElement(el);
    });

    funFacts.forEach(f => {
        if (elementInView(f, 50)) f.classList.add("active");
    });
};

window.addEventListener("scroll", handleScrollAnimation);
window.addEventListener("load", () => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    });

    document.querySelectorAll(".animate-on-scroll, .fact").forEach(el => observer.observe(el));
});
