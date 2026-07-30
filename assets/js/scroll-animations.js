/* ==========================================================================
   AURA AI — ANIMATIONS & INTERACTION ENGINE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. SCROLL REVEAL OBSERVER
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Optional: Unobserve after revealing if you want it to trigger once
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Attach observer to all elements with class .reveal
  const revealElements = document.querySelectorAll(".reveal");
  revealElements.forEach(el => revealObserver.observe(el));

  // 2. TACTILE 3D CARD TILT EFFECT
  const cards = document.querySelectorAll(".card-sleek");
  
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6; // Max rotation angle
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  });

  // 3. SMOOTH SCROLL FOR NAV LINKS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === "#") return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});
