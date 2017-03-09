/**
 * Created by constantin.crismaru on 1/31/2017.
 */

var login = function () {
    var username = $('#username').val(),
        password = $('#password').val(),
        requestObj = {
            username: username,
            password: password
        };

    $('.loader-gif90').css('background-image', 'url("icons/loading-gif34.gif")');
    $('.login-btn').css('color', '#ddd');

    localStorage.clear();

    if(!!username && !!password) {
        $.post("backend/login.php", requestObj, function () {

            if(username === 'ana') {
                localStorage.setItem('genre', 'female');
            } else {
                localStorage.setItem('genre', 'male');
            }

            localStorage.setItem('username', username);
            location.href = 'map.html';
        });
    }
}
