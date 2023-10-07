//==========================================================================//
//====================== BRIGHT MOON CO. NOTEBOX CODE ======================//
//==========================================================================//

/*
pre-import requirements:
	code/bmco_general.js
	code/bmco_xml.js
	code/bmco_gui.js
	code/nbox_settings.js
	user/renderer.js
*/

GLOBAL_isEditor = false;

//==========================================================================//
//================================ FUNCTIONS ===============================//
//==========================================================================//

class Note {
  constructor(text, nid="note_"+bmco_makeIdBase()) {
  	this.text = text;
    this.nid = nid;
  }
}

function nbox_getNoteElement(noteInstance)
{
	if (GLOBAL_isEditor)
		return nbox_ed_getNoteElementEditor(noteInstance);
	else if (SETTING_userRenderer)
		return nbox_customRenderer(noteInstance);
	var p = document.createElement("p");
	p.class = "nbox_note";
	p.innerHTML = noteInstance.text;
	if (SETTING_textSafe)
		p.innerHTML = bmco_HTMLEntitiesEncode(noteInstance.text);
	return p;
}

function nbox_appendNoteToTarget(note, target)
{
	if (target == null)
		return false;
	var el = nbox_getNoteElement(note);
	if (SETTING_newFirst)
		target.insertBefore(el, target.childNodes[0].nextSibling); // insert after the "tostart" move marker
	else
		target.appendChild(el);
	if (GLOBAL_isEditor)
		el.parentNode.insertBefore(nbox_ed_getNoteMoveMarker(note), el.nextSibling);
	return true;
}

function nbox_renderNotes(notes, start=0, end=undefined, target_id="nbox_target")
{
	if (start > notes.length)
		return

	if (end == undefined)
		end = notes.length;
	else if (end > notes.length)
		return;
	
	var target = document.getElementById(target_id);
	if (target == null)
		return;

	for (var x = start; x < end; x++)
		nbox_appendNoteToTarget(notes[x], target);

	if (start == 0)
	{
		var note = new Note("start", "start");
		target.prepend(nbox_ed_getNoteMoveMarker(note));
	}
}

function nbox_notesXmlToNoteInstances(notes)
{
	out = []
	for (var x = 0; x < notes.length; x++)
	{
		var note = new Note(text=bmco_xml_childTagRead(notes[x], "text"), nid=bmco_xml_childTagRead(notes[x], "nid"));
		out.push(note);
	}
	return out;
}

function nbox_startup(file="./nbox_files/data.xml")
{
	bmco_xml_awaitXmlFromFile(file).then(function(xmldoc){
		var notes = xmldoc.getElementsByTagName("note");
		nbox_renderNotes(nbox_notesXmlToNoteInstances(notes));
	});
}
