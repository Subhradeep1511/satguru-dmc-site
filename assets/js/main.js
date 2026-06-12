


// ===== MEGA MENU =====
// 'headerReady' fires from includes.js after header.html is async-injected.
// Using DOMContentLoaded here would race against that fetch and find 0 nav items.
document.addEventListener('headerReady', function () {
    var megaItems = document.querySelectorAll('.nav-item[data-megamenu]');
    var allMenus = document.querySelectorAll('.mega-menu-bar');
    var hideTimer;

    megaItems.forEach(function (item) {
        var menuId = item.dataset.megamenu;
        var menu = document.getElementById(menuId);
        if (!menu) return;

        item.addEventListener('mouseenter', function () {
            clearTimeout(hideTimer);
            allMenus.forEach(function (m) { m.classList.remove('mega-active'); });
            menu.classList.add('mega-active');
        });

        item.addEventListener('mouseleave', function () {
            hideTimer = setTimeout(function () {
                if (!menu.matches(':hover')) menu.classList.remove('mega-active');
            }, 300);
        });

        menu.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
        menu.addEventListener('mouseleave', function () { menu.classList.remove('mega-active'); });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.main-header')) {
            allMenus.forEach(function (m) { m.classList.remove('mega-active'); });
        }
    });
});

// Hero Slider

document.addEventListener("DOMContentLoaded", function () {

    const navWidth = document.querySelector('.hero-slider-nav').offsetWidth;

    const swiper = new Swiper(".hero-tour-slider", {
        slidesPerView: "auto",
        spaceBetween: 40,
        centeredSlides: false,
        loop: false,
        speed: 700,
        grabCursor: true,
        watchOverflow: true,
        resistanceRatio: 0,

        // ✅ Dynamic arrow space fix
        slidesOffsetAfter: navWidth,

        navigation: {
            nextEl: "#nextSlide",
            prevEl: "#prevSlide",
        },

        breakpoints: {
            1800: { slidesPerView: 3.4, spaceBetween: 60 },
            1600: { slidesPerView: 3.4, spaceBetween: 30 },
            1500: { slidesPerView: 3.3, spaceBetween: 30 },
            1440: { slidesPerView: 3.3, spaceBetween: 30 },
            1400: { slidesPerView: 3.3, spaceBetween: 30 },
            1200: { slidesPerView: 2.7, spaceBetween: 30 },
            1100: { slidesPerView: 2.1, spaceBetween: 30 },
            991: { slidesPerView: 2, spaceBetween: 30 },
            767: { slidesPerView: 3, spaceBetween: 60 },
            600: { slidesPerView: 1, spaceBetween: 30 },
            320: { slidesPerView: 1, spaceBetween: 30 },
        },

        on: {
            init: function () {
                updateActiveCard(this);
                updateNavState(this);
            },
            slideChange: function () {
                updateActiveCard(this);
                updateNavState(this);
            }
        }
    });

    function updateActiveCard(swiper) {
        document.querySelectorAll(".tour-card").forEach(card => {
            card.classList.remove("active");
        });

        const activeSlide = swiper.slides[swiper.activeIndex];
        const activeCard = activeSlide.querySelector(".tour-card");

        if (activeCard) {
            activeCard.classList.add("active");
        }
    }

    function updateNavState(swiper) {
        const prevBtn = document.getElementById("prevSlide");
        const nextBtn = document.getElementById("nextSlide");

        prevBtn.classList.toggle("disabled", swiper.isBeginning);
        nextBtn.classList.toggle("disabled", swiper.isEnd);
    }

});



// Accordion Active Class

document.addEventListener("DOMContentLoaded", function () {

    const accordionItems = document.querySelectorAll(".custom-accordion .accordion-item");

    accordionItems.forEach(item => {

        const collapseEl = item.querySelector(".accordion-collapse");

        collapseEl.addEventListener("show.bs.collapse", function () {

            // Remove active from all
            accordionItems.forEach(i => i.classList.remove("active"));

            // Add active to current
            item.classList.add("active");
        });

        collapseEl.addEventListener("hide.bs.collapse", function () {
            item.classList.remove("active");
        });

    });

});

// Mobile Banner Slider
const heroMobileSlider = new Swiper(".hero-tour-slider-mobile", {
    slidesPerView: 1.2,
    spaceBetween: 15,
    loop: false,
    speed: 800,

    navigation: {
        nextEl: ".hero-next",
        prevEl: ".hero-prev",
    },

    breakpoints: {
        1800: { slidesPerView: 4.3, spaceBetween: 20 },
        1600: { slidesPerView: 4.3, spaceBetween: 30 },
        1500: { slidesPerView: 4.5, spaceBetween: 30 },
        1440: { slidesPerView: 4.5, spaceBetween: 30 },
        1400: { slidesPerView: 4.5, spaceBetween: 30 },
        1200: { slidesPerView: 3, spaceBetween: 30 },
        1100: { slidesPerView: 3, spaceBetween: 30 },
        991: { slidesPerView: 3, spaceBetween: 30 },
        820: { slidesPerView: 3, spaceBetween: 30 },
        767: { slidesPerView: 2, spaceBetween: 30 },
        600: { slidesPerView: 2, spaceBetween: 30 },
        320: { slidesPerView: 1, spaceBetween: 30 },
    },

});




// Testimonial Slider

const swiper = new Swiper(".testimonialSwiper", {
    slidesPerView: 3,
    centeredSlides: true,
    spaceBetween: 40,
    loop: true,
    speed: 800,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1200: {
            slidesPerView: 3,
        }
    }
});


// Package Slider 






// ===== GSAP TEXT REVEAL =====
gsap.registerPlugin(ScrollTrigger);

// Selectors for all section headings
const textTitles = document.querySelectorAll(`
    .about-stats-section h2,
    .tour-package-section .tour-heading,
    .services-section h2,
    .mice-section h2,
    .how-book-section .section-title
`);

// Helper: wrap each word → each char in spans
function splitTextToWords(el) {
    // Handle inner <span> tags (colored words) too
    const childNodes = Array.from(el.childNodes);
    el.innerHTML = '';

    childNodes.forEach(node => {
        if (node.nodeType === 3) {
            // Plain text node — split into words
            const words = node.textContent.split(/(\s+)/);
            words.forEach(word => {
                if (word.trim() === '') {
                    el.appendChild(document.createTextNode(word));
                } else {
                    const wordSpan = document.createElement('span');
                    wordSpan.classList.add('word');
                    const inner = document.createElement('span');
                    inner.classList.add('char-inner');
                    inner.textContent = word;
                    wordSpan.appendChild(inner);
                    el.appendChild(wordSpan);
                }
            });
        } else if (node.nodeType === 1) {
            // Element node (e.g. <span> colored text)
            const wrapper = node.cloneNode(false);
            const words = node.textContent.split(/(\s+)/);
            words.forEach(word => {
                if (word.trim() === '') {
                    wrapper.appendChild(document.createTextNode(word));
                } else {
                    const wordSpan = document.createElement('span');
                    wordSpan.classList.add('word');
                    const inner = document.createElement('span');
                    inner.classList.add('char-inner');
                    inner.textContent = word;
                    wordSpan.appendChild(inner);
                    wrapper.appendChild(wordSpan);
                }
            });
            el.appendChild(wrapper);
        }
    });

    el.classList.add('gsap-title');
}

// Apply animation to each title
textTitles.forEach(title => {
    splitTextToWords(title);

    const chars = title.querySelectorAll('.char-inner');

    gsap.to(chars, {
        scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            once: true
        },
        translateY: '0%',
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.06   // each word appears 60ms after the previous
    });
});