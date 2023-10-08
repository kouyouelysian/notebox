# NoteBox (NBox) [PRE-ALPHA, TESTING ONLY!!!]

## WHAT, WHY, WHERE

NoteBox is an instant-deployment simple text blog package for [neocities.org](https://neocities.org) - a free, nice and non-corporate place for hosting and editing your own website. Its joy and demise is that it has no backend whatsoever; you cannot use php or backend JS or anything like that, making it hard to develop any kind of dynamically updated systems with login forms or anything like that. This probably is to remove the misuse threat completely, as having no backend means 1. no weak security applications will be deployed and 2. no resource-hungry stuff is made. As a bonus, this adds to the overall static nature of neocities. But then, how to go about having such a bread-and-butter thing as a blog you can post to, without having to edit raw HTML for each post or using some makeshift JS magick?

This is where NBox comes into play. I made this solution so that one could easily roll out and manage a blog instance their own, no coding required. It comes with an editor that allows to easily manage (add, edit, delete, rearrange) your notes (that's how i called posts in code, so, now i roll with it). NBox uses an .xml file as its data store; i KNOW that .xml is a transport format and not a database. However, with quite slow update rates (20 posts per day VS thousands of tweets per hour) and access rates (maybe like 400 visits per day vs millions of users at once), it's OK to work around neocities' backendlessness like that. The .xml file stores your posts in a chronological order. They are editable and reorderable via the bundled editor interface. After you're done editing, simply update the .xml file. The .xml neocities file editor is opened automatically when you're done editing, and new XML is already stored in your clipboard. Clunkier than using a conventional social media for this stuff, but better than having your info erased by moderators or losing your account because you made a joke about some stinky billionaire.

## STEP BY STEP ROLLOUT GUIDE

### 1. Load the package contents to neocities.
[Download the package](https://github.com/kouyouelysian/nbox/archive/refs/heads/main.zip) from this github page and deploy it to your Neocities. This means extracting the zip file you just got, going to Neocities dashboard view (the thing where you can make and delete files, etc), and drag-n-dropping stuff to the location where you want your blog to be. Do note: you have to upload the files next to the page you want your blog at. So, if you want your blog at /subpages/blog/index.html, you upload the files to /subpages/blog/. Upload all the files to the **same Neocities site folder**. Upload folders one by one, **DO NOT GROUP-LOAD FOLDERS** - neocities has a bug with that. You have to upload the following:
- folders (drag and drop one by one to load a folder with all its contents):
    - nbox_code
    - nbox_files
    - nbox_style
    - nbox_user
- files (basically, upload all .html files from the package):
    - editor.html
    - index.html (*OPTIONAL!!! If you already have a page that you just want to add a blog to, do NOT upload this file, and pay attention to step 4*)

### 2. Open a specific page in a new tab
In neocities dashboard view (with the folders and all) where you just uploaded the stuff, you have to open (right click + open in new tab for most browsers) the 'files' folder to a new tab. Click on 'edit' next to 'data.xml' - an editor will pop up. you don't have to edit anything; just keep it open. Keeping this tab open, go back to the initial tab with the dashboard view.

### 3. Edit user/settings.js
This is the hardest thing you have to do here - this will enable the notebox editor to redirect you automatically, saving you time. Navigate to the "user" folder, then press "edit" next to "settings.js". there is a text line that you have to edit:

    SETTING_neocitiesXmlFileEditLink = "pastelinkhere";


The **pastelinkhere** has to be replaced with an actual link. Go to the tab you opened in step 2 (.xml file neocities editor), copy its address from the address bar up above. Now, paste it inbetween the quotation marks. The line should look something like this at the end:

    SETTING_neocitiesXmlFileEditLink = "https://neocities.org/site_files/blog/files/data.xml";

Save the file (ctrl/cmd + S or click the red "save" button) and return to the dashboard view by pressing 'dashboard' at top left corner. Now the bundled gallery editor that helps you edit the image names, infos and groups, will be able to easily redirect you to the artwork upload page and XML update page upon clicking a button.

If you didn't have an index page at that location before, and used the bundled one - you're all done! You can now view index.html for your blog output, and access editor.html to manage your notes.

### 4. Hooking up NBox to existing page

If you already have a nice page, and it has a `<div>` you want your blog to be displayed inside, you should change the `<div>`'s id to `"nbox_target"`. If it already has an id assigned and you cannot alter it, then go to *user/settings.js* and edit the `SETTING_targetId` key: put your blog target div's id into quotation marks instead of `nbox_target`. Now NBox will automatically target the element you pointed it to.

You also should hook up the NBox code to your page. Right before the end of the `<body>` tag in your page, please, paste the following lines:

	<!--scripts start-->
	<script type="text/javascript" src="./nbox_user/settings.js"></script>
	<script type="text/javascript" src="./nbox_user/renderer.js"></script>
	<script type="text/javascript" src="./nbox_code/bmco_general.js"></script>
	<script type="text/javascript" src="./nbox_code/bmco_xml.js"></script>
	<script type="text/javascript" src="./nbox_code/nbox_main.js"></script>
	<script type="text/javascript">nbox_startup()</script>
	<!--scripts end-->

You can also find these lines at the end of bundled index.html - once you hook up this code to your page and have a valid target `<div>` in it, it should work off the bat!

### 5. Styling

By default, NoteBox assigns every note (or post, if you must) to class `nbox_note`. There are no rules assigned to it within the package contents. You can use this to style your blog entries in your own stylesheets like so:

    .nbox_note {
      color: red;
    }

If you wish to further style the notes, and render them not in the default way (`<p>`aragraphs, expected to be inside a `<div>`) - look inside the *user/renderer.js* file.

## BLOG MANAGEMENT TUTORIAL

### 1. Make sure you're logged in to neocities.org
As stupid as it sounds, are you logged in? Log in if not. Security of your XML "database" relies on the security of your neocities.org session. 

### 2. Access editor
Neocities doesn't allow writing to files in any way but manually, by accessing the file editor through the dashboard. However, we speed up the process by reaching a user interface for facilitating the addition and editing of your notes. Access *editor.html* in the folder you uploaded the package contents to at Neocities.

### 3. Add a new note
You see a text area, and a "POST!" button. Write whatever you like into the box and press the button! A new tab will pop up, with an open text editor of "data.xml". The editor already put the updated XML text to your clipboard, so you just have to replace the old one with it. By doing this, you're replacing your old "database" with an updated version, containing the new note. Select everything in the editor (right click on the editing window, 'select all' - or the ctrl-A/cmd-A keyboard shortcut) and delete it with the backspace. Then paste the new text (right click + paste or ctrl-V/cmd-V). Save the file by pressing 'save' on top right or using ctrl-S/cmd-S. Done, you updated your website's "database"!

### 4. Verify!
Check your website! Your new stuff should now be inside the `<div>` you pointed NBox to!

### 5. Edit your note
Access editor.html again. Locate the "Full editor" tab on top of the main area and click on it. You are now in full-power editing mode! Press "Edit" on top of the note you just made. A window pops up, prompting you to edit the text. Once done, click "Update" - this will close the prompt. You can also delete, move, and add new notes in this editor.

### 6. Update XML
Press the "update xml" button. A similar thing as in step 2 should happen; just replace the old XML with the new one - it's already in your clipboard. If you somehow messed up, or want to get the XML text without opening the file editor, you can press "Copy XML" instead - it will just copy the XML containing your edits to your clipboard.

*Note: generally it's a bad idea to use XML as a database, but for such low access and update rates and lack of backend, it will do.*

If it doesn't work: my bad, probably :D contact me and we will see what's wrong. This is a one person project and all sorts of stuff may happen. --> [tell me what went wrong](https://astrossoundhell.neocities.org/data/links/)

## CUSTOMIZATION

### Basic

All notes are assigned to `nbox_note` class. Use it to style your entries like so:

       .nbox_note {
          color: red;
        }

The blog window itself has id `nbox_target` by default. You can use it in your css to style the blog window:

    #nbox_target {
    	background-color: black;
    }
*Note: if you changed `SETTING_targetId`, you should target your custom id instead.*

### Advanced
In the neocities file browser, access *user/renderer.js* - it contains instructions on writing your own routine for note rendering, overriding the default plain `<p>`aragraph-per-note one.

## UPDATING

Assuming you're running this on neocities.org as intended, you just have to download the [freshest package zip](https://github.com/kouyouelysian/notebox/archive/refs/heads/main.zip), in your neocities nbox instance - delete the following

- folders: code
- files: editor.html

and replace them with the same files/folders from the new package. If all goes right, everything should start working off the bat. Everything broke, bad and sucks? [Tell me what's up](https://astrossoundhell.neocities.org/data/links/).




