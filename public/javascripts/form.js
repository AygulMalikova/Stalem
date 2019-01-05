$("textarea").keyup(function(e) {
    while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
        $(this).height($(this).height()+1);
    };
});

// $('input').each( function () {
//     $this = $(this);
//     if ( this.value != '' ) $this.addClass('yourClass');
// });

