document.addEventListener("DOMContentLoaded", function () {
    if (document.readyState === 'complete') {
        loadAllImages();
    } else {
        document.addEventListener('readystatechange', function() {
            if (document.readyState === 'complete') {
                loadAllImages();
            }
        });
    }
});
// loadAllImages function
function loadAllImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.addEventListener('load', function() {
            img.classList.add('lazy-image-loaded');
        });
    });
}