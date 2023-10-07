/*========================================================*/

//  this is ADD-ON CODE to add pop-ups to the project!
//  it requires "bmco_general.js" added BEFORE itself in
//  document's BODY end! Required style -> "bmco_popup.css"

/*========================================================*/

/* Adds a button to popup's button zone
inputs: text <string> [text to be put into the paragraph],
		fn <string> [function to be executed upon clicking the button]
return: none
*/
function bmco_popup_addButton(popup, text, fn)
{
	target = null;
	for (var i = 0; i < popup.childNodes.length; i++)
	{
		if (popup.childNodes[i].className == "popupButtonZone") 
		{
			target = popup.childNodes[i];
			break;
		}
	}
	if (target == null)
		return;

	var button = document.createElement("p");
	button.innerHTML = text;
	if (fn != undefined)
		button.setAttribute("onclick", fn);
	button.classList.add("button");

	target.appendChild(button);
}

/* closes any generated popup, if there is one
inputs: none
return: none
*/
function bmco_popup_close()
{
	bmco_removeIfExists("popupBackdrop");
	bmco_removeIfExists("popupAlert");
	bmco_removeIfExists("popupSelect");
}

/* creates a sticky <div> to cover everything behind the popup
inputs: none
return: <html element>
*/
function bmco_popup_createBackdrop()
{
	var backdrop = document.createElement("div");
	backdrop.id = "popupBackdrop";
	backdrop.setAttribute("onclick", "myag_doNothing()")
	return backdrop;
}

/* creates the default popup body to which buttons have to be appended
inputs: text <string> [popup message text],
		id <string, optional> [if set - the popup window id]
return: <html element>
*/
function bmco_popup_createPopupBody(text, id=undefined)
{
	var popup = document.createElement("div");
	if (id != undefined)
		popup.id = id;
	popup.classList.add("popup");
	var textMessage = document.createElement("p");
	textMessage.innerHTML = text;
	textMessage.classList.add("popupTextMessage");
	popup.appendChild(textMessage);
	var buttonZone = document.createElement("div");
	buttonZone.classList.add("popupButtonZone");
	popup.appendChild(buttonZone);
	return popup;
}

/* Throws an alert message on-screen that can be closed by pressing
"OK" - a fancy substitute for the built-in "alert(arg)" method
inputs: message <string> [alert message text]
		text <string, optional> [text to be displayed on the button],
		fn <string, optional> [function to be executed on button press, closes the popup by default]
return: <html element> [created popup div]
*/
function bmco_popup_alert(message, fn="bmco_popup_close()", text="OK")
{
	document.body.appendChild(bmco_popup_createBackdrop());
	var alertDiv = bmco_popup_createPopupBody(message, "popupAlert");
	bmco_popup_addButton(alertDiv, text, fn);
	document.body.appendChild(alertDiv);
	return alertDiv;
}

/* Throws a select prompt message on-screen that can disappears when
the user chooses one of the two options.
inputs: message <string> [select prompt text],
		text1 <string> [text on the left button],
		fn1 <string> [onclick to be executed by the left button],
		text2 <string> [text on the right button],
		fn2 <string> [onclick to be executed by the right button]
return: <html element> [created popup div]
*/
function bmco_popup_confirm(message, fn1, text1="YES", fn2="bmco_popup_close()", text2="NO")
{
	document.body.appendChild(bmco_popup_createBackdrop());
	var selectDiv = bmco_popup_createPopupBody(message, "popupSelect");
	bmco_popup_addButton(selectDiv, text1, fn1);
	bmco_popup_addButton(selectDiv, text2, fn2);
	document.body.appendChild(selectDiv);
	return selectDiv;
}
