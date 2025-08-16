// Diagrama com Carrossel - Script de Funcionalidade
document.addEventListener('DOMContentLoaded', function () {
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    const circles = document.querySelectorAll('.circle');

    let currentSlide = 0;
    let totalSlides = 0;
    let cardWidth = 0;
    let cardsPerView = 1;
    let isAutoplay = false;
    let autoplayInterval = null;
    let isTransitioning = false;

    const config = {
        autoplayDelay: 4000,
        transitionDuration: 500,
        swipeThreshold: 50
    };

    init();

    function init() {
        if (!carouselTrack || !prevBtn || !nextBtn) {
            console.error('Elementos essenciais do carrossel não encontrados');
            return;
        }

        calculateDimensions();
        createIndicators();
        updateDisplay();
        addEventListeners();
        addTouchSupport();
        toggleAutoplayByCardsPerView();
    }

    function calculateDimensions() {
        const cards = carouselTrack.querySelectorAll('.content-card');
        totalSlides = cards.length;

        if (totalSlides === 0) return;

        const containerWidth = carouselTrack.parentElement.offsetWidth;
        const firstCard = cards[0];
        cardWidth = firstCard.offsetWidth;
        const gap = parseInt(getComputedStyle(carouselTrack).gap) || 16;

        cardsPerView = Math.floor((containerWidth + gap) / (cardWidth + gap));
        cardsPerView = Math.max(1, Math.min(cardsPerView, totalSlides));
    }

    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        const maxSlides = Math.max(1, totalSlides - cardsPerView + 1);

        for (let i = 0; i < maxSlides; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.setAttribute('data-slide', i);
            indicator.setAttribute('aria-label', `Ir para slide ${i + 1}`);

            if (i === 0) indicator.classList.add('active');

            indicator.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    }

    function addEventListeners() {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        circles.forEach(circle => {
            circle.addEventListener('click', handleCircleClick);
            circle.addEventListener('keydown', handleCircleKeydown);
            circle.setAttribute('tabindex', '0');
            circle.setAttribute('role', 'button');
        });

        document.addEventListener('keydown', handleKeyboardNavigation);
        window.addEventListener('resize', debounce(handleResize, 250));

        carouselTrack.addEventListener('mouseenter', pauseAutoplay);
        carouselTrack.addEventListener('mouseleave', resumeAutoplay);
    }

    function addTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            carouselTrack.style.transition = 'none';
        });

        carouselTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            const currentTransform = -(currentSlide * (cardWidth + 16));
            carouselTrack.style.transform = `translateX(${currentTransform + diffX}px)`;
        });

        carouselTrack.addEventListener('touchend', () => {
            if (!isDragging) return;
            const diffX = currentX - startX;
            carouselTrack.style.transition = '';
            if (Math.abs(diffX) > config.swipeThreshold) {
                diffX > 0 ? prevSlide() : nextSlide();
            } else {
                updateCarouselPosition();
            }
            isDragging = false;
        });
    }

    function handleCircleClick(event) {
        const concept = event.currentTarget.getAttribute('data-concept');
        filterCardsByConcept(concept);
    }

    function handleCircleKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const concept = event.currentTarget.getAttribute('data-concept');
            filterCardsByConcept(concept);
        }
    }

    function filterCardsByConcept(concept) {
        const cards = carouselTrack.querySelectorAll('.content-card');
        let targetIndex = 0;
        for (let [index, card] of [...cards].entries()) {
            if (card.getAttribute('data-category') === concept) {
                targetIndex = index;
                break;
            }
        }
        goToSlide(targetIndex);

        // Liga autoplay somente se houver mais de um card e apenas 1 visível por vez
        toggleAutoplayByCardsPerView();

        circles.forEach(circle => circle.classList.remove('active'));
        const clickedCircle = document.querySelector(`[data-concept="${concept}"]`);
        if (clickedCircle) clickedCircle.classList.add('active');
        setTimeout(() => circles.forEach(c => c.classList.remove('active')), 2000);
    }

    function prevSlide() {
        if (isTransitioning) return;
        const maxSlides = Math.max(1, totalSlides - cardsPerView + 1);
        currentSlide = currentSlide > 0 ? currentSlide - 1 : maxSlides - 1;
        updateCarousel();
    }

    function nextSlide() {
        if (isTransitioning) return;
        const maxSlides = Math.max(1, totalSlides - cardsPerView + 1);
        currentSlide = currentSlide < maxSlides - 1 ? currentSlide + 1 : 0;
        updateCarousel();
    }

    function goToSlide(index) {
        if (isTransitioning) return;
        const maxSlides = Math.max(1, totalSlides - cardsPerView + 1);
        currentSlide = Math.max(0, Math.min(index, maxSlides - 1));
        updateCarousel();
    }

    function updateCarousel() {
        isTransitioning = true;
        updateCarouselPosition();
        updateIndicators();
        updateDisplay();
        setTimeout(() => isTransitioning = false, config.transitionDuration);
    }

    function updateCarouselPosition() {
        const gap = parseInt(getComputedStyle(carouselTrack).gap) || 16;
        const translateX = -(currentSlide * (cardWidth + gap));
        carouselTrack.style.transform = `translateX(${translateX}px)`;
    }

    function updateIndicators() {
        const indicators = indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function updateDisplay() {
        const maxSlides = Math.max(1, totalSlides - cardsPerView + 1);
        prevBtn.disabled = maxSlides <= 1;
        nextBtn.disabled = maxSlides <= 1;
    }

    function startAutoplay() {
        if (totalSlides <= cardsPerView) return;
        stopAutoplay();
        isAutoplay = true;
        autoplayInterval = setInterval(nextSlide, config.autoplayDelay);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
        isAutoplay = false;
    }

    function pauseAutoplay() {
        if (isAutoplay && autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }

    function resumeAutoplay() {
        if (isAutoplay && !autoplayInterval) {
            autoplayInterval = setInterval(nextSlide, config.autoplayDelay);
        }
    }

    function toggleAutoplayByCardsPerView() {
        if (totalSlides > 1 && cardsPerView === 1) {
            startAutoplay();
        } else {
            stopAutoplay();
        }
    }

    function handleKeyboardNavigation(event) {
        if (!carouselTrack.contains(document.activeElement) &&
            !prevBtn.contains(document.activeElement) &&
            !nextBtn.contains(document.activeElement)) {
            return;
        }
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                prevSlide();
                break;
            case 'ArrowRight':
                event.preventDefault();
                nextSlide();
                break;
            case 'Home':
                event.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                event.preventDefault();
                goToSlide(totalSlides - cardsPerView);
                break;
        }
    }

    function handleResize() {
        calculateDimensions();
        createIndicators();
        const maxSlides = Math.max(1, totalSlides - cardsPerView + 1);
        if (currentSlide >= maxSlides) {
            currentSlide = maxSlides - 1;
        }
        updateCarousel();
        toggleAutoplayByCardsPerView();
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }
});
