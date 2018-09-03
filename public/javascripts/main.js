const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.nav-menu');
const icon = document.querySelector('#nav-icon');
const hero = document.querySelector('.hero');

hamburger.addEventListener('click', function () {
    menu.classList.toggle('open');
    icon.classList.toggle('open');
    hero.classList.toggle('close');
    document.body.classList.toggle('menu-open');
    document.body.classList.add('menu-animation');
    setTimeout(() => {
        document.body.classList.remove('menu-animation');
    }, 700);
});