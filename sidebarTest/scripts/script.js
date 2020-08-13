$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    $('#dismiss').on('click', function () {
        console.log("clicked")
        $('#sidebar').addClass('active');
    });

    // $('#sidebarCollapse').on('click', function () {
    //     // open sidebar
    //     $('#sidebar').addClass('active');
    //     // fade in the overlay
    //     // $('.overlay').addClass('active');
    //     // $('.collapse.in').toggleClass('in');
    //     // $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    // });
});