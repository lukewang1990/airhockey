function showTerm() {
    alert('Term of usage: You are confident enough to be the best airhockey guru!');
}

$(document).ready(function(event) {
    // for select element bootstrap support plugin
    $('.selectpicker').selectpicker();

    var request;    // variable to hold request
    $('#reg-form').submit(function(event) {
        // prevent default posting of form
        event.preventDefault();

        // validate passwords
        var password = $('#password'),
            cpassword = $('#cpassword');
        if (password.val() != cpassword.val()) {
            alert('The confirmed password is different from the password');
            cpassword.focus();
            return;
        }

        // abort any pending request
        if (request) {
            request.abort();
        }

        // local variables
        var reqObj = new Object();
        reqObj.email = $('#email').val();
        reqObj.name = $('#name').val();
        reqObj.password = $('#password').val();    // plaintext password in transmission ///TBC
        reqObj.headshot = $('#headshot').val();
        var reqStr = JSON.stringify(reqObj);
        
        var $form = $(this);
        var $inputs = $form.find('input, select, button, textarea');    // select and cache all the fields
        // var serializedData = $form.serialize();  // serialize form data, choose to transmit JSON string instead
        
        // Note: we disable elements AFTER the form data has been serialized. Disabled form elements will not be serialized.
        $inputs.prop('disabled', true);

        request = $.ajax({
            url: 'register_handle.php',
            type: 'post',
            data: reqStr
        });

        // callback handler that will be called on success
        request.done(function (data, textStatus, jqXHR) {
            // console.log("response: " + data);
            console.log(data);
            var res = JSON.parse(data);
            if (res.success == 'true') {
                // set cookies accordingly
                setCookies(res.id_cookie, res.session_cookie, res.persistent);

                // save useful info in localStorage
                localStorage.setItem('nickname', res.nickname);
                localStorage.setItem('playerID', res.playerID);
                localStorage.setItem('headshot', res.headshot);

                if (res.redirect == 'true') {
                    window.location = res.redirectURL;
                }

            } else {
                alert(res.error);
                $('#email').focus();
            }
        });

        // callback handler that will be called on failure
        request.fail(function (jqXHR, textStatus, errorThrown) {
            // log the error to the console
            alert(
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

    $('select').on('change', function(e) {
      // alert( this.value ); // or $(this).val()
      e.preventDefault();
      e.stopPropagation();
      $('#headshot_img').attr('src','img/headshot/' + this.value + '.jpg');
    });

});