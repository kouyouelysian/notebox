//==========================================================================//
//=============== BRIGHT MOON CO. GUI DRIVING FUNCTIONS ====================//
//==========================================================================//

/*
pre-import requirements:
	bmco_general.js

style requirements:
	bmco_gui.css

only to be used as an ez buttons+popups addon for existing projects
*/

//==========================================================================//
//================================ FUNCTIONS ===============================//
//==========================================================================//

/*  Hides any opened interactive windows, like popups or fillouts.
inputs: none
return: none 
*/
function bmco_gui_hideAny()
{
	popups = document.getElementsByClassName("popup");
	fillouts = document.getElementsByClassName("fillout");

	for (var t = 0; t < popups.length; t++)
		popups[t].remove();

	for (var t = 0; t < fillouts.length; t++)
		fillouts[t].removeAttribute("style");
	bmco_gui_backdropRemove();
}

/*  creates a sticky <div> to cover everything behind popups etc, appens to body.
	does not create anything if a backdrop of ID already exists.
inputs: none
return: none
*/
function bmco_gui_backdropCreate(onclick="bmco_gui_hideAny()", backdropId="guiBackdrop")
{
	if (document.getElementById(backdropId) != undefined)
		return;
	var backdrop = document.createElement("div");
	backdrop.id = backdropId;
	backdrop.classList.add("backdrop");
	backdrop.setAttribute("onclick", onclick);
	document.body.appendChild(backdrop);
}

/*  removes the backdrop
inputs: none
return: none
*/
function bmco_gui_backdropRemove(backdropId="guiBackdrop")
{
	bmco_removeIfExists(backdropId);
}

/*-------------------------------- button --------------------------------*/

/*  Creates HTML for a standard clickable button
inputs: text <string> [text to be displayed in the button, e.g. "OK"],
		fn <string> [function to be put into button's onclick event, e.g. "alert(1)"]
return: <HTML element> [ready-to-append button]
*/
function bmco_gui_buttonCreate(text, fn)
{
	var button = document.createElement("div");
	button.innerHTML = text;
	if (fn != undefined)
		button.setAttribute("onclick", fn);
	button.classList.add("button");
	return button;
}

/*-------------------------------- popup --------------------------------*/

/*  Adds a button to popup's button zone
inputs: text <string> [text to be put into the paragraph],
		fn <string> [function to be executed upon clicking the button]
return: none
*/
function bmco_gui_popupAddButton(popup, text, fn)
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

	target.appendChild(bmco_gui_buttonCreate(text, fn));
}

/*  closes any generated popup, if there is one
inputs: none
return: none
*/
function bmco_gui_popupClose()
{
	bmco_gui_backdropRemove();
	bmco_removeIfExists("popupAlert");
	bmco_removeIfExists("popupSelect");
}

/*  creates the default popup body to which buttons have to be appended
inputs: text <string> [popup message text],
		id <string, optional> [if set - the popup window id]
return: <html element>
*/
function bmco_gui_popupCreatePopupBody(text, id=undefined)
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

/*  Throws an alert message on-screen that can be closed by pressing
"OK" - a fancy substitute for the built-in "alert(arg)" method
inputs: message <string> [alert message text]
		text <string, optional> [text to be displayed on the button],
		fn <string, optional> [function to be executed on button press, closes the popup by default]
return: <html element> [created popup div]
*/
function bmco_gui_popupAlert(message, fn="bmco_gui_popupClose()", text="OK")
{
	bmco_gui_backdropCreate("bmco_gui_popupClose()");
	var alertDiv = bmco_gui_popupCreatePopupBody(message, "popupAlert");
	bmco_gui_popupAddButton(alertDiv, text, fn);
	document.body.appendChild(alertDiv);
	return alertDiv;
}

/*  Throws a select prompt message on-screen that can disappears when
the user chooses one of the two options.
inputs: message <string> [select prompt text],
		text1 <string> [text on the left button],
		fn1 <string> [onclick to be executed by the left button],
		text2 <string> [text on the right button],
		fn2 <string> [onclick to be executed by the right button]
return: <html element> [created popup div]
*/
function bmco_gui_popupConfirm(message, fn1, text1="YES", fn2="bmco_gui_popupClose()", text2="NO")
{
	bmco_gui_backdropCreate("bmco_gui_popupClose()");
	var selectDiv = bmco_gui_popupCreatePopupBody(message, "popupSelect");
	bmco_gui_popupAddButton(selectDiv, text1, fn1);
	bmco_gui_popupAddButton(selectDiv, text2, fn2);
	document.body.appendChild(selectDiv);
	return selectDiv;
}

/*-------------------------------- bottombar --------------------------------*/

/*  Clears all buttons from a .bottombar div
inputs: id <string> [element ID of .bottombar div to be cleaned up]
return: <bool> [success or not]
*/
function bmco_gui_bottomBarClear(id)
{
	var target = document.getElementById(id);
	if (!target)
		return false;
	target.innerHTML = "";
	return true;
}

/*  Is used to populate a .bottombar <div> with buttons
inputs: buttonTuples <Array[ ["name", "function()"], ...> [Information on
		the buttons that should be created. Array of arrays. Each child array
		should contain 2 strings: text displayed on the button (e.g. "OK"), and
		text to be put to the onclick attribute, usually a JS function (e.g.
		"alert(1)") ],
		id <string> [element ID of .bottombar div to be cleaned up]
return: none
*/
function bmco_gui_bottomBarPopulate(buttonTuples, id)
{
	if (!(bmco_gui_bottomBarClear(id)))
		return;

	var target = document.getElementById(id);
	if (!target)
		return;

	for (var t = 0; t < buttonTuples.length; t++)
	{
		var bt = buttonTuples[t];
		var b = bmco_gui_buttonCreate(bt[0], bt[1]);
		target.appendChild(b);
	}
}

/*-------------------------------- fillout --------------------------------*/

/*  Show a fill-out form by its id. Comes with a backdrop and everything
inputs: id <string> [id of a .fillout class div]
return: none
*/
function bmco_gui_filloutShow(id)
{
	var target = document.getElementById(id);
	if (target == undefined)
		return;
	bmco_gui_backdropCreate();
	target.style.display = "block";
}

/*  Hide a fill-out form by its id. Deletes the backdrop
inputs: id <string> [id of a .fillout class div]
return: none
*/
function bmco_gui_filloutHide(id)
{
	var target = document.getElementById(id);
	if (target == undefined)
		return;
	bmco_gui_backdropRemove();
	target.removeAttribute("style");
}
