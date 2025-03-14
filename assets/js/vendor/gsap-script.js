document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(ScrollTrigger);

    // Animation In Up
    const animateInUp = document.querySelectorAll(".grid-in-up");
    animateInUp.forEach((element) => {
        gsap.fromTo(
            element,
            {
                opacity: 0,
                y: 100,
                ease: "sine",
            },
            {
                y: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: element,
                    toggleActions: "play none none reverse",
                    start: "top bottom",
                    immediateRender: false
                },
            }
        );
    });

    // Animation In Up Grid 2x
    gsap.set(".grid2-in-up", { y: 100, opacity: 0 });
    ScrollTrigger.batch(".grid2-in-up", {
        interval: 0.1,
        // batchMax: 2,
        duration: 5,
        start: "top bottom",
        onEnter: (batch) =>
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                ease: "sine",
                stagger: 0.15,
                overwrite: true,
                immediateRender: false
            }),
        onLeave: (batch) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
        onEnterBack: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
        onLeaveBack: (batch) => gsap.set(batch, { opacity: 0, y: 100, overwrite: true }),
    });

    // Animation In Up Grid 3x
    gsap.set(".grid3-in-up", { y: 100, opacity: 0 });
    ScrollTrigger.batch(".grid3-in-up", {
        interval: 0.1,
        // batchMax: 3,
        duration: 5,
        start: "top bottom",
        onEnter: (batch) =>
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                ease: "sine",
                stagger: 0.15,
                overwrite: true,
                immediateRender: false
            }),
        onLeave: (batch) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
        onEnterBack: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
        onLeaveBack: (batch) => gsap.set(batch, { opacity: 0, y: 100, overwrite: true }),
    });

    // Animation In Up Grid 4x
    gsap.set(".grid4-in-up", { y: 100, opacity: 0 });
    ScrollTrigger.batch(".grid4-in-up", {
        interval: 0.1,
        // batchMax: 4,
        duration: 5,
        start: "top bottom",
        onEnter: (batch) =>
            gsap.to(batch, {
                opacity: 1,
                y: 0,
                ease: "sine",
                stagger: 0.15,
                overwrite: true,
                immediateRender: false
            }),
        onLeave: (batch) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
        onEnterBack: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
        onLeaveBack: (batch) => gsap.set(batch, { opacity: 0, y: 100, overwrite: true }),
    });

    ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".grid2-in-up", { y: 0, opacity: 1 }));
    ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".grid3-in-up", { y: 0, opacity: 1 }));
    ScrollTrigger.addEventListener("refreshInit", () => gsap.set(".grid4-in-up", { y: 0, opacity: 1 }));
})