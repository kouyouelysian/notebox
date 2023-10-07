//==========================================================================//
//====================== BRIGHT MOON CO. NOTEBOX CODE ======================//
//==========================================================================//

/*
pre-import requirements:
	code/bmco_general.js
	code/bmco_xml.js
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


function nbox_getNoteElementEditor(noteInstance)
{

	var edit = document.createElement("div");
	edit.innerHTML = "edit";
	edit.classList.add("button");
	edit.setAttribute("onclick", "nbox_ed_noteEdit('"+noteInstance.nid+"')");

	var del = document.createElement("div");
	del.innerHTML = "delete";
	del.classList.add("button");
	del.setAttribute("onclick", "nbox_ed_noteDeleteConfirm('"+noteInstance.nid+"')");

	var p = document.createElement("p");
	p.innerHTML = noteInstance.text;

	var pwrap = document.createElement("div");
	pwrap.classList.add("nbox_noteText");
	pwrap.appendChild(p);

	var div = document.createElement("div");
	div.classList.add("nbox_note");
	div.setAttribute("nid", noteInstance.nid);
	
	div.appendChild(edit);
	div.appendChild(del);
	div.appendChild(pwrap);


	return div;
}

function nbox_getNoteElement(noteInstance)
{
	if (GLOBAL_isEditor)
		return nbox_getNoteElementEditor(noteInstance);

	else if (SETTING_userRenderer)
		return nbox_customRenderer(noteInstance);
	
	var p = document.createElement("p");
	p.class = "nbox_note";
	p.innerHTML = noteInstance.text;
	return p;
}

function nbox_appendNoteToTarget(note, target_id="nbox_target")
{
	var target = document.getElementById(target_id);
	if (target == null)
	{
		console.log("no target found to append notes to");
		return false;
	}
	if (SETTING_newFirst)
		target.prepend(nbox_getNoteElement(note));
	else
		target.appendChild(nbox_getNoteElement(note));
	return true;
}

function nbox_renderNotes(notes, start=0, end=undefined)
{
	if (start > notes.length)
	{
		console.log("start position exceeds note array length");
		return false;
	}

	if (end == undefined)
		end = notes.length;
	else
	{
		if (end > notes.length)
		{
			console.log("end position exceeds note array length");
			return false;
		}
	}

	for (var x = start; x < end; x++)
		nbox_appendNoteToTarget(notes[x]);
	
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

function nbox_startup(file="./files/data.xml")
{
	bmco_xml_awaitXmlFromFile(file).then(function(xmldoc){
		var notes = xmldoc.getElementsByTagName("note");
		nbox_renderNotes(nbox_notesXmlToNoteInstances(notes));
	});
}



