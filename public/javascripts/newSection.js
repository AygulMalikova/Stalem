var counter = 0;

$(".imgAdd").click(function(){
    if (counter < 50) {
        counter++;
        $(this).closest(".row").find('.imgAdd').before(
            '<div class="col-lg-4 imgUp">\n' +
            '<div class="imagePreview">\n' +
            '<img src="/public/images/pic.svg" alt="">\n' +
            '</div>\n' +
            '<label class="btn btn-primary">\n' +
            'Upload<input type="file" name = "file" accept="image/*" class="uploadFile img" value="Upload Photo"\n' +
            'style="width:0px;height:0px;overflow:hidden;"></label>' +
            '<i class="fa fa-times del"></i>' +
            '<div class="group file">\n' +
            '<input class="file" type="text" name="picname">\n' +
            '<span class="highlight file"></span>\n' +
            '<span class="bar file"></span>\n' +
            '<label class="file">Name</label>\n' +
            '<input class="cover" type="radio" name = "cover" value="' + counter + '">\n' +
            '</div>');
    }

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