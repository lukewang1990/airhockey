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

                // save useful info in localStorage
                localStorage.setItem('nickname', res.nickname);
                localStorage.setItem('playerID', res.playerID);

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