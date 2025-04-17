
(function ($) {
  "use strict";
  // header sticky js
  if ($(".section-header")) {
    $(".section-header").clone().insertAfter(".section-header").addClass("header-cloned");
  }

  var previousScroll = 0;
  function headerStickyFun() {
    const scroll = window.scrollY || document.documentElement.scrollTop;
    const header = $(".section-header");
    const headerTopBar = $(".navbar-voltura");
    const navBar = $(".navbar-category-menu");

    const topBarHeight = headerTopBar.height();
    const navBarHeight = navBar.height();
    const totalHeaderHeight = header.height();


    if (header) {
      if (scroll > 200) {
        if (scroll > previousScroll) {
          $(header).removeClass("is-sticky");
          $('.sticky-element').css({ "top": 30+"px"});
        } else {
          $(header).addClass("is-sticky");
          $('.sticky-element').css({ "top": `calc(${totalHeaderHeight}px + 50px)`});
        }
      } else {
        $(".section-header").removeClass("is-sticky");
        $('.sticky-element').css({ "top": 30+"px"});
      }

      function setMultipleCSSVariables(variables) {
        let root = $(':root');
        for (const [key, value] of Object.entries(variables)) {
            root.css(key, value);
        }
      }

      setMultipleCSSVariables({
        '--topbar-height': topBarHeight + 'px',
        '--voltura-header-height': navBarHeight + 'px',
        '--total-header-height': totalHeaderHeight + 'px'
      });
    }
    previousScroll = scroll;
  }
  headerStickyFun();

  // category select js custom select js
  function categorySelect() {
    const customSelectBtn = $('.custom-select-btn');
    const customSelectItemWap = $('.custom-select-wrap');
    const customSelectText = $('.custom-select-wrap li');

    function closeAllDropdowns(exceptThis = null) {
      $('.custom-select-container').each(function() {
        const container = $(this);
        if (!exceptThis || container[0] !== exceptThis[0]) {
          container.removeClass('show');
          container.find(customSelectItemWap).slideUp(300);
        }
      });
    }

    customSelectBtn.each(function(index, elem) {
      $(elem).on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const selfThis = $(this);
        const parentCustomSelect = selfThis.parents('.custom-select-container');
        closeAllDropdowns(parentCustomSelect);
        if (!parentCustomSelect.hasClass('show')) {
          parentCustomSelect.addClass('show');
          parentCustomSelect.find(customSelectItemWap).slideDown(300);
        } else {
          parentCustomSelect.removeClass('show');
          parentCustomSelect.find(customSelectItemWap).slideUp(300);
        }
      });
    });

    customSelectText.each(function(index, elem) {
      $(elem).on('click', function(e) {
        e.preventDefault();
        const selfThis = $(this);
        const parentCustomSelect = selfThis.parents('.custom-select-container');
        parentCustomSelect.removeClass('show');
        parentCustomSelect.find('.custom-select-wrap').slideUp(300);
        parentCustomSelect.find(customSelectBtn).text(selfThis.text());        
        parentCustomSelect.find('.custom-select-wrap li').removeClass('selected-item');
        if (selfThis.text() == parentCustomSelect.find(customSelectBtn).text()) {
          selfThis.addClass('selected-item');
        }
      });
    });

    $(document).on('click', function(e) {
      if (!$(e.target).closest('.custom-select-container').length) {
        closeAllDropdowns();
      }
    });
  }
  categorySelect();

  // Video popup js
  if ($('.video-popup-link').length > 0) {
    $('.video-popup-link').magnificPopup({
      disableOn: 200,
      type: 'iframe',
      mainClass: 'mfp-fade',
      removalDelay: 160,
      preloader: false,
      fixedContentPos: false
    });
  }
  // =======Magnific-PopUp========>>>>>  
  if ($('.image-link').length > 0) {
    $('.image-link').magnificPopup({
      type: 'image',
      gallery: {
        enabled: true
      },
      zoom: {
        enabled: true,
        duration: 300,
        opener: function (element) {
          return element.find('img');
        }
      }
    });
  }

  // quantity add remove js
  $(".quantity-plus").on("click", function () {
    if ($(this).prev().val() < 9999) {
      $(this).prev().val(+$(this).prev().val() + 1);
    }
  });
  $(".quantity-minus").on("click", function () {
    if ($(this).next().val() > 1) {
      if ($(this).next().val() > 1) {
        $(this).next().val(+$(this).next().val() - 1);
      }
    }
  });

  // start tab js
  $(".tab-item").each(function(index, item){    
    $(item).on("click", function(e){
      e.preventDefault;
      let tHis = $(this);
      let parent = $('.tabs-parent');
      $(tHis).siblings().removeClass("active");
      $(tHis).addClass("active");

      let currentTab = $(tHis).attr("data-id");
      let dataHref = $(tHis).attr("data-href");
      let currentTabText = $(tHis).text();
      
      $(".tab-content").removeClass("show-content");
      $(currentTab).addClass("show-content");
      $(".current-tab-text").text(currentTabText);
      $(".current-tab-link").attr("href", dataHref);

      let itemsTab = $(parent).children('.tab-item').toArray();
      let clickedIndex = itemsTab.indexOf($(tHis)[0]);
      $(itemsTab).each(function (index, item) {
        if (index < clickedIndex) {
          $(item).css('transform', 'translateX(100%)');
        } else if (index === clickedIndex) {
          $(item).css('transform', 'translateX(-100%)');
        }
    });

    setTimeout(() => {
      $(tHis).prependTo($(parent));
      $(itemsTab).css('transform', 'translateX(0)');
    }, 400);

      return false;
    })
  })

  // Leaflet map js
  if ($('#map').length > 0) {
    var map = L.map('map').setView([37.774929, -122.419418], 12);
    var locationsArray = [];
    function clickZoom(e) {
      map.setView(e.target.getLatLng(), 16);
    }

    $.each(volturaLocations, function (index, location) {
      // Create Marker
      var marker = L.marker(location.markerPoint, {
        title: location.title,
        className: "marker-usa"
      }).addTo(map);

      // Bind Popup
      marker.bindPopup(`<div class="card card-map voltura-map-card"><div class="card-body">
      <h5 class="text-black mb-1">${location.title}</h5>
      <p class="mb-0 text-black fw-semibold">${location.subtitle}</p>
      <p class="mb-0 text-black contact-home">${location.address}</p>                          
      </div></div>`).on('click', clickZoom);

      // Store the location in the array
      locationsArray.push({ marker: marker, location: location });
    });

    // Handle external link clicks
    $('.btn-map-direction').on('click', function (e) {
      e.preventDefault();
      var markerTitle = $(this).data('title');

      // Find the marker in the array based on the title
      var selectedMarker = locationsArray.find(function (item) {
        return item.location.title === markerTitle;
      });

      // Open the popup for the selected marker
      if (selectedMarker) {
        selectedMarker.marker.openPopup();
        map.setView(selectedMarker.marker.getLatLng(), 12);
      }
    });

    L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 26,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Outside click event
    $(document).on('click', function (e) {
      var mapContainer = $('#map');
      var isClickInsideMap = mapContainer.has(e.target).length > 0 || mapContainer.is(e.target);
    });
  }

  // ajax form js
  $(document).on('submit', '#contactForm, #callRequestForm, #downloadForm', function (e) {
    e.preventDefault();
    var form = $(this);
    var formData = form.serialize();
    var responseDiv = form.find('.response');
    form.find('[type="submit"]').prop('disabled', true);
    formData += '&id=' + form.attr('id');

    responseDiv.html('<p class="mb-0 text-warning">Working....</p>');

    $.ajax({
      type: 'POST',
      url: 'mail.php',
      data: formData,
      success: function (response) {
        var data = JSON.parse(response);
        if (data.error) {
          responseDiv.empty().html('<div class="alert alert-error">' + data.msg + '</div>');
          // You can add additional actions for success here
        } else {
          responseDiv.empty().html('<div class="alert alert-sucess">' + data.msg + '</div>');
          form.get(0).reset();
        }
        form.find('[type="submit"]').prop('disabled', false);
      },
      error: function (error) {
        console.log('Error:', error);
        form.find('[type="submit"]').prop('disabled', false);
      }
    });
  });

  // footer language js
  let selectLang = $('.select-lang');
  let selectLangOthers = $('.select-others-lang');
  if (selectLang) {
    $(selectLang).each(function (index, item) {
      $(item).on("click", function (e) {
        e.preventDefault
        if (!$(item).hasClass('show')) {
          $(selectLangOthers).slideDown(300);
          $(item).addClass('show');
        } else {
          $(selectLangOthers).slideUp(300);
          $(item).removeClass('show');
        }
      })
    })
    $('.select-others-lang li').each(function (index, item) {
      $(item).on("click", function (e) {
        e.preventDefault
        let langText = item.innerText;
        selectLang.text(langText);
        if ($('.select-lang').hasClass('show')) {
          $(selectLangOthers).slideUp(300);
          $('.select-lang').removeClass('show');
        }
      })
    })
  }

  // backToTopScroll js
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  if($("#back-to-top") && canvas){
    var options = {
      size: 44,
      lineWidth: 22,
      rotate: -5,
      colorCircleBackground: "#65717E",
      colorCircle: "#1279F2"
    };
    $("#back-to-top").append(canvas);
    canvas.width = canvas.height = options.size;
    ctx.translate(options.size / 2, options.size / 2);
    ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI);
    $("#back-to-top").css({
      '--back-top-size': `${options.size}px`
    })
    $("#back-to-top").on("click", function () {
      $("html, body").animate({ scrollTop: 0 }, 600);
    });
  }
  function refreshCanvas() {
    var top = $(window).scrollTop();
    var docH = $(document).height();
    var winH = $(window).height();
    // scroll percentage
    var percent = (top / (docH - winH)) * 100;
    if (percent >= 4) {
      $("#back-to-top").addClass("show-back-top");
    } else {
      $("#back-to-top").removeClass("show-back-top");
    }
    var drawCircle = function (color, colorBackground, lineWidth, percent) {
      // clear canvas
      ctx.clearRect(
        -options.size / 2,
        -options.size / 2,
        options.size,
        options.size
      );
      // options
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "butt";
      // background circle
      ctx.beginPath();
      ctx.arc(0,0,(options.size - options.lineWidth) / 2,0,Math.PI * 2 * 1,false);
      ctx.strokeStyle = colorBackground;
      ctx.stroke();
      ctx.closePath();
      // variable circle
      ctx.beginPath();
      ctx.arc(0,0,(options.size - options.lineWidth) / 2,0,Math.PI * 2 * percent,false);
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.closePath();
    };

    drawCircle(
      options.colorCircle,
      options.colorCircleBackground,
      options.lineWidth,
      percent / 100
    );
  }
  refreshCanvas();

  // content with slider same height js
  function sameHeightFunction(){
    let productDetailsContents = $('.product-details-contents');
    let productDetailsContentsHeight = productDetailsContents.height();
    let thumbSliderWrap = document.querySelectorAll('.thumbs-slider-wrap');
    if($(window).innerWidth() >= 1200) {
      if (productDetailsContentsHeight < 950 ) {
        $('.single-product-slider-wrap').css({"height": "auto"});
      }else {
        $('.single-product-slider-wrap').css({"height": productDetailsContentsHeight+"px"});
      }
      if (thumbSliderWrap) {
        thumbSliderWrap.forEach(function (item, index) {
          let heightDivided = productDetailsContentsHeight / 4;
          item.style.setProperty('--dividedHeight', heightDivided + 'px');
        });
      }
    }else {
      $('.single-product-slider-wrap').css({"height": "auto"});
    }
  }
  sameHeightFunction();

  // grid Column js
  function gridColumnFunction(){
    const gridSelectButton = $('.grid-select-button');
    const productContainer = $('.product-container-default');
  
    function removeExistingGridClasses() {
      productContainer.removeClass(function (index, className) {
        return (className.match(/grid-\S+/g) || []).join(' ');
      });
    }
  
    const savedClassName = localStorage.getItem('selectedGridClass');
    if (savedClassName) {
      removeExistingGridClasses();
      productContainer.addClass(savedClassName);
    }
  
    const savedActiveButton = localStorage.getItem('activeButton');
    if (savedActiveButton) {
      $(`.grid-select-button[data-value="${savedActiveButton}"]`).addClass('active');
    }
  
    if (gridSelectButton.length) {
      gridSelectButton.each(function () {
        let element = $(this);
        let elementData = element.data('value');
        element.on("click", function (e) {
          e.preventDefault();
          gridSelectButton.removeClass('active');
          $(this).addClass('active');
          removeExistingGridClasses();
          productContainer.addClass(elementData);
          localStorage.setItem('selectedGridClass', elementData);
          localStorage.setItem('activeButton', elementData);
        });
      });
    }
  }
  if(window.innerWidth >= 1200) {
  gridColumnFunction();
  }

  // mega menu hover height set js
  function megaMenuHeightMatch(){
    let megaTitleItem = $('.mega-title-item');
    let megaMenuNav = $('.mega-menu-nav');
    if(megaTitleItem){
      function megaColInnerHeight(){
        let megaColWrap = $('.mega-col-wrap');
        let megaColWrapHeight = megaColWrap.height() + 60;
        megaMenuNav.css({"height": megaColWrapHeight+"px"})
        console.log(megaColWrapHeight)
      }
      $('.mega-menu-dropdown-item').each(function(index, elem){
        $(elem).mouseenter(function(){
          megaColInnerHeight()
        })

      })
    }
    
  }
  megaMenuHeightMatch();

  // product filter accordion js 
  /*let filterFormCheckItem = $('.filter-form-check-item');
  $(filterFormCheckItem).each(function(index, elem){
    let CheckItemSub = $(elem).find($('.filter-form-check-item-sub'));
    if($(CheckItemSub).hasClass('check-sub-filter')){
      $(CheckItemSub).show()
    };
    let filterIcon = $(elem).find($('.filter-icon'));
    if(filterIcon){
      $(filterIcon).on("click", function(){
        if(!$(CheckItemSub).hasClass('check-sub-filter')){
          $(CheckItemSub).addClass("check-sub-filter");
          $(this).addClass("filter-min-icon");
          $(CheckItemSub).slideDown(300);
        }else{
          $(CheckItemSub).removeClass("check-sub-filter");
          $(this).removeClass("filter-min-icon");
          $(CheckItemSub).slideUp(300);
        }
      })
    }
  });*/

  // let formCheckLabel = $('.form-check-label');
  // if(formCheckLabel){
  //   $(formCheckLabel).each(function(index, element){
  //     $(element).on("click", function(e){
  //       e.stopPropagation();
  //       let inputCheckbox = $(element).parents('.filter-form-check').find('.form-check-input');
  //       if(!$(inputCheckbox).prop('checked') == true){
  //         console.log('ais')
  //         $(inputCheckbox).attr('checked', "true");
  //       }else {
  //         $(inputCheckbox).removeAttr('checked', "true");
  //       }
  //     });
  //   });
  // }

  // see more brand js
  let filterSeeMore = $('.see-more-btn');
  let brandShowItem = $('.filter-brand .filter-form-check-item').slice(0, 8).show();
  if(filterSeeMore){
    $(filterSeeMore).on("click", function(){
      let brandAfterShow = $('.filter-brand .filter-form-check-item').slideDown(300);
    })
  }

  // filter ranger slider js
  const range = document.querySelectorAll(".filter-range-wrapper input");
  const progress = document.querySelector(".filter-progress");
  let gap = 0.1;
  const inputValue = document.querySelectorAll(".number-val input");

  range.forEach((input) => {
    input.addEventListener("input", (e) => {
      let minRange = parseInt(range[0].value);
      let maxRange = parseInt(range[1].value);

      if (maxRange - minRange < gap) {
        if (e.target.className === "range-min") {
          range[0].value = maxRange - gap;
        } else {
          range[1].value = minRange + gap;
        }
      } else {
        progress.style.left = (minRange / range[0].max) * 100 + "%";
        progress.style.right = 100 - (maxRange / range[1].max) * 100 + "%";
        inputValue[0].value = minRange;
        inputValue[1].value = maxRange;
      }
    });
  });

  // mouse hover image zoom js
  let imgZoomWrapper = $(".img-zoom-wrap");
  if(imgZoomWrapper){
    $(imgZoomWrapper).each(function(index, elem){
      $(elem).on("mouseover", function(){
        $(this).find('.zoom-img').css({
          transform: "scale(" + $(this).attr("data-scale") + ")"
        });
      }).on("mouseout", function () {
        $(this).find('.zoom-img').css({
          transform: "scale(1)"
        });
      }).on("mousemove", function (e) {
        $(this).find('.zoom-img').css({
          "transform-origin":((e.pageX - $(this).offset().left) / $(this).width()) * 100 + "% " + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 +"%"
        });
      });
    });
  }

  // select start rating js
  let reviewSolidIcon = $('.review-icons-solid .star-icon');
  if(reviewSolidIcon){
    $(reviewSolidIcon).each(function(index, elem){
      $(elem).on("click", function(){
        let startValue = parseInt($(elem).data('value'));
        let starRegular = $(elem).parents('.review-icons-solid').children('.star-icon');
        for (let i = 0; i < starRegular.length; i++) {
          $(starRegular[i]).removeClass('select-rating');
        }
        for (let i = 0; i < startValue; i++) {
          $(starRegular[i]).addClass('select-rating');
        }
      })
    })
  }




  // quick view popup js under process
  let viewProductWrap = $('.view-product-container');
  let viewClose = $('.view-product-close');
  let eyeIconView = $('.quick-view-item');
  if(eyeIconView){
    $(eyeIconView).each(function(index, item){
      let viewProductContent = $('.view-product-content');
      $(item).on("click", function(e){
        e.preventDefault;
        let selfThis = $(this);
        let itemImage = $(selfThis).closest('.card-wrap').find('img');
        let clonedImage = itemImage.clone();
        
        viewProductContent.empty().append(clonedImage);
        $(viewProductWrap).fadeIn(500);
        // console.log($(this).closest('.card-wrap').find('img'))
      })
    });

    $(document).on("keyup", function(e) {
      e.preventDefault;
      const KEYCODE_ESC = 27;
      if (e.keyCode == KEYCODE_ESC){
        $(viewProductWrap).fadeOut(500);
      }
    });
    $(viewClose).on("click", function(e){
      e.preventDefault;
      $(viewProductWrap).fadeOut(500);
    });
  }






  $(window).on("scroll", function () {
    headerStickyFun();
    refreshCanvas();
  })
  $(window).on("resize", function () {
    sameHeightFunction();
    if(window.innerWidth >= 1200) {
      gridColumnFunction();
      }
  })
})(jQuery);

document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  if (window.innerWidth > 992) {
    document.querySelectorAll(".nav-item.dropdown").forEach(function (everyElement) {
        everyElement.addEventListener("mouseover", function (e) {
          let el_link = this.querySelector("a[data-bs-toggle]");
          if (el_link !== null) {
            let nextEl = el_link.nextElementSibling;
            el_link.classList.add("show");
            if (nextEl !== null && this.contains(nextEl)) {
              nextEl.classList.add("show");
            }
          }
        }.bind(everyElement)); // Explicitly bind the context to the current element

        everyElement.addEventListener("mouseleave", function (e) {
          let el_link = this.querySelector("a[data-bs-toggle]");
          if (el_link !== null) {
            let nextEl = el_link.nextElementSibling;
            if (nextEl !== null && this.contains(nextEl)) {
              el_link.classList.remove("show");
              nextEl.classList.remove("show");
            }
          }
        }.bind(everyElement)); // Explicitly bind the context to the current element
    });
  }

  // =============  Dynamic Year =====
  if ($('.dynamic-year').length > 0) {
    const yearElement = document.querySelector('.dynamic-year');
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = currentYear;
  }

  // Create an SVG element
  const elements = document.querySelectorAll(`[data-text="stroke"]`);
  elements.forEach((element) => {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "w-100 h-100 animation-stroke");
    svg.setAttribute("stroke-width", element.hasAttribute('data-stroke') ? element.getAttribute('data-stroke') : "1");
    svg.setAttribute("xmlns", svgNS);

    // Create a text element inside the SVG
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", "0");
    text.setAttribute("y", "64%");

    // Get the text content from the element's data-text attribute
    const textContent = element.innerText;
    element.innerText = "";

    text.textContent = textContent;
    svg.appendChild(text);
    element.appendChild(svg);
    const textBBox = text.getBBox();
    svg.setAttribute("height", textBBox.height);
    element.style.setProperty('--text-height', textBBox.height + 'px');
    element.querySelector('svg') ? element.style.setProperty('opacity', '1') : null;
  });

  // stroke line animation js
  const options = {
    rootMargin: '0px',
    threshold: 1
  };
  const animationIcon = new IntersectionObserver((elements) => {
    elements.forEach((elementItem) => {
      if (elementItem.isIntersecting) {
        elementItem.target.classList.add("animation-stroke");
      }
    });
  }, options);

  const observerElements = document.querySelectorAll(".animation-icon");
  observerElements.forEach(function (element) {
    animationIcon.observe(element);
  });

  // sticky product js
  const actionsWrap = document.querySelector('.actions-wrap');
  const stickyProductWrap = document.querySelector('.sticky-product-wrap');
  const footerCopyRight = document.querySelector('.footer-copyright');
  if (actionsWrap && stickyProductWrap && footerCopyRight) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target === actionsWrap) {
          if (entry.isIntersecting) {
            stickyProductWrap.classList.remove('sticky-product');
          } else {
            stickyProductWrap.classList.add('sticky-product');
          }
        } else if (entry.target === footerCopyRight) {
          if (entry.isIntersecting) {
            stickyProductWrap.classList.remove('sticky-product');
          } else {
            stickyProductWrap.classList.add('sticky-product');
          }
        }
      });
    });
    observer.observe(actionsWrap);
    observer.observe(footerCopyRight);
  }

  // watch feature click js
  const watchFeatureSections = document.querySelectorAll('.click-others');
  if (watchFeatureSections) {
    watchFeatureSections.forEach((section) => {
      const watchFeatureCircles = section.querySelectorAll('.watch-feature-circle');
      const cardWatchWraps = section.querySelectorAll('.circle-hover-show');

      watchFeatureCircles.forEach((circle, index) => {
        circle.addEventListener('click', () => {
          if (circle.classList.contains('active')) {
            circle.classList.remove('active');
            cardWatchWraps[index].classList.remove('product-watch-show');
          } else {
            watchFeatureCircles.forEach(c => c.classList.remove('active'));
            cardWatchWraps.forEach(wrap => wrap.classList.remove('product-watch-show'));

            circle.classList.add('active');
            cardWatchWraps[index].classList.add('product-watch-show');
          }
        });
      });
    });
  }

    // full-width slider js
    function fullWidthSliderFun() {
      let fullWidthSlider = document.querySelectorAll('.full-width-slider');
      if (fullWidthSlider) {
        fullWidthSlider.forEach(function (element, index) {
          let OffsetBeforeWidth = document.querySelector('.container').clientWidth;
          let fullWidthSliderWidth = element.clientWidth;
          let winWidth = (fullWidthSliderWidth - OffsetBeforeWidth) / 2;
          element.style.setProperty('--offsetBeforeSpace', winWidth + 'px');
          let fullSliderWrapper = element.querySelector('.swiper-wrapper');
          let transform3DStyle = fullSliderWrapper.style.transform;

          if (transform3DStyle.includes('translate3d(0px, 0px, 0px)')) {
            element.classList.add('offset-before');
          } else {
            element.classList.remove('offset-before');
          }
        });
      }
    }
    fullWidthSliderFun();

  // swiper slider js
  function swiperSlider() {
    const swiperItems = document.querySelectorAll(".voltura-swiper-slider");
    swiperItems.forEach(function (swiperElm) {
      if (swiperElm && !swiperElm.dataset.swiperInitialized) {
        const swiperOptions = JSON.parse(swiperElm.dataset.swiperOptions || "{}");
        swiperOptions.on = {
          slideChange: function () {
            fullWidthSliderFun();
            console.log("Swiper changed");
          },
        };
        let SwiperSlider = new Swiper(swiperElm, swiperOptions);
        swiperElm.dataset.swiperInitialized = true;
      }
    });
  }
  swiperSlider();

  const singleThumbsSlider = new Swiper(".thumbs-slider", {
    loop: true,
    spaceBetween: 30,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
    grabCursor: true,
    direction: "vertical",
    breakpoints: {
      0: {
        spaceBetween: 15,
        slidesPerView: 2,
        direction: "horizontal"
      },
      567: {
        spaceBetween: 20,
        slidesPerView: 3,
        direction: "horizontal"
      },
      767: {
        direction: "vertical"
      }
    }
  });
  const singleProductSlider = new Swiper(".single-product-slider", {
    loop: true,
    spaceBetween:0,
    grabCursor: true,
    thumbs: {
      swiper: singleThumbsSlider,
    },
  });
  singleProductSlider.on('slideChangeTransitionStart', function() {
    singleThumbsSlider.slideTo(singleProductSlider.activeIndex);
  });
  
  singleThumbsSlider.on('transitionStart', function(){
    singleProductSlider.slideTo(singleThumbsSlider.activeIndex);
  });

  // choose size border color js
  let borderActiveColorSize = document.querySelectorAll('.choose-size');
  if (borderActiveColorSize) {
    borderActiveColorSize.forEach(function (element, index) {
      element.addEventListener("click", function () {
        borderActiveColorSize.forEach(function (siblings) {
          siblings.classList.remove('border-primary');
        });
        this.classList.add('border-primary');
      });
    });
  }

  // choose color border color js
  let borderActiveColor = document.querySelectorAll('.border-active-color');
  if (borderActiveColor) {
    borderActiveColor.forEach(function (element, index) {
      element.addEventListener("click", function () {
        borderActiveColor.forEach(function (siblings) {
          siblings.classList.remove('border-primary');
          siblings.closest('.choose-color').querySelector('.select-color-text').classList.remove('fw-bold');
        });
        this.classList.add('border-primary');
        this.closest('.choose-color').querySelector('.select-color-text').classList.add('fw-bold');
      });
    });
  }

  // audio search js
  function audioSearchFunction(){
    const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      console.log('You said: ', transcript);
      performSearch(transcript);
    };
    recognition.onerror = function(event) {
      console.error('Speech recognition error: ', event.error);
    };
    recognition.onend = function() {
      console.log('Speech recognition ended.');
    };
    if(document.getElementById('voice-search-button')){
      document.getElementById('voice-search-button').addEventListener('click', function() {
        recognition.start();
      });
    }
    function performSearch(query) {
      console.log('Searching for: ', query);
      window.location.href = `${encodeURIComponent(query)}`;
    }
  }
  audioSearchFunction ();

  // wishlist remove js
  let wishlist = document.querySelectorAll('.btn-wishlist');
  if(wishlist){
    wishlist.forEach(function(element){
      element.addEventListener('click', function(){
        element.closest('.wishlist-col').remove();
      })
    })
  }

  // video mute and unmute js
  let video = document.querySelector(".video-size");
  const btnMute = document.querySelector(".btn-mute");
  const btnPlay = document.querySelector(".btn-play");
  const statusMute = () => {
    if(btnMute){
      if (video.muted) {
        btnMute.classList.remove("active");
      } else {
        btnMute.classList.add("active");
      }
    }
  };
  const statusPlay = () => {
    if(btnPlay){
      if (video.paused) {
        btnPlay.classList.add("active");
      } else {
        btnPlay.classList.remove("active");
      }
    }
  };
  if(btnMute){
    btnMute.onclick = () => {
      video.muted = !video.muted;
      statusMute();
    };
  }
  if(btnPlay){
    btnPlay.onclick = () => {
      video.paused ? video.play() : video.pause();
      statusPlay();
    };
  }
  statusMute();
  statusPlay();  
  $('.video-size').on("click", function(){
    if(!$(this).hasClass("pause")){
      $(this).trigger("pause");
      $(this).addClass("pause");
    }else {
      $(this).trigger("play");
      $(this).removeClass("pause");
    }
  });

  // file drag js
  let uploadFile = document.querySelectorAll(".upload-file");
  for (var i = 0, len = uploadFile.length; i < len; i++) {
    customInput(uploadFile[i]);
  }
  function customInput(el) {
    const fileInput = el.querySelector('[type="file"]');
    if(fileInput){
      const filePlace = el.querySelector('.file-place-here');
      fileInput.onchange = fileInput.onmouseout = function () {
        if (!fileInput.value) return;
        let showFileName = fileInput.value.replace(/^.*[\\\/]/, "");
        filePlace.innerText = showFileName;
      };
    }
  }

  window.addEventListener('scroll', function (event) {}, true);
  window.addEventListener('resize', function (event) {
    swiperSlider();
    fullWidthSliderFun();
  }, true);
})