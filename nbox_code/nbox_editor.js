
GLOBAL_xmldoc = undefined;
GLOBAL_isEditor = true;
SETTING_newFirst = true;

function nbox_ed_getNoteMoveMarker(noteInstance)
{
	var div = document.createElement("div");
	div.classList.add("nbox_noteMoveMarker");
	div.id = "nbox_noteMoveMarker_"+noteInstance.nid;
	div.setAttribute("onclick", "nbox_ed_noteMoveTo('"+noteInstance.nid+"')")
	div.innerHTML = "<p>Put after "+noteInstance.text+"</p>";
	return div;
}

function nbox_ed_getNoteElementEditor(noteInstance)
{
	var edit = bmco_gui_buttonCreate("Edit", "nbox_ed_filloutLoad('edit', '"+noteInstance.nid+"')");
	var move = bmco_gui_buttonCreate("Move", "nbox_ed_noteMove('"+noteInstance.nid+"')");
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

function nbox_ed_noteFast()
{
	var text = document.getElementById("fastNoteText").value;
	nbox_ed_noteAdd(text);
	bmco_xml_xmldocTextToClipboard(GLOBAL_xmldoc, gui=false);
	bmco_urlOpen(SETTING_neocitiesXmlFileEditLink);


}

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
	GLOBAL_xmldoc.childNodes[0].appendChild(noteXml);

	nbox_appendNoteToTarget(note, document.getElementById("nbox_target"));
	bmco_gui_filloutHide("noteTextFillout");
}

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


function nbox_ed_noteDeletePopup(nid)
{
	bmco_gui_popupConfirm("Delete this note?", "nbox_ed_noteDelete('"+nid+"')");
}

function nbox_ed_noteDelete(nid)
{
	bmco_gui_popupClose();
	bmco_xml_nodeDeleteByChildTagText(GLOBAL_xmldoc, "note", "nid", nid);
	nbox_ed_noteDivRemove(nid);
}

function nbox_ed_noteMove(nid)
{
	nbox_ed_bottombarLoad("moving", nid);
	nbox_ed_moveMarkersVisible(true);
	document.getElementById("nbox_note_"+nid).style.display = "none";
	document.getElementById("nbox_noteMoveMarker_"+nid).style.display = "none";
	document.getElementById("movedNoteId").value = nid;
	
	
}

function nbox_ed_noteMoveTo(nidTo, nidMoved=document.getElementById("movedNoteId").value)
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

	if (nidTo == "start")
	{
		bmco_xml_nodePutAtEnd(GLOBAL_xmldoc, "note", "nid", nidMoved);
		return; // end of <data> = most recent note
	}

	bmco_xml_nodePutBefore(GLOBAL_xmldoc, "note", "nid", nidMoved, nidTo);
	
	
}

function nbox_ed_noteMoveEnd(nid=undefined)
{
	nbox_ed_bottombarLoad("normal");
	nbox_ed_moveMarkersVisible(false);
	if (nid == undefined)
		return
	document.getElementById("nbox_note_"+nid).removeAttribute("style");
	document.getElementById("nbox_noteMoveMarker_"+nid).removeAttribute("style");
}






function nbox_ed_moveMarkersVisible(vis)
{
	var markers = document.getElementsByClassName("nbox_noteMoveMarker");
	for (var t = 0; t < markers.length; t++)
	{
		if (vis)
			markers[t].style.display = "block";
		else
			markers[t].removeAttribute("style");

	}
}













function nbox_ed_bottombarLoad(mode="normal", nid=undefined)
{
	nameFnTuples = [];

	if (mode == "normal")
	{
		nameFnTuples.push(["Copy XML", "bmco_xml_xmldocTextToClipboard(GLOBAL_xmldoc)"]);
		nameFnTuples.push(["Update XML", "alert('update xml')"]);
	}
	else if (mode == "moving")
	{
		nameFnTuples.push(["Cancel", "nbox_ed_noteMoveEnd('"+nid+"')"]);
	}

	bmco_gui_bottomBarPopulate(nameFnTuples, "mainBottomBar");


}
function nbox_ed_filloutLoad(mode, nid="")
{

	nameFnTuples = [["Cancel", "bmco_gui_filloutHide('noteTextFillout')"]];
	if (mode == "new")
	{
		document.getElementById("noteText").value = "";
		nameFnTuples.push(["Add", "nbox_ed_noteAdd()"]);
	}
	else if (mode == "edit")
	{
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



function nbox_ed_startup(file="./nbox_files/data.xml", editor=false)
{
	nbox_ed_bottombarLoad();
	bmco_xml_awaitXmlFromFile(file).then(function(xmldoc){
		var notes = xmldoc.getElementsByTagName("note");
		nbox_renderNotes(nbox_notesXmlToNoteInstances(notes));
		GLOBAL_xmldoc = xmldoc;
	});
}

