const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const link = document.querySelectorAll('.link');
const body = document.body;

hamburger.addEventListener('click', function () {

    body.classList.toggle('open');
    if (body.classList.contains('open')) {
        fadeIn(navMenu, "flex");
    } else {
        fadeOut(navMenu);
    }
});

for (let i = 0; i < link.length; i++) {
    link[i].addEventListener('click', function () {
        body.classList.remove('open');
    })
}
$(document).ready(() => {
    const hash = window.location.hash.substring(1);
    const path = window.location.pathname;
    const str = 'show active';
    if (path.indexOf('portfolio') > -1) {
        $(`[href="#${hash}"]`).addClass('active');
        $(`#${hash}`).addClass('show active');
        carousel();
    }
});

$(`.nav-link`).click((e)=> {
    window.location.hash = $(e.target).attr('href');
    const hash = window.location.hash.substring(1);

    $(`.tab-pane`).removeClass('active');
    $(`a.active`).removeClass('active');
    $(`[href="#${hash}"]`).addClass('active');
    $(`#${hash}`).addClass('active');
       carousel();

});

function carousel() {

// Activate Carousel

    $('section.awSlider .carousel').carousel({
        interval: false
    }).on('slid.bs.carousel', function () {
        var bscn = $(this).find('.carousel-item.active > img').attr('src');
        $('section.awSlider > img').attr('src', bscn);
        centrateBlurredBGs();
    });

    $(".carousel-item").removeClass("active");
    $(".carousel-item:first-child").addClass("active");
    $('.awSlider > img').remove();
    $('section.awSlider').each((i, slider) => {
        if ($(slider).find('.blurred-bg').length === 0) {
            var startImage = $('.tab-pane.active .carousel-item.active > img').attr('src');
            $(slider).append('<img class="blurred-bg" src="' + startImage + '">');
            centrateBlurredBGs();
        }
    })
}
function centrateBlurredBGs() {
    $('.blurred-bg').each((i, el) => {
        el = $(el);
        const elW = el.width();
        const containerW = $('.tab-pane.active .carousel-item.active img').width();
        el.css({
            width: containerW,
            left: -(elW > containerW ? containerW : el.width()) / 2
        })
    })
}

$(document).resize(() => centrateBlurredBGs());

function fadeOut(el){
    el.style.opacity = 1;

    (function fade() {
        if ((el.style.opacity -= .05) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
}

// fade in

function fadeIn(el, display){
    el.style.opacity = 0;
    el.style.display = display || "block";

    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .05) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
}



