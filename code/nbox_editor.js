
GLOBAL_xmldoc = undefined;
GLOBAL_isEditor = true;

/* Called onclick of a navbar header on app index,
switches between activity tabs.
inputs: tabName <string> [name of the tab, provided in onclick call],
		navbarOptionObject <DOM object> ["this" from onclick call]
return: none
*/
function nbox_ed_tabSwitchTo(tabName, navbarOptionObject)
{
	var targetTab = document.getElementById(tabName);
	if (targetTab == undefined)
		return;
	nbox_ed_removeAttributeForAllOfClass("tab", "style");
	targetTab.setAttribute("style", "display: block;");
	nbox_ed_removeAttributeForAllOfClass("navbarOption", "id");

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
		nbox_ed_removeAllOfClass("error");
		nbox_ed_removeAllOfClass("success");
	}
	
	navbarOptionObject.setAttribute('id', 'navbarSelected');
	
	
}

/* Removes some attribute from every DOM element of a class
inputs: classname <string> [name of assigned class],
		attribute <string> [name of the attribute to be removed]
return: none
*/
function nbox_ed_removeAttributeForAllOfClass(classname, attribute)
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
function nbox_ed_setAttributeForAllOfClass(classname, attribute, value)
{
	var targets = document.getElementsByClassName(classname);
	for (var x = 0; x < targets.length; x++)
		targets[x].setAttribute(attribute, value);
}

/* Removes every DOM element of a class
inputs: classname <string> [name of assigned class],
return: none
*/
function nbox_ed_removeAllOfClass(classname)
{
	var targets = document.getElementsByClassName(classname);
	for (var x = 0; x < targets.length; x++)
		targets[x].remove();
}





function nbox_ed_noteDivRemove(nid)
{
	var notes = document.getElementsByClassName("nbox_note");
	for (var x = 0; x < notes.length; x++)
	{
		if (notes[x].getAttribute("nid") == nid)
		{
			notes[x].parentElement.removeChild(notes[x]);
			return true;
		}
	}
	return false;
}


function nbox_ed_noteDivAdd(note)
{
	var el = nbox_getNoteElementEditor(note);
}

function nbox_ed_noteEdit(nid)
{

}


function nbox_ed_noteDeleteConfirm(nid)
{
	bmco_popup_confirm("Delete this note?", "nbox_ed_noteDelete('"+nid+"')");
}


function nbox_ed_noteDelete(nid)
{
	bmco_popup_close();
	myag_ed_nodeDelete(GLOBAL_xmldoc, "note", "nid", nid);
	nbox_ed_noteDivRemove(nid);
}


function nbox_ed_noteAdd(noteText="painis")
{
	var note = new Note(noteText);
	nbox_ed_xmlNoteAdd(note);
	nbox_appendNoteToTarget(note);
}


function nbox_ed_xmlNoteAdd(note)
{
	var text = new bmco_TagValuePair("text", note.text);
	var nid = new bmco_TagValuePair("nid", note.nid);
	var noteXml = bmco_xml_nodeConstruct(GLOBAL_xmldoc, "note", [text, nid]);
	GLOBAL_xmldoc.childNodes[0].appendChild(noteXml);
}



function nbox_ed_startup(file="./files/data.xml", editor=false)
{
	bmco_xml_awaitXmlFromFile(file).then(function(xmldoc){
		var notes = xmldoc.getElementsByTagName("note");
		nbox_renderNotes(nbox_notesXmlToNoteInstances(notes));
		GLOBAL_xmldoc = xmldoc;
	});
}

