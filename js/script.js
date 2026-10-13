/* =========================================================
   BOUNCER INDOOR SPORTS (PVT.) LTD.
   MODERN INTERACTIVE JAVASCRIPT
   Powered by Tailwind CSS, Framer Motion (Motion One), & AOS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. AOS (ANIMATE ON SCROLL) INITIALIZATION
    ===================================================== */
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            easing: "ease-out-cubic",
            once: true,
            offset: 50,
            delay: 50
        });
    }


    /* =====================================================
       2. MOTION (FRAMER MOTION VANILLA ENGINE) INTEGRATION
    ===================================================== */
    const Motion = window.Motion || null;

    // A. Page Scroll Progress Indicator
    const progressBar = document.getElementById("scroll-progress");
    if (progressBar) {
        if (Motion && typeof Motion.scroll === "function") {
            Motion.scroll(({ y }) => {
                progressBar.style.width = `${y.progress * 100}%`;
            });
        } else {
            window.addEventListener("scroll", () => {
                const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
                if (totalScroll > 0) {
                    const progress = (window.scrollY / totalScroll) * 100;
                    progressBar.style.width = `${progress}%`;
                }
            });
        }
    }

    // B. Spring Hover Physics on Magnetic/Hero Buttons
    const interactiveButtons = document.querySelectorAll(".motion-hover-btn");
    interactiveButtons.forEach((btn) => {
        btn.addEventListener("mouseenter", () => {
            if (Motion && typeof Motion.animate === "function") {
                Motion.animate(btn, { scale: 1.04 }, { duration: 0.25, easing: "ease-out" });
            }
        });
        btn.addEventListener("mouseleave", () => {
            if (Motion && typeof Motion.animate === "function") {
                Motion.animate(btn, { scale: 1 }, { duration: 0.2, easing: "ease-in" });
            }
        });
    });

    // C. Animated Metric Counters in Stats Bar
    const statCounters = document.querySelectorAll("[data-counter-target]");
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        statCounters.forEach((counter) => {
            const targetVal = parseFloat(counter.getAttribute("data-counter-target")) || 0;
            const prefix = counter.getAttribute("data-counter-prefix") || "";
            const suffix = counter.getAttribute("data-counter-suffix") || "";
            const isCurrency = counter.getAttribute("data-counter-comma") === "true";

            let startVal = 0;
            const duration = 1400; // ms
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentNum = Math.floor(startVal + (targetVal - startVal) * easeOut);

                const formattedNum = isCurrency
                    ? currentNum.toLocaleString()
                    : currentNum.toString();

                counter.textContent = `${prefix}${formattedNum}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    const finalFormatted = isCurrency
                        ? targetVal.toLocaleString()
                        : targetVal.toString();
                    counter.textContent = `${prefix}${finalFormatted}${suffix}`;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    const statsSection = document.getElementById("stats-banner");
    if (statsSection) {
        if ("IntersectionObserver" in window) {
            const counterObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            animateCounters();
                            counterObserver.disconnect();
                        }
                    });
                },
                { threshold: 0.2 }
            );
            counterObserver.observe(statsSection);
        } else {
            animateCounters();
        }
    }


    /* =====================================================
       3. MOBILE NAVIGATION DRAWER
    ===================================================== */
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenuClose = document.getElementById("mobile-menu-close");
    const mobileDrawer = document.getElementById("mobile-drawer");
    const mobileBackdrop = document.getElementById("mobile-backdrop");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

    function openMobileMenu() {
        if (!mobileDrawer || !mobileBackdrop) return;
        mobileBackdrop.classList.remove("hidden");
        mobileDrawer.classList.remove("translate-x-full");
        document.body.style.overflow = "hidden";

        if (Motion && typeof Motion.animate === "function") {
            Motion.animate(mobileBackdrop, { opacity: [0, 1] }, { duration: 0.25 });
            Motion.animate(mobileDrawer, { transform: ["translateX(100%)", "translateX(0%)"] }, { duration: 0.35, easing: "ease-out" });
        }
    }

    function closeMobileMenu() {
        if (!mobileDrawer || !mobileBackdrop) return;
        document.body.style.overflow = "";

        if (Motion && typeof Motion.animate === "function") {
            Motion.animate(mobileDrawer, { transform: ["translateX(0%)", "translateX(100%)"] }, { duration: 0.25, easing: "ease-in" });
            Motion.animate(mobileBackdrop, { opacity: [1, 0] }, { duration: 0.2 }).finished.then(() => {
                mobileDrawer.classList.add("translate-x-full");
                mobileBackdrop.classList.add("hidden");
            });
        } else {
            mobileDrawer.classList.add("translate-x-full");
            mobileBackdrop.classList.add("hidden");
        }
    }

    if (mobileMenuToggle) mobileMenuToggle.addEventListener("click", openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener("click", closeMobileMenu);
    if (mobileBackdrop) mobileBackdrop.addEventListener("click", closeMobileMenu);
    mobileNavLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));


    /* =====================================================
       4. FACILITY CATEGORY FILTER TABS
    ===================================================== */
    const filterButtons = document.querySelectorAll(".facility-filter-btn");
    const facilityCards = document.querySelectorAll(".facility-card-item");

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const category = btn.getAttribute("data-filter");

            // Update Active Tab Pill
            filterButtons.forEach((b) => {
                b.classList.remove("bg-brand-green", "text-white", "shadow-glow-green");
                b.classList.add("bg-brand-surface", "text-slate-300", "border", "border-slate-800");
            });
            btn.classList.remove("bg-brand-surface", "text-slate-300", "border", "border-slate-800");
            btn.classList.add("bg-brand-green", "text-white", "shadow-glow-green");

            // Animate card filtering
            facilityCards.forEach((card) => {
                const cardCat = card.getAttribute("data-category");
                const shouldShow = category === "all" || cardCat === category;

                if (shouldShow) {
                    card.style.display = "flex";
                    if (Motion && typeof Motion.animate === "function") {
                        Motion.animate(card, { opacity: [0, 1], transform: ["scale(0.96)", "scale(1)"] }, { duration: 0.3 });
                    }
                } else {
                    card.style.display = "none";
                }
            });

            // Recompute AOS positions
            if (typeof AOS !== "undefined") {
                AOS.refresh();
            }
        });
    });


    /* =====================================================
       5. GALLERY LIGHTBOX MODAL WITH MOTIONS
    ===================================================== */
    const galleryItems = [
        {
            src: "images/cover.jpg",
            title: "Our Cricket Facility",
            desc: "Delkanda, Nugegoda - Premium all-weather indoor cricket practice arena"
        },
        {
            src: "images/logo.jpeg",
            title: "Bouncer Indoor Sports",
            desc: "Official brand logo and facility identity"
        },
        {
            src: "images/indoor-net.jpg",
            title: "Indoor Practice Nets",
            desc: "High-spec practice nets with professional lighting and synthetic turf"
        },
        {
            src: "images/facility-rates.jpg",
            title: "2026 Facility Rates",
            desc: "Official standard rate card and session packages"
        },
        {
            src: "images/hardball-machine.jpg",
            title: "Hardball Bowling Machine",
            desc: "State-of-the-art bowling machine delivering up to 140+ km/h speeds"
        },
        {
            src: "images/softball-machine.jpg",
            title: "Softball Bowling Machine",
            desc: "Consistent target drills and stroke play practice"
        },
        {
            src: "images/full-court.jpg",
            title: "Indoor Full Court",
            desc: "Full indoor arena for softball tournaments and team training"
        },
        {
            src: "images/monday-machine-madness.jpg",
            title: "Monday Machine Madness",
            desc: "Special weekly offer on bowling machine practice sessions"
        }
    ];

    let currentGalleryIndex = 0;
    const galleryModal = document.getElementById("gallery-modal");
    const modalImage = document.getElementById("modal-image");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalCounter = document.getElementById("modal-counter");
    const modalClose = document.getElementById("modal-close");
    const modalPrev = document.getElementById("modal-prev");
    const modalNext = document.getElementById("modal-next");

    function showLightbox(index) {
        if (!galleryModal || !galleryItems[index]) return;
        currentGalleryIndex = index;
        const item = galleryItems[index];

        modalImage.src = item.src;
        modalImage.alt = item.title;
        modalTitle.textContent = item.title;
        modalDesc.textContent = item.desc;
        if (modalCounter) {
            modalCounter.textContent = `${index + 1} / ${galleryItems.length}`;
        }

        galleryModal.classList.add("active");
        document.body.style.overflow = "hidden";

        if (Motion && typeof Motion.animate === "function") {
            Motion.animate("#modal-image-container", { scale: [0.94, 1], opacity: [0, 1] }, { duration: 0.3, easing: "ease-out" });
        }
    }

    function closeLightbox() {
        if (!galleryModal) return;
        galleryModal.classList.remove("active");
        document.body.style.overflow = "";
    }

    function prevGalleryItem() {
        const newIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
        showLightbox(newIndex);
    }

    function nextGalleryItem() {
        const newIndex = (currentGalleryIndex + 1) % galleryItems.length;
        showLightbox(newIndex);
    }

    // Attach click events to gallery cards
    const galleryCards = document.querySelectorAll(".gallery-card");
    galleryCards.forEach((card, idx) => {
        card.addEventListener("click", () => {
            showLightbox(idx);
        });
    });

    if (modalClose) modalClose.addEventListener("click", closeLightbox);
    if (modalPrev) modalPrev.addEventListener("click", (e) => { e.stopPropagation(); prevGalleryItem(); });
    if (modalNext) modalNext.addEventListener("click", (e) => { e.stopPropagation(); nextGalleryItem(); });

    if (galleryModal) {
        galleryModal.addEventListener("click", (e) => {
            if (e.target === galleryModal || e.target.id === "modal-backdrop-area") {
                closeLightbox();
            }
        });
    }

    // Keyboard support for Lightbox
    window.addEventListener("keydown", (e) => {
        if (!galleryModal || !galleryModal.classList.contains("active")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") prevGalleryItem();
        if (e.key === "ArrowRight") nextGalleryItem();
    });


    /* =====================================================
       6. ACTIVE SECTION SCROLL-SPY
    ===================================================== */
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".desktop-nav-link");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute("id");
                        navLinks.forEach((link) => {
                            if (link.getAttribute("href") === `#${id}`) {
                                link.classList.add("text-brand-accent", "font-bold");
                                link.classList.remove("text-slate-300");
                            } else {
                                link.classList.remove("text-brand-accent", "font-bold");
                                link.classList.add("text-slate-300");
                            }
                        });
                    }
                });
            },
            { rootMargin: "-25% 0px -60% 0px" }
        );

        sections.forEach((s) => observer.observe(s));
    }


    /* =====================================================
       7. BACK TO TOP BUTTON
    ===================================================== */
    const backToTopBtn = document.getElementById("back-to-top");
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.remove("opacity-0", "pointer-events-none", "translate-y-4");
                backToTopBtn.classList.add("opacity-100", "pointer-events-auto", "translate-y-0");
            } else {
                backToTopBtn.classList.add("opacity-0", "pointer-events-none", "translate-y-4");
                backToTopBtn.classList.remove("opacity-100", "pointer-events-auto", "translate-y-0");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* =====================================================
       8. AUTOMATIC FOOTER YEAR
    ===================================================== */
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }


    /* =====================================================
       9. CONVERSION TRACKING & LOGGING
    ===================================================== */
    const bookingLinks = document.querySelectorAll('a[href*="wa.me/"], a[href^="tel:"]');
    bookingLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const label = link.textContent.trim() || link.getAttribute("aria-label") || "Booking Action";
            console.info("⚡ [Bouncer Sports CTA]:", label);
        });
    });


    /* =====================================================
       10. IMAGE FALLBACK HANDLER
    ===================================================== */
    const allImages = document.querySelectorAll("img");
    allImages.forEach((img) => {
        img.addEventListener("error", () => {
            if (img.dataset.fallbackApplied === "true") return;
            img.dataset.fallbackApplied = "true";
            img.style.objectFit = "contain";
            img.style.padding = "24px";
            img.style.backgroundColor = "#121814";
            img.alt = "Bouncer Indoor Sports Facility Image";
        });
    });

    console.info("🚀 Bouncer Indoor Sports website initialized with Tailwind CSS v3, Framer Motion, and AOS.");
});
