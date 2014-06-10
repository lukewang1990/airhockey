<?php
    require_once('php_module/session_module.php');
    if (isset($_COOKIE['id_cookie']) && isset($_COOKIE['session_cookie']) && sessionCheck($_COOKIE['id_cookie'], $_COOKIE['session_cookie'], $new_session_cookie, $err)) {
        // redirect to game app
        redirect('airhockey.php');
    } else {
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Register</title>
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap-theme.css">
    <link rel="stylesheet" href="css/bootstrap-select.css">
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
        <form class="form-signin" role="form" id="reg-form">
            <h2 class="form-signin-heading">Registration form</h2>
            <input id="email" class="form-control" type="email" autofocus="" required="" placeholder="Email address" autocomplete="off" name="email"></input>
            <input id="name" class="form-control" type="text" required="" placeholder="Nickname" autocomplete="off" name="name"></input>
            <input id="password" class="form-control" type="password" required="" placeholder="Password" autocomplete="off" name="password"></input>
            <input id="cpassword" class="form-control" type="password" required="" placeholder="Confirm your password" autocomplete="off"></input>

            <div class="row">
                <div class="col-xs-4"><button class="btn btn-default disabled">Headshot</button></div>
                <div class="col-xs-8">
                    <select class="selectpicker" data-width="100%" id="headshot">
                      <option value="man1">Man 1</option>
                      <option value="man2">Man 2</option>
                      <option value="woman1">Woman 1</option>
                      <option value="woman2">Woman 2</option>
                    </select>
                </div>
            </div>
            
            <a class="thumbnail"><img src="img/headshot/man1.jpg" style="width:120px" id="headshot_img"></a>
            <label class="checkbox">
                <input type="checkbox" required="" value="term"></input>
                You have read and agree with our <a href="javascript:showTerm();">Terms of Usage</a>
            </label>
            <button class="btn btn-lg btn-primary btn-block" type="submit">Sign up</button>
        </form>
    </div>

    <script src="bower_components/jquery/dist/jquery.js"></script>
    <script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
    <script src="js/jquery.cookie.js"></script>
    <script src="js/bootstrap-select.js"></script>
    <script src="js/helper.js"></script>
    <script src="js/register.js"></script>
</body>
</html>

<?php
    }
?>
