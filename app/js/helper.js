function setCookies(id_cookie, session_cookie, persistent) {
	var expTime = new Date();
    expTime.setMinutes(expTime.getMinutes() + 30); // Create a date 30 minutes from now
    if (persistent == 'true') {
    	$.cookie('id_cookie', id_cookie, { expires: 7, path: '/' });
    	$.cookie('session_cookie', session_cookie, { expires: expTime, path: '/' });
    } else {
    	$.cookie('id_cookie', id_cookie, { path: '/' });
    	$.cookie('session_cookie', session_cookie, { path: '/' });
    }
    
}
