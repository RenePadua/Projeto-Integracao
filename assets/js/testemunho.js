document.addEventListener("DOMContentLoaded", function() {
    const carouselContainer = document.querySelector(".testemunho-carousel-container");
    const carouselTrack = document.querySelector(".testemunho-carousel-track");
    const slides = document.querySelectorAll(".testemunho-slide");
    const prevButton = document.querySelector(".carousel-button.prev");
    const nextButton = document.querySelector(".carousel-button.next");
    const dotsContainer = document.querySelector(".carousel-dots");

    if (!carouselContainer || !carouselTrack || !slides.length || !prevButton || !nextButton || !dotsContainer) {
        console.warn("Testemunho Carousel: Um ou mais elementos não encontrados. O carrossel não será inicializado.");
        return;
    }

    let currentIndex = 0;
    const slideCount = slides.length;

    // Create dots
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === 0) {
            dot.classList.add("active");
        }
        dot.addEventListener("click", () => {
            currentIndex = i;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll(".carousel-dots .dot");

    function updateCarousel() {
        const slideWidth = slides[0].offsetWidth;
        carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    prevButton.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateCarousel();
    });

    nextButton.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
    });

    // Autoplay
    let autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
    }, 5000); // Change slide every 5 seconds

    // Pause autoplay on hover
    carouselContainer.addEventListener("mouseenter", () => {
        clearInterval(autoplayInterval);
    });

    carouselContainer.addEventListener("mouseleave", () => {
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slideCount;
            updateCarousel();
        }, 5000);
    });

    // Update carousel on resize
    window.addEventListener("resize", updateCarousel);

    // Initial update
    updateCarousel();
});
