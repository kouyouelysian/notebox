//==========================================================================//
//========================== NOTEBOX EDITOR CODE ===========================//
//==========================================================================//

/*
pre-import requirements:
	nbox_user/settings.js
	nbox_code/bmco_general.js
	nbox_code/bmco_xml.js
	nbox_code/bmco_guijs
	nbox_code/nbox_main.js
*/

//==========================================================================//
//================================ GLOBALS =================================//
//==========================================================================//

GLOBAL_xmldoc = undefined;
GLOBAL_updateCount = undefined;
GLOBAL_isEditor = true; // overrides nbox_main.js global
SETTING_newFirst = true; // overrides user's selection
SETTING_targetId = "nbox_target"; // overrides user's selection

//==========================================================================//
//================================ FUNCTIONS ===============================//
//==========================================================================//

//---------------- HTML element creation ----------------//

/*  creates an HTML element of one move marker (used to reorder notes in editor)
inputs: noteInstance <Note> [Note instance to blueprint the element after]
return: <HTML element>
*/
function nbox_ed_noteMoveMarkerCreate(noteInstance)
{
	var div = document.createElement("div");
	div.classList.add("nbox_noteMoveMarker");
	div.id = "nbox_noteMoveMarker_"+noteInstance.nid;
	div.setAttribute("onclick", "nbox_ed_noteMove('"+noteInstance.nid+"')")
	div.innerHTML = "<p>Move here</p>";
	return div;
}

/*  Creates an HTML element of a single note, fit with buttons for the editor display.
	nbox_getNoteElement() reroutes here if GLOBAL_isEditor is true
inputs: noteInstance <Note> [Note instance to blueprint the element after]
return: <HTML element>
*/
function nbox_ed_noteElementCreate(noteInstance)
{
	var edit = bmco_gui_buttonCreate("Edit", "nbox_ed_filloutLoad('edit', '"+noteInstance.nid+"')");
	var move = bmco_gui_buttonCreate("Move", "nbox_ed_noteMoveStart('"+noteInstance.nid+"')");
	var del = bmco_gui_buttonCreate("Delete", "nbox_ed_noteDeletePopup('"+noteInstance.nid+"')");
	var p = document.createElement("p");
	p.innerHTML = noteInstance.text;
	if (SETTING_textSafe)
		p.innerHTML = bmco_HTMLEntitiesEncode(noteInstance.text);
	p.id = "nbox_noteText_"+noteInstance.nid;
	var pwrap = document.createElement("div");
	pwrap.classList.add("nbox_noteText");
	pwrap.appendChild(p);
	var div = document.createElement("div");
	div.classList.add("nbox_note");
	div.id = "nbox_note_"+noteInstance.nid;
	div.setAttribute("nid", noteInstance.nid);
	div.appendChild(edit);
	div.appendChild(move);
	div.appendChild(del);
	div.appendChild(pwrap);
	return div;
}

/*  removes a note div/not move marker div for note of a given note id
inputs: nid <string> [valid note id]
return: <bool> [success status]
*/
function nbox_ed_noteElementAndMarkerRemove(nid)
{
	var note = document.getElementById("nbox_note_"+nid);
	var noteMoveMarker = document.getElementById("nbox_noteMoveMarker_"+nid);

	if ((note == undefined) || (noteMoveMarker == undefined))
		return false;
	note.remove();
	noteMoveMarker.remove();
	return true;
}

//---------------- Core note xml+html operations ----------------//

/* Adds a new note to the system (on-screen div and XML tags)
inputs: text <string> [the note will have this text]
return: none
*/
function nbox_ed_noteAdd(text=undefined)
{
	if (text == undefined)
	{
		var textarea =document.getElementById("noteText");
		if (textarea == undefined)
		{
			console.log("failed to add note: no text provided and no textarea loaded");
			return;
		}
		text = textarea.value;
	}

	text = text.trim();

	if (text == "")
	{
		bmco_gui_popupAlert("Cannot add an empty note!", "bmco_removeIfExists('popupAlert')");
		return;
	}

	var note = new Note(text);
	var text = new bmco_TagValuePair("text", note.text);
	var nid = new bmco_TagValuePair("nid", note.nid);
	var noteXml = bmco_xml_nodeAndChildrenWithTextConstruct(GLOBAL_xmldoc, "note", [text, nid]);
	bmco_xml_noteGetFirstOfTag(GLOBAL_xmldoc, "notes").appendChild(noteXml);
	nbox_appendNoteToTarget(note, document.getElementById("nbox_target"));
	bmco_gui_filloutHide("noteTextFillout");
}

/*  updates an existing note with a requested nid with new text (both xml and on-screen)
inputs: text <string> [the note will have this text instead of the old text]
return: none;
*/
function nbox_ed_noteUpdate(nid, text=document.getElementById("noteText").value)
{
	var target = bmco_xml_nodeGetByChildTagValue(GLOBAL_xmldoc, "note", "nid", nid);
	bmco_xml_ChildTagWrite(GLOBAL_xmldoc, target, "text", text);

	var p = document.getElementById("nbox_noteText_"+nid);
	p.innerHTML = text;
	if (SETTING_textSafe)
		p.innerHTML = bmco_HTMLEntitiesEncode(text);

	bmco_gui_filloutHide("noteTextFillout");
}

/*  reorder-move one note after another note
inputs: nidTo <string> [note ID to put a target note after],
		nidMoved <string> [note ID of the target note being moved, by default reads
		from a hidden field that holds a correct nid set in nbox_ed_noteMoveStart() ]
return: none
*/
function nbox_ed_noteMove(nidTo, nidMoved=document.getElementById("movedNoteId").value)
{
	var elMoved = document.getElementById("nbox_note_"+nidMoved);
	var elMovedMarker = document.getElementById("nbox_noteMoveMarker_"+nidMoved);
	var elTo = document.getElementById("nbox_noteMoveMarker_"+nidTo);
	elMoved.parentElement.insertBefore(elMoved, elTo.nextSibling);
	elMoved.parentElement.insertBefore(elMovedMarker, elMoved.nextSibling);

	nbox_ed_moveMarkersVisible(false);
	document.getElementById("nbox_note_"+nidMoved).removeAttribute("style");
	document.getElementById("nbox_noteMoveMarker_"+nidMoved).removeAttribute("style");
	document.getElementById("movedNoteId").removeAttribute("value");
	nbox_ed_noteMoveEnd();

	if (nidTo == "freshest")
	{
		bmco_xml_nodePutAtEnd(GLOBAL_xmldoc, "note", "nid", nidMoved);
		return; // end of <data> = most recent note
	}
	bmco_xml_nodePutBefore(GLOBAL_xmldoc, "note", "nid", nidMoved, nidTo);
}

/*  deletes the note from the system (both on-screen and html)
inputs: nid <string> [note id of the note to be deleted]
return: none
*/
function nbox_ed_noteDelete(nid)
{
	bmco_gui_popupClose();
	bmco_xml_nodeDeleteByChildTagText(GLOBAL_xmldoc, "note", "nid", nid);
	nbox_ed_noteElementAndMarkerRemove(nid);
}

//---------------- onclick binds for the html page, misc. interface stuff ----------------//

/*  onclick call for the fast note post button. creates a new note and instantly
	dumps XML to clipboard + opens the XML document web-editor
inputs: none
return: none
*/
function nbox_ed_noteFast()
{
	var text = document.getElementById("fastNoteText").value;
	nbox_ed_noteAdd(text);
	nbox_ed_updateXml();
}

/*  onclick bind for the delete note button. creates a popup prompting the user to confirm deletion
inputs: nid <string> [note id of the note to be deleted]
return: none
*/
function nbox_ed_noteDeletePopup(nid)
{
	bmco_gui_popupConfirm("Delete this note?", "nbox_ed_noteDelete('"+nid+"')");
}

/*  onclick bind to start moving a note
inputs: nid <string> [note id of the note to be moved]
return: none
*/
function nbox_ed_noteMoveStart(nid)
{
	nbox_ed_bottombarLoad("moving", nid);
	nbox_ed_moveMarkersVisible(true);
	document.getElementById("nbox_note_"+nid).style.display = "none";
	document.getElementById("nbox_noteMoveMarker_"+nid).style.display = "none";
	document.getElementById("movedNoteId").value = nid;
}

/*  End the moving procedure. Restores the visibility of the note that was being moved
	if nid is provided, just restores the bottom bar menu and hides markers otherwise
inputs: <string, optional> nid [note id of the note being moved.]
return: none
*/
function nbox_ed_noteMoveEnd(nid=undefined)
{
	nbox_ed_bottombarLoad("normal");
	nbox_ed_moveMarkersVisible(false);
	if (nid == undefined)
		return
	document.getElementById("nbox_note_"+nid).removeAttribute("style");
	document.getElementById("nbox_noteMoveMarker_"+nid).removeAttribute("style");
}

/*  toggles the visibility of note move markers
inputs: visible <bool> [if the markers should be visible or not]
return: none
*/
function nbox_ed_moveMarkersVisible(visible)
{
	var markers = document.getElementsByClassName("nbox_noteMoveMarker");
	for (var t = 0; t < markers.length; t++)
	{
		if (visible)
			markers[t].style.display = "block";
		else
			markers[t].removeAttribute("style");
	}
}

/*  Puts the current xmldoc as string to clipboard, opens xml database file editor
inputs: none
return: none
*/
function nbox_ed_updateXml(openWebEditor=true)
{
	bmco_xml_nodeTextWrite(GLOBAL_xmldoc, bmco_xml_noteGetFirstOfTag(GLOBAL_xmldoc, "updateCount"), String(GLOBAL_updateCount+1));
	bmco_xml_nodeTextWrite(GLOBAL_xmldoc, bmco_xml_noteGetFirstOfTag(GLOBAL_xmldoc, "updateTimestamp"), bmco_timestamp());	
	bmco_xml_xmldocTextToClipboard(GLOBAL_xmldoc, gui=false);
	if (openWebEditor)
		bmco_urlOpen(SETTING_neocitiesXmlFileEditLink);
	else // "copy raw xml" button
		bmco_gui_popupAlert('raw XML copied');
}

/*  loads correct buttons into the main bottom bar.
inputs: mode <string, opt., "normal" or "moving"> [desired menu mode]
return: none
*/
function nbox_ed_bottombarLoad(mode="normal", nid=undefined)
{
	nameFnTuples = [];

	if (mode == "normal")
	{
		nameFnTuples.push(["Copy XML", "nbox_ed_updateXml(false)"]);
		nameFnTuples.push(["Update XML", "nbox_ed_updateXml()"]);
	}
	else if (mode == "moving")
		nameFnTuples.push(["Cancel", "nbox_ed_noteMoveEnd('"+nid+"')"]);
	else
		return;
	bmco_gui_bottomBarPopulate(nameFnTuples, "mainBottomBar");
}

/*  opens the fill-pout form and loads correct button functions to it
inputs: mode <string, "new" or "edit"> [desired fillout mode],
		nid <string, optional> [note id string. if 'undefined' while
		mode = "edit", function will return w/o doing shit]
return: none
*/
function nbox_ed_filloutLoad(mode, nid=undefined)
{

	nameFnTuples = [["Cancel", "bmco_gui_filloutHide('noteTextFillout')"]];
	if (mode == "new")
	{
		document.getElementById("noteText").value = "";
		nameFnTuples.push(["Add", "nbox_ed_noteAdd()"]);
	}
	else if (mode == "edit")
	{
		if (nid == undefined)
			return;
		var noteText = document.getElementById("nbox_noteText_"+nid).innerHTML;
		if (SETTING_textSafe)
			noteText = bmco_HTMLEntitiesDecode(noteText);
		document.getElementById("noteText").value = noteText;
		nameFnTuples.push(["Update", "nbox_ed_noteUpdate('"+nid+"')"]);

	}	
	else
		return;

	bmco_gui_bottomBarPopulate(nameFnTuples, "filloutBottomBar");
	bmco_gui_filloutShow("noteTextFillout");
}

//---------------- page starter ----------------//

/*  start-up function for the editor page
inputs: file <string, optional> [location of the xml database file]
return: none
*/
function nbox_ed_startup(file="./nbox_files/data.xml")
{
	nbox_ed_bottombarLoad();
	bmco_xml_awaitXmlFromFile(file).then(function(xmldoc){
		var notes = xmldoc.getElementsByTagName("note");
		nbox_renderNotes(nbox_notesXmlToNoteInstances(notes));
		GLOBAL_xmldoc = xmldoc;
		GLOBAL_updateCount = bmco_parseIntSafe(bmco_xml_nodeTextRead(bmco_xml_noteGetFirstOfTag(xmldoc, "updateCount")));
	});
}
