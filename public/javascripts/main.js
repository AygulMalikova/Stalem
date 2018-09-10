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





// $('.carousel').carousel()