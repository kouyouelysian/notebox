//==========================================================================//
//========================== NOTEBOX MAIN CODE =============================//
//==========================================================================//

/*
pre-import requirements:
	nbox_user/settings.js
	nbox_user/renderer.js
	nbox_code/bmco_general.js
	nbox_code/bmco_xml.js
*/

//==========================================================================//
//================================ GLOBALS =================================//
//==========================================================================//

GLOBAL_isEditor = false;

//==========================================================================//
//=============================== CLASSES ==================================//
//==========================================================================//

/*  holds note's text contents and Note ID (nid), used mostly to conveniently
	store and pass note info around. may get more usage and methods later
*/
class Note {
  constructor(text, nid="note_"+bmco_makeIdBase()) {
  	this.text = text;
    this.nid = nid;
  }
}

//==========================================================================//
//================================ FUNCTIONS ===============================//
//==========================================================================//

/*  creates an HTML element of one note div. Rotues to nbox_ed_noteElementCreate()
	from nbox_editor.js if GLOBAL_isEditor, and uses a user-defined renderer from
	user/renderer.js if SETTING_userRenderer
inputs: noteInstance <Note> [Note instance to blueprint the element after]
return: <HTML element>
*/
function nbox_getNoteElement(noteInstance)
{
	if (GLOBAL_isEditor)
		return nbox_ed_noteElementCreate(noteInstance);
	else if (SETTING_userRenderer)
		return nbox_user_customRenderer(noteInstance);
	var p = document.createElement("p");
	p.classList.add("nbox_note");
	p.innerHTML = noteInstance.text;
	if (SETTING_textSafe)
		p.innerHTML = bmco_HTMLEntitiesEncode(noteInstance.text);
	return p;
}

/*  Appends note HTML element to target, and its move marker if isEditor
inputs: note <Note> [Note instance to transcribe into HTML],
		target <HTML element> [element to append the note as a child to]
return: <bool> [success or not]
*/
function nbox_appendNoteToTarget(note, target)
{
	if (target == null)
		return false;
	var el = nbox_getNoteElement(note);
	if (SETTING_newFirst)
	{
		if (GLOBAL_isEditor)
			target.insertBefore(el, target.childNodes[0].nextSibling); // insert after the "tostart" move marker
		else
			target.prepend(el);
	}
	else
		target.appendChild(el);
		
		
	if (GLOBAL_isEditor)
		el.parentNode.insertBefore(nbox_ed_noteMoveMarkerCreate(note), el.nextSibling);
	return true;
}

/* Processes an array of Note instances into HTML elements appended to a requested parent <div>
inputs: notes <array[Note]> [an array of Note instances to transcribe into HTML],
		start <int, optional> [start loading from this index, maybe will be used for dynamic load-ups],
		end <int, optional> [finish loading at this index (excl.), maybe will be used for dynamic load-ups],
		target_id <string, optional> [ID of the element to displays notes in, usually
		a <div>. Reads from SETTING_targetId in user/settings.js if not provided]
return: none
*/
function nbox_renderNotes(notes, start=0, end=undefined, target_id=SETTING_targetId)
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

	if (start == 0 && GLOBAL_isEditor)
	{
		var note = new Note("freshest", "freshest"); // a marker to move note to the very top, above all other notes
		target.prepend(nbox_ed_noteMoveMarkerCreate(note));
	}

	for (var x = start; x < end; x++)
		nbox_appendNoteToTarget(notes[x], target);	
}

/*  Converts an array of xml <note> tag structures into an array of Note instances
inputs: notes <Array[XML element]> [<note> tags extracted from data.xml]
return: <Array[Note]>
*/
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

/*  start-up function for the page that displays the note box
inputs: file <string, optional> [location of the xml database file]
return: none
*/
function nbox_startup(file="./nbox_files/data.xml")
{
	bmco_xml_awaitXmlFromFile(file).then(function(xmldoc){
		var notes = xmldoc.getElementsByTagName("note");
		nbox_renderNotes(nbox_notesXmlToNoteInstances(notes));
	});
}
