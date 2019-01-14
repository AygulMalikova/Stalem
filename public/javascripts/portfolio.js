
$(document).ready(() => {
    //commentBox();
    // $(".comments:first-child").addClass("active");
    const hash = window.location.hash.substring(1);
    const path = window.location.pathname;
    const str = 'show active';
    if (path.indexOf('portfolio') > -1) {
        $(`[href="#${hash}"]`).addClass('active');
        $(`#${hash}`).addClass('show active');
        // commentBox();
        carousel();
    }

     //$(`.comments`).first().show().fadeIn(1).css('display', 'block');
    $(`.tab-pane.active`).find('.comments').first().show().fadeIn(1).css('display', 'block');
    $('section.awSlider .carousel').find('.carousel-item.active').css('padding-bottom', $(`.tab-pane.active`).find('.comments').first().height());

    $('.addComment').on('click',function (e) {
        e.preventDefault();
        fetch($(this).data('action'), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: $(this).closest('.form').find("#commentText").val(),
                author: $(this).closest('.form').find("#author").val(),
            })
        }).then(response => response.json())
        .then((response) => {
            var now = new Date();
            var dateForm = now.getDate() +'/' + now.getMonth() + '/' + now.getFullYear();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            if (hour < 10) {
                hour = '0' + hour;
            }
            if (minute < 10) {
                minute = '0' + minute;
            }
            if (second < 10) {
                second = '0' + second;
            }
            var timeForm = hour + ':' + minute + ':' + second;
            $()
             $(this).closest('.comments').find('.comment-block').last().after('<hr>\n' +
                 '<div class="comment-block">\n' +
                 '<div class="ver left"> </div>\n' +
                 '<div class="container comments-text">\n' +
                 '<div class="row">\n' +
                 '<strong class="name pull-left">\n' +
                 $(this).closest('.form').find("#commentText").val() +
                 '</strong>\n' +
                 '<span class="pull-right date">\n' +
                 dateForm +
                 '</span>\n' +
                 '</div>\n' +
                 '<div class="row">\n' +
                 '<p class="text pull-left">\n' +
                 $(this).closest('.form').find("#author").val() +
                 '</p>\n' +
                 '<span class="pull-right date">\n' +
                 timeForm +
                 '</span>\n' +
                 '</div>\n' +
                 '</div>\n' +
                 '<div class="ver right"> </div>\n' +
                 '</div>\n')

            $('section.awSlider .carousel').find('.carousel-item.active').css('padding-bottom', $(`.tab-pane.active`).find('.comments').first().height());
        }).catch(
            error => console.log(error) // Handle the error response object
        );
        return false;
    });

});


$(`.nav-link`).click((e)=> {
    window.location.hash = $(e.target).attr('href');
    const hash = window.location.hash.substring(1);

    $(`.tab-pane`).removeClass('active');
    $(`a.active`).removeClass('active');
    $(`[href="#${hash}"]`).addClass('active');

    $(`#${hash}`).addClass('active');

    $(`.tab-pane.active`).find('.comments').first().show().fadeIn(1).css('display', 'block');
    $('section.awSlider .carousel').find('.carousel-item.active').css('padding-bottom', $(`.tab-pane.active`).find('.comments').first().height());

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
        current.show().fadeIn(1).css('display', 'block');

        $(this).find('.carousel-item.active').css('padding-bottom', current.height());

        centrateBlurredBGs();
    });

    $(".carousel-item").removeClass("active");
    $(".carousel-item:first-child").addClass("active");
    // $(".comments:first-child").addClass("active");


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


