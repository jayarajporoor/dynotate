$(function()
{
	$('#dynotate').click(function(e) {
	  chrome.tabs.executeScript(null, {file: "content_script.js"});
	});
});

