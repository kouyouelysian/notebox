/*
	You can write your own renderer for notes here! This means, you can define the exact
	HTML structure that will be created for every note, and appended to the target as a child.
*/

/*  custom renderer function for your notebox
inputs: noteInstance <Note> [object that describes a note being rendered]
return: <HTML element> [note HTML ready to be appended]
*/
function nbox_user_customRenderer(noteInstance)
{
	var nid = noteInstance.nid;    // note ID, OK to not use, but it exists
	var text = noteInstance.text;  // note text - this is what you want to render

	var el = document.createElement("p")''
	/*
		your code here.. do something with "el"ement, fill it w/ text, etc!
		change its type to div or w/e if you need to!
	*/

	return el;
}

/*
	below is an example, tailored to https://astrossoundhell.neocities.org/data/ update box
	the target element stuff gets rendered to is an <ul>, so i'm creating <li>'s
	instead of <p>'s.
*/

/*
function nbox_customRenderer(noteInstance)
{
	var li = document.createElement("li");
	li.classList.add("update");
	li.innerHTML = noteInstance.text;
	if (SETTING_textSafe)
		li.innerHTML = bmco_HTMLEntitiesEncode(noteInstance.text);
	return li;
}
*/
