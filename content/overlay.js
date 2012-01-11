/*
Google Analytics Goal Copy

The purpose of this extension is to provide a mechanism to save the contents of the Google Analytics 'edit goal' page and allow
pasting those values into another 'edit goal' page.

Created By:
John Henson
Senior Web Analyst
LunaMetrics
http://www.lunametrics.com

*/

// Checks location.href and scrapes page to see if menu options and buttons should be greyed out
/* Commented out due to some people having problems with greyed out toolbar
function menuAvail(){
   var b = window.content.document.getElementById("ur_body");
  if (window.content.document.location.href.search("google.com/analytics/home") != -1 && 
		b.innerHTML.search("Enter Goal Information") != -1 ){
			m=document.getElementById('goalcopy_toolbar').getElementsByTagName('toolbarbutton');
			for (n=0;n<m.length;n++){m[n].setAttribute("disabled", "false");}
  }else{
	m=document.getElementById('goalcopy_toolbar').getElementsByTagName('toolbarbutton');
	for (n=0;n<m.length-1;n++){m[n].setAttribute("disabled", "true");}
  }
}
*/




// Initializes the "Load" buttons and menu items with the name of the goal they contain
function initTools(){
	for (var gnum = 1; gnum < 6; gnum++){
  
  try {
		var val = loadValue(gnum, 0); // 0 is index of the goal name
      }
  catch(err){
    var val = "Empty";
      }
      
    var m = document.getElementById('b_goalcopy_l'+gnum);
		if (val == "Empty") { m.label = 'Empty';} else {var gc_paste_type = loadValue(gnum, 1973); m.label = 'Paste ' +gc_paste_type+': '+val;}
	}
  
  
  /*
  try { val = getP("GC_autosavegoal"); }
  catch(err) { val = "notset";}
  
  if (val == "notset") {
    setP("GC_autosavegoal", "off");
    var a = document.getElementById('m_goalcopy_autosave');
    a.label = "Turn on Autosave";
  } else if (val == "on") {
    a = document.getElementById('m_goalcopy_autosave');
    a.label = "Turn off Autosave";
  }
  else {
   a = document.getElementById('m_goalcopy_autosave');
    a.label = "Turn on Autosave";
  }
  */
  
  window.removeEventListener("load", initTools, false);
}
// Called on a XUL TabSelect event to see if the new tab has the proper context for the buttons and enables/disables them
// Does not enable items properly when switching from a tab that is still loading to a tab that contains the Goal Form
/* Commented out due to some people having problems with greyed out toolbar
function checkContext(){
	menuAvail();
}
*/
// Event Listeners

// gBrowser.tabContainer.addEventListener("TabSelect", checkContext, false); Commented out due to some people having problems with toolbar being greyed out


/*  Commented out due to some people having problems with toolbar being greyed out
window.addEventListener("load", function() {
    var appcontent = window.document.getElementById("appcontent");
    if (appcontent) {
        appcontent.addEventListener("DOMContentLoaded", menuAvail, false);
		//appcontent.addEventListener("pagehide", menuUnavail, false);
		
    }
}, false);
*/

// Access to preferences
var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                                .getService(Components.interfaces.nsIPrefBranch);
function getP(key){ return prefs.getCharPref(key); }
function setP(key, val) { return prefs.setCharPref(key, val); }

// Save and Load a value to Preferences. 
function saveValue(gnum, val, i){
	var key = getKey(gnum, i);
	setP(key, val);
}
function loadValue(gnum, i){
	var key = getKey(gnum, i);
	var val = getP(key);
	return val;
}
// Saves each item in the Goal Form. 
// gnum is passed 1,2,3 or 4 by the buttons oncommand call in firefoxOverlay.xul to indicate which set it is
// i increments after each save
// gnum and i together form the key passed to getCharPref and setCharPref for a unique key for each value. see function getKey()
 function doGCSave(gnum) {

  var a, b;
  var val;
   /*  
  if (gnum <5){var mydivhandle = window.content.document.getElementById("GoalsUi-ROOT");
   } else { var mydivhandle = window.content.document.getElementById("filter_info");
  }
  */

if (window.content.document.getElementById("GoalsUi-ROOT")) {
  var mydivhandle = window.content.document.getElementById("GoalsUi-ROOT");
  var gc_paste_type = "Goal";
} else {
  var mydivhandle = window.content.document.getElementById("filter_info");
  var gc_paste_type = "Filter";
}
  
  a = mydivhandle.getElementsByTagName("input");
  
  saveValue(gnum, gc_paste_type, 1973);
  openFunnel();
  for (i=0; i<a.length; i++) {
    if (i==0) { // special case of first input item being goal name
    	m = document.getElementById('b_goalcopy_l'+gnum);// Sets the "Load" button to the Goal Name for identification
      val = a[0].value;
      
      m.label = 'Paste '+gc_paste_type+': '+val;
      saveValue(gnum, val, i);
      continue;
    }
    if (a[i].type == "radio" || a[i].type == "checkbox") {
      val=a[i].checked;
			saveValue(gnum, val, i);
    } else {
      val=a[i].value;
      saveValue(gnum, val, i);
    } 
  }
  
  b=mydivhandle.getElementsByTagName("select");
  for (i=0; i<b.length; i++) { 
    if (i==0){continue;} // skip Goal Position select
    val = b[i].value;
    
    j=i+200; 
    saveValue(gnum, val, j);
    
  }
}

 
function simulateClick(elId) {
var evt;
var el = elId;

evt = window.content.document.createEvent("MouseEvents");
evt.initMouseEvent("click", true, true, window,1, 0, 0, 0, 0, false, false, false, false, 0, null);
el.dispatchEvent(evt);
}

 
 function doGCLoad(gnum) { // Loads all the values into the form field that were saved by doGCSave()
 
  var a, b;
  var val;
  var fFind1, fReplace1, fFind2, fReplace2, fFind3, fReplace3;
   
  openFunnel();
   
  fFind1 = document.getElementById("f_find1").value;
  fReplace1 = document.getElementById("f_replace1").value;
  
  fFind2 = document.getElementById("f_find2").value;
  fReplace2 = document.getElementById("f_replace2").value;
  
  fFind3 = document.getElementById("f_find3").value;
  fReplace3 = document.getElementById("f_replace3").value;
   
var gc_paste_type = loadValue(gnum, 1973);

if (window.content.document.getElementById("GoalsUi-ROOT")) {
  var mydivhandle = window.content.document.getElementById("GoalsUi-ROOT");
  if (gc_paste_type == "Filter") { alert ('Error: Attempting to paste a saved filter into a goal form'); return; }
} else {
  var mydivhandle = window.content.document.getElementById("filter_info"); 
  if (gc_paste_type == "Goal") { alert ('Error: Attempting to paste a saved goal into a filter form'); return; }
}
  
  a = mydivhandle.getElementsByTagName("input");
  
  for (i=0; i<a.length; i++) {

    if (a[i].type == "radio" || a.type == "checkbox") {
      if (loadValue(gnum, i)=='true') {
   
      simulateClick(a[i]);
         // a[i].click();
      }
    } else {
      val = loadValue(gnum,i);
      if (fFind1 != "" && fReplace1 != ""){ val = val.replace( new RegExp(fFind1, "gi"), fReplace1);  }
      if (fFind2 != "" && fReplace2 != ""){ val = val.replace( new RegExp(fFind2, "gi"), fReplace2);  }
      if (fFind3 != "" && fReplace3 != ""){ val = val.replace( new RegExp(fFind3, "gi"), fReplace3);  }
      a[i].value = val;
    }
  }
  
  b = mydivhandle.getElementsByTagName("select");
  for (i=0; i<b.length; i++) {
    if (i==0){continue;} // skip Goal Position select
   j=i+200; 
    loadVal=loadValue(gnum,j);
    b[i].value = loadVal;
  }
  
  
}


function openFunnel(){ 
  var fLink;
  var fLen;
  
  fLink = window.content.document.getElementsByTagName('div'); 
  fLen = fLink.length;
  j = 0;
  
  for (i=0; i<fLen; i++) { 
    if (fLink[i].className){
      if (fLink[i].className=="funnel-create-label"|| fLink[i].className=="add-funnel-step") {
        if (fLink[i].style.display!="none")  {simulateClick(fLink[i]); j++; if (fLink[i].innerHTML=="Step 10"){break;}} 
      }
    }  
  }
}
 
 
 function doFindReplaceClear(){
  document.getElementById("f_find1").value = "";
  document.getElementById("f_replace1").value = "";
  
  document.getElementById("f_find2").value = "";
  document.getElementById("f_replace2").value = "";
  
  document.getElementById("f_find3").value = "";
  document.getElementById("f_replace3").value = "";
 }
 
 function getKey(gnum, i) { // creates a unique key for use in getting and setting preferences
   var theKey = 'ID'+i+'Gnum'+gnum;
   return theKey
 }

 function doAbout(){
 	var gcAbout = "";
	gcAbout += "<strong>Google Analytics Goal Copy</strong>\n\n";
	gcAbout += ""
		
	gBrowser.selectedTab = gBrowser.addTab("chrome://goalcopy/content/about.html");
 
 } 
 
 function doAutosave(){
   
  var val = getP("GC_autosavegoal");

  if (val == "on") {
    setP("GC_autosavegoal", "off");
    var a = document.getElementById('m_goalcopy_autosave');
    a.label = "Turn on Autosave";
  }
  else {
    setP("GC_autosavegoal", "on");
    var a = document.getElementById('m_goalcopy_autosave');
    a.label = "Turn off Autosave";
  }
 
 }
 
 
 function doClear(gnum){
    var key = getKey(gnum, 0);
    prefs.setCharPref(key, "Empty");
    for (i=1; i<400; i++){saveValue(gnum, "", i);}
    
    var m = document.getElementById('b_goalcopy_l'+gnum);
    m.label = 'Empty';
 }
 function doPasteAll(){
      
      var val = getP("GC_autosavegoal");
      if (val != "on") {
        setP("GC_autosavegoal_orig", "off");
        setP("GC_autosavegoal", "on");
      } else { setP("GC_autosavegoal_orig", "on"); }
      
try 
{ 
		  aTags = window.content.document.getElementsByTagName('a');
      for (var i = 0; i < aTags.length; i++){
      if (aTags[i]==""){continue;} // leave var off of assignments to create globals because we use these in the following functions.
        if (aTags[i].href.match('goalNumber=1')){
          _GC_g1 = aTags[i];
        }
        if (aTags[i].href.match('goalNumber=2')){
          _GC_g2 = aTags[i];
        }
        if (aTags[i].href.match('goalNumber=3')){
          _GC_g3 = aTags[i];
        }
        if (aTags[i].href.match('goalNumber=4')){
          _GC_g4 = aTags[i];
        }
      }
  
      var val1 = loadValue(1, 4);
      var val2 = loadValue(2, 4); 
      var val3 = loadValue(3, 4); 
      var val4 = loadValue(4, 4); 
      if (val1 != "Empty"){
        gBrowser.addEventListener("pageshow", _G1OnPageLoad, false);
        window.content.document.location.href = _GC_g1.href;
      } else if (val2 != "Empty"){
        gBrowser.addEventListener("pageshow", _G2OnPageLoad, false);
        window.content.document.location.href = _GC_g2.href;
      }else if (val3 != "Empty"){
        gBrowser.addEventListener("pageshow", _G3OnPageLoad, false);
        window.content.document.location.href = _GC_g3.href;
      }else if (val4 != "Empty"){
        gBrowser.addEventListener("pageshow", _G4OnPageLoad, false);
        window.content.document.location.href = _GC_g4.href;
      } else { val = getP("GC_autosavegoal_orig"); setP("GC_autosavegoal", val);}
      
} catch(err) { val = getP("GC_autosavegoal_orig"); setP("GC_autosavegoal", val); return; }

}
 
 
function _G1OnPageLoad(event){

   // removeEventListener when done with it
   gBrowser.removeEventListener("pageshow", _G1OnPageLoad, false);
   gBrowser.addEventListener("pageshow", _G1ReturnToEdit, false);
   doGCLoad(1);

}

function _G1ReturnToEdit(event){
   gBrowser.removeEventListener("pageshow", _G1ReturnToEdit, false);
   var val2 = loadValue(2, 4);
   var val3 = loadValue(3, 4); 
   var val4 = loadValue(4, 4); 
    if (val2 != "Empty"){
      gBrowser.addEventListener("pageshow", _G2OnPageLoad, false);
      window.content.document.location.href = _GC_g2.href;
    } else if (val3 != "Empty"){
        gBrowser.addEventListener("pageshow", _G3OnPageLoad, false);
        window.content.document.location.href = _GC_g3.href;
    }else if (val4 != "Empty"){
        gBrowser.addEventListener("pageshow", _G4OnPageLoad, false);
        window.content.document.location.href = _GC_g4.href;
    } else { var val = getP("GC_autosavegoal_orig"); setP("GC_autosavegoal", val);}

}

function _G2OnPageLoad(event){
      
        // removeEventListener when done with it
        gBrowser.removeEventListener("pageshow", _G2OnPageLoad, false);
        gBrowser.addEventListener("pageshow", _G2ReturnToEdit, false);
        doGCLoad(2);
      

      

   
}

function _G2ReturnToEdit(event){
   gBrowser.removeEventListener("pageshow", _G2ReturnToEdit, false);
   
   var val3 = loadValue(3, 4); 
   var val4 = loadValue(4, 4); 
    if (val3 != "Empty"){
      gBrowser.addEventListener("pageshow", _G3OnPageLoad, false);
      window.content.document.location.href = _GC_g3.href;
    } else if (val4 != "Empty"){
        gBrowser.addEventListener("pageshow", _G4OnPageLoad, false);
        window.content.document.location.href = _GC_g4.href;
    } else { var val = getP("GC_autosavegoal_orig"); setP("GC_autosavegoal", val);}
   

}

function _G3OnPageLoad(event){

   // removeEventListener when done with it
   gBrowser.removeEventListener("pageshow", _G3OnPageLoad, false);
   gBrowser.addEventListener("pageshow", _G3ReturnToEdit, false);
   doGCLoad(3);
   
}

function _G3ReturnToEdit(event){
    gBrowser.removeEventListener("pageshow", _G3ReturnToEdit, false);
    var val4 = loadValue(4, 4);
    if (val4 != "Empty"){
      gBrowser.addEventListener("pageshow", _G4OnPageLoad, false);
      window.content.document.location.href = _GC_g4.href;
    } else { var val = getP("GC_autosavegoal_orig"); setP("GC_autosavegoal", val);}
}
function _G4OnPageLoad(event){

   // removeEventListener when done with it
   gBrowser.removeEventListener("pageshow", _G4OnPageLoad, false);
   doGCLoad(4);
   var val = getP("GC_autosavegoal_orig"); setP("GC_autosavegoal", val);
}
window.addEventListener("load", initTools, false);