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

        const openModal = (carouselType) => {
            let data = carouselData[carouselType];

            // For small slide sets, duplicate the data to ensure smooth looping
            if (data.length > 0 && data.length < 5) {
                data = [...data, ...data];
            }
            
            swiperWrapper.innerHTML = ''; // Clear previous slides

            data.forEach(item => {
                const slide = `
                    <div class="swiper-slide">
                        <img src="${item.img}" alt="${item.text}">
                        <p>${item.text}</p>
                    </div>`;
                swiperWrapper.insertAdjacentHTML('beforeend', slide);
            });

            modal.style.display = 'block';
            
            // Use requestAnimationFrame to ensure the browser has rendered the modal
            // before we initialize Swiper. This can help with performance.
            requestAnimationFrame(() => {
                if (swiper) swiper.destroy(true, true);
                swiper = new Swiper('.swiper-container', {
                    effect: 'coverflow',
                    grabCursor: true,
                    centeredSlides: true,
                    slidesPerView: 'auto',
                    speed: 1000, // Increased for a potentially smoother feel
                    coverflowEffect: {
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    },
                    loop: true,
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
            modal.style.display = 'none';
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
});
