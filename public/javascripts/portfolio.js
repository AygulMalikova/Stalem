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

        var id = $(this).find('.carousel-item.active > img').data('id');
        $('.comments').fadeOut().css('display', 'none');

        const current = $(`.comments[data-id="${id}"]`);
        current.show().fadeTo(1);

        $(this).find('.carousel-item.active').css('padding-bottom', current.height());

        // Получаешь id текущего
        // Получаешь нужную форму и комментарии
        // Показываешь только ту форму и комментарии, которые тебе нужны

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