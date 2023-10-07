//==========================================================================//
//================ BRIGHT MOON CO. PAGE TAB SYSTEM CODE ====================//
//==========================================================================//

/*
pre-import requirements:
	none

stylesheet requirements:
	bmco_pagetabs.css
*/

//==========================================================================//
//================================ FUNCTIONS ===============================//
//==========================================================================//

/* Called onclick of a navbar header on app index,
switches between activity tabs.
inputs: tabName <string> [name of the tab, provided in onclick call],
		navbarOptionObject <DOM object> ["this" from onclick call]
return: none
*/
function bmco_tab_switchTo(tabName, navbarOptionObject)
{
	var targetTab = document.getElementById(tabName);
	if (targetTab == undefined)
		return;
	bmco_tab_removeAttributeForAllOfClass("tab", "style");
	targetTab.setAttribute("style", "display: block;");
	bmco_tab_removeAttributeForAllOfClass("navbarOption", "id");

	if (navbarOptionObject == null)
	{
		var allOptions = document.getElementsByClassName("navbarOption");
		for (var x = 0; x < allOptions.length; x++)
		{
			var onclick = allOptions[x].getAttribute("onclick");
			if (onclick.search(tabName) != -1)
			{
				navbarOptionObject = allOptions[x];
				break;
			}
		}
	}
	else
	{
		bmco_tab_removeAllOfClass("error");
		bmco_tab_removeAllOfClass("success");
	}
	navbarOptionObject.setAttribute('id', 'navbarSelected');
}

/* Removes some attribute from every DOM element of a class
inputs: classname <string> [name of assigned class],
		attribute <string> [name of the attribute to be removed]
return: none
*/
function bmco_tab_removeAttributeForAllOfClass(classname, attribute)
{
	var targets = document.getElementsByClassName(classname);
	for (var x = 0; x < targets.length; x++)
		targets[x].removeAttribute(attribute);
}

/* Sets some attribute to a value for every DOM element of a class
inputs: classname <string> [name of assigned class],
		attribute <string> [name of the attribute to be added]
		value <string> [value to assign attribute to for each element]
return: none
*/
function bmco_tab_setAttributeForAllOfClass(classname, attribute, value)
{
	var targets = document.getElementsByClassName(classname);
	for (var x = 0; x < targets.length; x++)
		targets[x].setAttribute(attribute, value);
}

/* Removes every DOM element of a class
inputs: classname <string> [name of assigned class],
return: none
*/
function bmco_tab_removeAllOfClass(classname)
{
	var targets = document.getElementsByClassName(classname);
	for (var x = 0; x < targets.length; x++)
		targets[x].remove();
}
