
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
          // Scrolling down
          $(header).removeClass("is-sticky");
        } else {
          $(header).addClass("is-sticky");
        }
      } else {
        $(".section-header").removeClass("is-sticky");
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

  // category select js
  function categorySelect() {
    let allCategories = $('.all-categories');
    let categoryItems = $('.category-items');
    if (allCategories) {
      $(allCategories).each(function (index, item) {
        $(item).on("click", function (e) {
          e.preventDefault
          if (!$(item).hasClass('show')) {
            $(categoryItems).slideDown(300);
            $(item).addClass('show');
          } else {
            $(categoryItems).slideUp(300);
            $(item).removeClass('show');
          }
        })
      })
      $('.category-items li').each(function (index, item) {
        $(item).on("click", function (e) {
          e.preventDefault
          let categoryText = item.innerText;
          allCategories.text(categoryText);
          if ($('.all-categories').hasClass('show')) {
            $(categoryItems).slideUp(300);
            $('.all-categories').removeClass('show');
          }
        })
      })

      $(document).on("click", function (e) {
        if (!$(e.target).closest(categoryItems).length && !$(e.target).closest(allCategories).length) {
          $(categoryItems).slideUp(300);
          $(allCategories).removeClass('show');
        }
      });
    }
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
  if($("#back-to-top").length){
    var options = {
      size: 44,
      lineWidth: 22,
      rotate: -5,
      colorCircleBackground: "#65717E",
      colorCircle: "#1279F2"
    };
    var canvas = document.createElement("canvas");
    $("#back-to-top").append(canvas);
    var ctx = canvas.getContext("2d");
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
      ctx.arc(
        0,
        0,
        (options.size - options.lineWidth) / 2,
        0,
        Math.PI * 2 * 1,
        false
      );
      ctx.strokeStyle = colorBackground;
      ctx.stroke();
      ctx.closePath();
      // variable circle
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        (options.size - options.lineWidth) / 2,
        0,
        Math.PI * 2 * percent,
        false
      );
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

  $(window).on("scroll", function () {
    headerStickyFun();
    refreshCanvas();
  })
  $(window).on("resize", function () { })
})(jQuery);

document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  if (window.innerWidth > 992) {
    document.querySelectorAll(".nav-item.dropdown").forEach(function (everyitem) {
        everyitem.addEventListener(
            "mouseover",
            function (e) {
                let el_link = this.querySelector("a[data-bs-toggle]");
                if (el_link !== null) {
                    let nextEl = el_link.nextElementSibling;
                    el_link.classList.add("show");
                    if (nextEl !== null && this.contains(nextEl)) {
                        nextEl.classList.add("show");
                    }
                }
            }.bind(everyitem)
        ); // Explicitly bind the context to the current element
        everyitem.addEventListener(
            "mouseleave",
            function (e) {
                let el_link = this.querySelector("a[data-bs-toggle]");
                if (el_link !== null) {
                    let nextEl = el_link.nextElementSibling;
                    if (nextEl !== null && this.contains(nextEl)) {
                        el_link.classList.remove("show");
                        nextEl.classList.remove("show");
                    }
                }
            }.bind(everyitem)
        ); // Explicitly bind the context to the current element
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
      } else {
        elementItem.target.classList.remove("animation-stroke");
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

  // swiper slider js
  function swiperSlider() {
    const swiperItems = document.querySelectorAll(".voltura-swiper-slider");
    swiperItems.forEach(function (swiperElm) {
      if (!swiperElm.dataset.swiperInitialized) {
        const swiperOptions = JSON.parse(swiperElm.dataset.swiperOptions);
        // Add additional callbacks here
        swiperOptions.on = {
          slideChange: function () {
            // updateClasses(this);
          }
        };
        let SwiperSlider = new Swiper(swiperElm, swiperOptions);
        swiperElm.dataset.swiperInitialized = true;
      }
    });
  }
  swiperSlider();

  // full-width slider js
  function fullWidthSliderFun() {
    let fullWidthSlider = document.querySelectorAll('.full-width-slider');
    if (fullWidthSlider) {
      fullWidthSlider.forEach(function (item, index) {
        let fullWidthSliderWidth = item.clientWidth;
        let winWidth = (window.innerWidth - fullWidthSliderWidth) / 2;
        item.style.setProperty('--margin-right', winWidth + 'px');
      });
    }
  }
  fullWidthSliderFun();

  // choose size border color js
  let borderActiveColorSize = document.querySelectorAll('.choose-size');
  if (borderActiveColorSize) {
    borderActiveColorSize.forEach(function (element, index) {
      element.addEventListener("click", function () {
        borderActiveColorSize.forEach(function (siblings) {
          siblings.classList.remove('border-primary');
        });
        this.classList.add('border-primary');
      })
    })
  }

  // choose color border color js
  let borderActiveColor = document.querySelectorAll('.border-active-color');
  if (borderActiveColor) {
    borderActiveColor.forEach(function (element, index) {
      element.addEventListener("click", function () {
        borderActiveColor.forEach(function (siblings) {
          siblings.classList.remove('border-primary');
        });
        this.classList.add('border-primary');
      })
    })
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

  window.addEventListener('scroll', function (event) {}, true);
  window.addEventListener('resize', function (event) {
    fullWidthSliderFun();
    swiperSlider();
  }, true);
})