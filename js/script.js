document.addEventListener("DOMContentLoaded", function() {
    // --- Reusable Components (Header/Footer) ---
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById("header-placeholder");
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
            }
        });

    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById("footer-placeholder");
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
            }
        });

    // --- Video Background Logic ---
    const heroSection = document.querySelector('.hero[data-video]');
    if (heroSection) {
        const video = heroSection.querySelector('.bg-video');
        if (video) {
            const videoName = heroSection.dataset.video;
            video.src = 'images/' + videoName;
        }
    }

    // --- Carousel Logic (Only for About Page) ---
    const modal = document.getElementById('carousel-modal');
    if (modal) {
        const carouselData = {
            hobbies: [
                { img: 'images/reading.jpg', text: 'Reading books and articles' },
                { img: 'images/music.jpg', text: 'Listening to music' },
                { img: 'images/gaming.jpg', text: 'Playing online games' },
                { img: 'images/watching.jpg', text: 'Watching YouTube and TikTok videos' },
                { img: 'images/travel.jpg', text: 'Traveling and exploring' }
            ],
            goals: [
                { img: 'images/grad.jpg', text: 'Graduate college' },
                { img: 'images/job.jpg', text: 'Get a good paying job' },
                { img: 'images/world.jpg', text: 'Travel the world' }
            ]
        };

        const swiperWrapper = modal.querySelector('.swiper-wrapper');
        const closeButton = modal.querySelector('.close-button');
        let swiper;
        let modalCloseTimer;

        const openModal = (carouselType) => {
            let data = carouselData[carouselType];

            // For small slide sets, duplicate the data to ensure smooth looping
            if (data.length > 0 && data.length < 5) {
                data = [...data, ...data];
            }
            
            swiperWrapper.innerHTML = ''; // Clear previous slides

            data.forEach(item => {
                const slide = `
                    <div class="swiper-slide" style="--slide-image: url('${item.img}')">
                        <img src="${item.img}" alt="${item.text}">
                        <p>${item.text}</p>
                    </div>`;
                swiperWrapper.insertAdjacentHTML('beforeend', slide);
            });

            window.clearTimeout(modalCloseTimer);
            modal.style.display = 'block';
            requestAnimationFrame(() => modal.classList.add('is-visible'));
            
            // Use requestAnimationFrame to ensure the browser has rendered the modal
            // before we initialize Swiper. This can help with performance.
            requestAnimationFrame(() => {
                if (swiper) swiper.destroy(true, true);
                swiper = new Swiper('.swiper-container', {
                    effect: 'fade',
                    grabCursor: true,
                    centeredSlides: false,
                    slidesPerView: 1,
                    speed: 750,
                    loop: true,
                    fadeEffect: {
                        crossFade: true,
                    },
                    resistanceRatio: 0.7,
                    watchSlidesProgress: true,
                    observer: true,
                    observeParents: true,
                    keyboard: {
                        enabled: true,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });
            });
        };

        const closeModal = () => {
            modal.classList.remove('is-visible');
            modalCloseTimer = window.setTimeout(() => {
                modal.style.display = 'none';
            }, 250);
        };

        // Open modal when a carousel card is clicked
        document.querySelectorAll('[data-carousel]').forEach(card => {
            card.addEventListener('click', function() {
                openModal(this.dataset.carousel);
            });
        });

        // --- Close Modal Listeners ---
        // Listen for click on the close button
        closeButton.addEventListener('click', closeModal);

        // Listen for click on the modal background
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        // Listen for 'Escape' key press
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    }

    // --- Gallery Viewer ---
    const galleryThumbnails = [...document.querySelectorAll('.gallery-thumbnail')];
    const galleryMainImage = document.getElementById('gallery-main-image');
    const galleryOpenImage = document.getElementById('gallery-open-image');
    const galleryMainTitle = document.getElementById('gallery-main-title');
    const galleryMainCategory = document.getElementById('gallery-main-category');
    const galleryPrevious = document.getElementById('gallery-previous');
    const galleryNext = document.getElementById('gallery-next');
    const galleryStage = document.getElementById('gallery-stage');

    if (galleryThumbnails.length && galleryMainImage && galleryOpenImage && galleryMainTitle && galleryMainCategory && galleryStage) {
        let activeGalleryIndex = 0;
        let galleryAutoplay;

        const showGalleryImage = (index) => {
            activeGalleryIndex = (index + galleryThumbnails.length) % galleryThumbnails.length;
            const thumbnail = galleryThumbnails[activeGalleryIndex];
            const { gallerySrc, galleryTitle, galleryCategory } = thumbnail.dataset;
            galleryStage.classList.add('is-changing');

            window.setTimeout(() => {
                galleryMainImage.src = gallerySrc;
                galleryMainImage.alt = galleryTitle;
                galleryOpenImage.href = gallerySrc;
                galleryMainTitle.textContent = galleryTitle;
                galleryMainCategory.textContent = galleryCategory;
                galleryThumbnails.forEach((item, itemIndex) => {
                    item.classList.toggle('is-selected', itemIndex === activeGalleryIndex);
                });
                galleryStage.classList.remove('is-changing');
            }, 180);
        };

        const resetGalleryAutoplay = () => {
            window.clearInterval(galleryAutoplay);
            galleryAutoplay = window.setInterval(() => showGalleryImage(activeGalleryIndex + 1), 6000);
        };

        const moveGalleryImage = (index) => {
            showGalleryImage(index);
            resetGalleryAutoplay();
        };

        galleryThumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => moveGalleryImage(index));
        });

        galleryPrevious?.addEventListener('click', () => moveGalleryImage(activeGalleryIndex - 1));
        galleryNext?.addEventListener('click', () => moveGalleryImage(activeGalleryIndex + 1));

        document.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') moveGalleryImage(activeGalleryIndex - 1);
            if (event.key === 'ArrowRight') moveGalleryImage(activeGalleryIndex + 1);
        });

        resetGalleryAutoplay();
    }

});
