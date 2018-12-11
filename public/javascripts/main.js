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

var counter = 0;
console.log(counter);

$(".imgAdd").click(function(){
    counter++;
    $(this).closest(".row").find('.imgAdd').before(
        '<div class="col-lg-4 imgUp">\n' +
        '<div class="imagePreview">\n' +
        '<img src="/public/images/pic.svg" alt="">\n' +
        '</div>\n' +
        '<label class="btn btn-primary">\n' +
        'Upload<input type="file" name = "file" accept="image/*" class="uploadFile img" value="Upload Photo"\n' +
        'style="width:0px;height:0px;overflow:hidden;"></label><i class="fa fa-times del"></i>' +
        '</label>\n' +
        '<div class="group file">\n' +
        '<input class="file" type="text" name="picname">\n' +
        '<span class="highlight file"></span>\n' +
        '<span class="bar file"></span>\n' +
        '<label class="file">Name</label>\n' +
        '<input class="cover" type="radio" name = "cover" value="' + counter + '">\n' +
        '</div>');
    console.log(counter);
});

$(document).on("click", "i.del" , function() {
    counter--;
    $(this).parent().remove();
    console.log(counter);
});


$(function() {
    $(document).on("change",".uploadFile", function()
    {
        var uploadFile = $(this);
        var files = !!this.files ? this.files : [];
        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

        if (/^image/.test( files[0].type)){ // only image file
            var reader = new FileReader(); // instance of the FileReader
            reader.readAsDataURL(files[0]); // read the local file

            reader.onloadend = function(){ // set image data as background of div
                //alert(uploadFile.closest(".upimage").find('.imagePreview').length);
                uploadFile.closest(".imgUp").find('.imagePreview').find('img').css("opacity","0");
                uploadFile.closest(".imgUp").find('.imagePreview').css("background-image", "url("+this.result+")");
            }
        }

    });
});

$("textarea").keyup(function(e) {
    while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
        $(this).height($(this).height()+1);
    };
});

// $('input').each( function () {
//     $this = $(this);
//     if ( this.value != '' ) $this.addClass('yourClass');
// });