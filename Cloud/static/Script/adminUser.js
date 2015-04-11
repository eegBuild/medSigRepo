var fadeTime = 500;
function addUser(divIn)
{
	var message = "Add user Personal email and Password."
	var out =("<div class='login-card'>\
		<p><h2>"+message+"</h2></p>\
			<br/>\
		  <form action='/add_user' method='POST'>\
			<input type='email' name='user' placeholder='Username eg user@<your company>.ie' >\
			<input type='text' name='pass' placeholder='Password'>\
			<input type='submit' name='login' class='login login-submit' value='Add User'>\
		  </form>\
			<br/>\
	</div>\
	");
	
	$(divIn).empty();
	$(divIn).hide();
	$(divIn).append(out);
	$(divIn).fadeIn(fadeTime);
	alert("bang");
};