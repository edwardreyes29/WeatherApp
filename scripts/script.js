$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    $('#dismiss').on('click', function () {
        $('#sidebar').addClass('active');
    });
});

/** TODO add styling to change background dynamically based on time of day **/