document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    function verticalNumberFun(){
        document.querySelectorAll(".vertical-num-scroll").forEach(function (innerNumberDiv) {
            const textHeight = innerNumberDiv.offsetHeight;
            innerNumberDiv.innerText = '';
    
            const createElementDiv = document.createElement('div');
            createElementDiv.classList.add('vertical-num-wrap');
            innerNumberDiv.appendChild(createElementDiv);
    
            const dataNumValue = innerNumberDiv.getAttribute("data-num");
            const dataValueArray = dataNumValue.split('');
    
            dataValueArray.forEach(function (item) {
                const itemCreateElementDiv = document.createElement('div');
                itemCreateElementDiv.classList.add('number-item');
    
                if (item === ',' || item === '.') {
                    let createSpan = document.createElement('span');
                    createSpan.classList.add('number');
                    createSpan.innerText = item;
                    itemCreateElementDiv.appendChild(createSpan);
                    createElementDiv.appendChild(itemCreateElementDiv);
                } else {
                    for (let i = 0; i <= 19; i++) {
                        let createSpan = document.createElement('span');
                        createSpan.classList.add('number');
                        createSpan.innerText = i % 10;
    
                        if (item == i % 10) {
                            createSpan.classList.add('current');
                        }
                        itemCreateElementDiv.appendChild(createSpan);
                    }
                    observeFunction(itemCreateElementDiv);
                    createElementDiv.appendChild(itemCreateElementDiv);
                }
            });
    
            // Apply the original h4 text height to .vertical-num-wrap
            createElementDiv.style.height = textHeight + 'px';
            createElementDiv.style.overflow = 'hidden';
        });
    
        function observeFunction(itemCreateElementDiv) {
            const verticalScrollNum = document.querySelectorAll('.vertical-num-scroll');
            const options = { rootMargin: '0px', threshold: 1 };
            const observer = new IntersectionObserver(function (entries, observer) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animationFun(itemCreateElementDiv);
                    }
                });
            }, options);
            verticalScrollNum.forEach(item => { observer.observe(item); });
        }
    
        function animationFun(animation_item) {
            let height = animation_item.querySelector('span').offsetHeight;
            let currentIndex = Array.from(animation_item.querySelectorAll('.number')).findIndex((animation_span) =>
                animation_span.classList.contains('current')
            );
    
            let transformHeight = height * currentIndex + 'px';
            animation_item.style.transform = `translateY(-${transformHeight})`;
        }
    }
    verticalNumberFun();

    window.addEventListener('resize', function (event) { verticalNumberFun() })
});
