<?php
    require_once('session_module.php');
    if (isset($_COOKIE['id_cookie']) && isset($_COOKIE['session_cookie']) && sessionCheck($_COOKIE['id_cookie'], $_COOKIE['session_cookie'], $new_session_cookie, $err)) {
        // redirect to game app
        redirect('airhockey.php');
    } else {
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap-theme.css">
    <link rel="stylesheet" href="css/app.css">
</head>

<body>
    <nav role="navigation" class="navbar navbar-default navbar-fixed-top">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" data-target="#navbarCollapse" data-toggle="collapse" class="navbar-toggle">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a href="index.html" class="navbar-brand">Air Hockey</a>
        </div>
        <!-- Collection of nav links, forms, and other content for toggling -->
        <div id="navbarCollapse" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li><a href="index.html">Home</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li><a href="login.php">Login</a></li>
                <li><a href="register.php">Register</a></li>
            </ul>
        </div>
    </nav>
    <div class="container">
        <form class="form-signin" role="form" id="login-form">
            <h2 class="form-signin-heading">Please sign in</h2>
            <input class="form-control" type="email" name="email" autofocus="" required="" placeholder="Email address" autocomplete="off" id="email"></input>
            <input class="form-control" type="password" name="password" required="" placeholder="Password" autocomplete="off" id="password"></input>
            <label class="checkbox">
                <input type="checkbox" value="remember-me" id="persistent"></input>
                Remember me
            </label>
            <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </form>
    </div>

    <script src="bower_components/jquery/dist/jquery.js"></script>
    <script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
    <script src="js/jquery.cookie.js"></script>
    <script src="js/helper.js"></script>
    <script type="text/javascript">
        $(document).ready(function(event) {
            var request;    // variable to hold request
            $('#login-form').submit(function(event) {
                // prevent default posting of form
                event.preventDefault();

                // abort any pending request
                if (request) {
                    request.abort();
                }

                // local variables
                var reqObj = new Object();
                reqObj.email = $('#email').val();
                reqObj.password = $('#password').val();    // plaintext password in transmission ///TBC
                reqObj.persistent = $('#persistent').is(':checked') ? 'true' : 'false';
                var reqStr = JSON.stringify(reqObj);
                console.log(reqStr);

                var $form = $(this);
                var $inputs = $form.find('input, select, button, textarea');    // select and cache all the fields
                // var serializedData = $form.serialize();  // serialize form data, choose to transmit JSON string instead
                
                // Note: we disable elements AFTER the form data has been serialized. Disabled form elements will not be serialized.
                $inputs.prop('disabled', true);

                request = $.ajax({
                    url: 'login_handle.php',
                    type: 'post',
                    data: reqStr
                });

                // callback handler that will be called on success
                request.done(function (data, textStatus, jqXHR) {
                    console.log("response: " + data);
                    var res = JSON.parse(data);
                    if (res.success == 'true') {
                        // set cookies accordingly
                        setCookies(res.id_cookie, res.session_cookie, res.persistent);

                        if (res.redirect == 'true') {
                            window.location = res.redirectURL;
                        }

                    } else {
                        console.error(res.error);
                    }
                });

                // callback handler that will be called on failure
                request.fail(function (jqXHR, textStatus, errorThrown) {
                    // log the error to the console
                    console.error(
                        "The following error occured: "+
                        textStatus, errorThrown
                    );
                });

                // callback handler that will be called regardless if the request failed or succeeded
                request.always(function () {
                    // reenable the inputs
                    $inputs.prop("disabled", false);
                });

            });
        });
    </script>
</body>
</html>

<?php
    }
?>
