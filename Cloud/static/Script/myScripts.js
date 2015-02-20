function showIp(divIn, objIn)
{
	$(divIn).empty();
	$(divIn).append(objIn.ip);
	
}

function showUnit(divIn, objIn)
{
	if(objIn.unit == "9999999")
	{
		$(divIn).html('<a href="/live_chart">'+"NO Units on Line"+'</a>');
	}
	else
	{
		$(divIn).html('<a href="/live_chart">'+objIn.unit+'</a>');
	}
	
}
