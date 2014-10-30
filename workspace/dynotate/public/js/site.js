function walk(node, callback) {
  var skip, tmp;
  // This depth value will be incremented as the depth increases and
  // decremented as the depth decreases. The depth of the initial node is 0.
  var depth = 0;
 
  // Always start with the initial element.
  do {
    if ( !skip ) {
      // Call the passed callback in the context of node, passing in the
      // current depth as the only argument. If the callback returns false,
      // don't process any of the current node's children.
      skip = callback(node, depth) === false;
    }
 
    if ( !skip && (tmp = node.firstChild) ) {
      // If not skipping, get the first child. If there is a first child,
      // increment the depth since traversing downwards.
      depth++;
    } else if ( tmp = node.nextSibling ) {
      // If skipping or there is no first child, get the next sibling. If
      // there is a next sibling, reset the skip flag.
      skip = false;
    } else {
      // Skipped or no first child and no next sibling, so traverse upwards,
      tmp = node.parentNode;
      // and decrement the depth.
      depth--;
      // Enable skipping, so that in the next loop iteration, the children of
      // the now-current node (parent node) aren't processed again.
      skip = true;
    }
 
    // Instead of setting node explicitly in each conditional block, use the
    // tmp var and set it here.
    node = tmp;
 
  // Stop if depth comes back to 0 (or goes below zero, in conditions where
  // the passed node has neither children nore next siblings).
  } while ( depth > 0 );
}

window.tracks = [];
function getXPath( element )
{
	var $ = window.$jqdn;
    var xpath = '';
    for ( ; element && element.nodeType == 1; element = element.parentNode )
    {
        var id = $(element.parentNode).children(element.tagName).index(element) + 1;
        id > 1 ? (id = '[' + id + ']') : (id = '');
        xpath = '/' + element.tagName.toLowerCase() + id + xpath;
    }
    return xpath;
}

function getzIndex( element )
{
	var $ = window.$jqdn;
    var zIndex = $(element).css('z-index');
    if(!isNaN(zIndex))
    	return zIndex;
    for ( ; element && element.nodeType == 1; element = element.parentNode )
    {
        zIndex = $(element).css('z-index');    	
    	if(!isNaN(zIndex))
    		return zIndex;
    }
    return 0;
}

function getPathPattern(element)
{
	var $ = window.$jqdn;
	var ppath = [];

	for(; element && element.nodeType == 1; element = element.parentNode)
	{
        var idx = $(element.parentNode).children(element.tagName).index(element) + 1;
        var tagName= element.tagName.toLowerCase();
        var entry = {"tag" : tagName,
        		     "idx" : idx
        		     };
        var attrs = element.attributes;

        for(var i=0;i< attrs.length;i++)
        {
        	var attr = attrs.item(i);
        	if(attr && attr.nodeValue !== undefined && attr.nodeValue !== false)
        	{
        		if(attr.nodeName != "id" && attr.nodeName != "style")
        		{
        			entry[attr.nodeName] = attr.nodeValue;
        		}
        	}
        }
       	ppath.unshift(entry);
	}
	return ppath;
}

function matchPathPatterns(ppath1, ppath2)
{
	var totalWeight = 0;
	var matchedWeight = 0;
	for(var k=ppath1.length-1;k >= 0;k--)
	{
		var e1 = ppath1[k];
		var e2 = ppath2[k];
		for (var f in e1)
		{
			if(!e1.hasOwnProperty(f))
				continue;
			if(e1[f] == e2[f])
				matchedWeight++;
			totalWeight++;	
		}
	}
	return matchedWeight/totalWeight;
}

function zRepositionCallout(id)
{
	var $= window.$jqdn;
	
	var lastElem = $("body:last-child");
	lastElem.after($('#' + id));
	var offset = $('#' + id).offset();
	var callout = $('#' + id);
	var h = callout.height();
	var w = callout.width();			
	for(var i =1;i<=4;i++)
	{
		var elem = $.elementFromPoint(offset.left+(w*i)/4, offset.top + (h*i)/2);
		if(elem != callout[0])
		{
			var zIndex = getzIndex(elem);
			$('#' + id).css("z-index", zIndex);
			console.log("Repositioning z-index: " + zIndex);			
		}
	}	
}

function createCallout(id, target, text)
{
	var $= window.$jqdn;
	//$("body").append
	var zIndex = getzIndex(target);
	console.log("Target Z-index: " + zIndex);
	$("body").append("<div gs='true' style='position:absolute;z-index:" + zIndex + "' id='" + id + "'>" + 
			          "<div class='callout' contentEditable='true' gs='true'>" + 
			            text + 
			            "</div>" +
				       "<div gs='true' class='arrow'></div>" +			            
			      "</div>");
	$(target).css("border-color", "red");
	$(target).css("border-width", "1px");
	$(target).css("border-style", "solid");
	var h = $('#' + id + ' .arrow').outerHeight();
	$('#' + id + ' .callout').css({top: h});
	var ignoreMouseup = false;
	$("#" + id).draggable()
	  .click(function() {
	    $(this).draggable({ disabled: false });
	}).dblclick(function() {
		ignoreMouseup = true;
	    $(this).draggable({ disabled: true });
	});
	
	$('#' + id).on("mousedown", function(event)
			{
				var elem = $('#' + id);
				var zIndex = elem.css('z-index');
				elem.attr("data-z-index", zIndex);
				elem.css('z-index', 9999);
			}
	);

	$('#' + id).on("mouseup", function(event)
			{
				elem = $('#' + id);
				var zIndex = elem.attr("data-z-index");
				if(zIndex !== undefined)
					elem.css('z-index', zIndex);
				if(ignoreMouseup)
				{
					ignoreMouseup = false;
					return;
				}
				var arrowOffset = $('#' + id + ' .arrow').offset();
				var d = $('#' + id + ' .arrow').css("display");
				$('#' + id + ' .arrow').css({"display": "none"});
				var elem = $.elementFromPoint(arrowOffset.left, arrowOffset.top);
				$('#' + id + ' .arrow').css({"display": d});				
				var target = $(elem);
				target.addClass("redborder");
				setTimeout(function(){
							target.removeClass("redborder");
						}, 2000);
				var currOffset = target.offset();
				console.log("Target top: " + currOffset.top + " arrow Top: " + arrowOffset.top);
				var top = currOffset.top + target.height();
				var width = target.width();
				if(width > 75)
					width = width/2;
				else
					width = 0;
				var left = currOffset.left + width;
				$('#' + id).css({left: left, top: top});
				zRepositionCallout(id);
				
				for(var i=0;i< window.tracks.length;i++)
				{
					var track = window.tracks[i];
					if(track.attachment ==  id)
					{
						
						var xpath = getXPath(elem);
						console.log("Old xpath: " + track.target);
						console.log("New xpath: " + xpath);
						track.target  = xpath;
						track.ppathTarget = getPathPattern(elem);
						track.targetOffset = currOffset;
					}
				}
			}); 
}

function dnSetupSite()
{
   var $ = window.$jqdn;
   $("body").on('contextmenu', function(e){return false;});
	$("body").mouseup(function(event)
		{
			//alert('hello');
			console.log("MOUSE UP EVENT");
			if(event.button != 2)
			  return;
			if($(event.target).attr('gs') == 'true')
				return;
			/*walk(document.documentElement, function(node, depth){
				if(node == event.target)
				{
					console.log("found the node: " + getXPath(node));
				}
				return true;
			});*/
			var id = new Date().getTime();
			var xpath = getXPath(event.target);
			if(alreadyAttached(xpath))
			{
			  console.log("Already attached");
			   return;
			}
			//alert(xpath);
			var offset = $(event.target).offset();
			var width = $(event.target).width();
			if(width > 75)
				width = width/2;
			else
				width = 0;
			var left = offset.left + width;
			var top  = offset.top + $(event.target).height();
			
			//alert("l=" + left + " top = " + top);
			console.log("Appending....");
			var track = {target: getXPath(event.target),
					  ppathTarget : getPathPattern(event.target),
					  attachment: id, 
					  targetOffset: offset
					  };
			window.tracks.push(track);
			
			createCallout(id, event.target, "Enter Annotation Here");
			$('#' + id).css({top:top, left:left});
			//position in z-index properly
			
			//end z-index position
			zRepositionCallout(id);
			
			//console.log("Path pattern: " + JSON.stringify(track.ppathTarget));
			//$(event.target).callout(xpath);
			//$(event.target).powerTip({placement: 'e', mouseOnToPopup: true});
			//$.powerTip.show($(event.target));
		}
	);
	
	$("body").on("DOMSubtreeModified propertychange mousewheel DOMMouseScroll mouseup", function(event) {
		//alert($(event.target).html());
		if(!window.timerRunning)
		{
			window.timerRunning = true;
		     setTimeout(function(){
				relocateTracks();
				window.timerRunning = false;				
			 }, 500);
		}
	}); 

	$(window).on("mouseup resize", function(event) {
		//alert($(event.target).html());
		if(!window.timerRunning)
		{
			window.timerRunning = true;
		     setTimeout(function(){
				relocateTracks();
				window.timerRunning = false;				
			 }, 500);
		}
	}); 
	
}


function alreadyAttached(xpath)
{
   for(var i =0;i<window.tracks.length;i++)
   {
	if(window.tracks[i].target == xpath)
	   return true;
   }
   return false;
}

function relocateTracks()
{
	var $ = window.$jqdn;
	console.log("Relocate tracks...");
	for(var i=0;i < window.tracks.length;i++)
	{
		var track = window.tracks[i];
		var target = $(document).xpath(track.target);
		var attachment = $('#' + track.attachment);
		if(target.length > 0 && target.is(":visible") && target.visible() && target.css('display') !== 'none')
		{
			if(attachment.length <= 0)
			{
				createCallout(track.attachment, target[0], track.attachmentContent);
				attachment = $('#' + track.attachment);			
			}
			var currOffset = target.offset();			
			//if((currOffset.top != track.targetOffset.top) || (currOffset.left != track.targetOffset.left))
			if(true)
			{	
				var top = currOffset.top + target.height();
				var width = target.width();
				if(width > 75)
					width = width/2;
				else
					width = 0;
				var left = currOffset.left + width;
				
				track.targetOffset = currOffset;
				console.log(track.target + ": Old top: " + track.targetOffset.top + " currTop: " + currOffset.top + " attachment Top: " + top);
				attachment.css({top:top, left: left});
			}
		}else
		if(attachment.length > 0)
		{
			console.log("Removing attachment for: " + track.target);
			track.attachmentContent = attachment.text();
			console.log("Content: " + track.attachmentContent);
			track.targetOffset.top = -1;
			track.targetOffset.left = -1;
			attachment.remove();
			//window.tracks.splice(i, 1);
			//i--;
		}
	}
}


window.$jqdn(document).ready(function()
{
	dnSetupSite();
});


var JSON = JSON || {};

JSON.stringify = JSON.stringify || function (obj) {
	var t = typeof (obj);
	if (t != "object" || obj === null) {
		// simple data type
		if (t == "string") obj = '"'+obj+'"';
		return String(obj);
	}
	else {
		// recurse array or object
		var n, v, json = [], arr = (obj && obj.constructor == Array);
		for (n in obj) {
			v = obj[n]; t = typeof(v);
			if (t == "string") v = '"'+v+'"';
			else if (t == "object" && v !== null) v = JSON.stringify(v);
			json.push((arr ? "" : '"' + n + '":') + String(v));
		}
		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
};

JSON.parse = JSON.parse || function (str) {
	if (str === "") str = '""';
	eval("var p=" + str + ";");
	return p;
};
