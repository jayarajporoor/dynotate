var baseUrl = "https://localhost:3000/js";

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

function init0()
{
    var style = 
			[ "div.callout",
			"{",
				"position: absolute;",
				"top: 0;",
				"left: 0;",
				//"z-index: 9997;",
				"background-color: #ffffc0;",
				"text-align: center;",
				"line-height: 1.5em;",
				"-webkit-border-radius: 30px;",
				"-moz-border-radius: 30px;",
				"border-radius: 30px;",
				"-webkit-box-shadow: 2px 2px 4px #888;",
				"-moz-box-shadow: 2px 2px 4px #888;",
				"box-shadow: 2px 2px 4px #888;",
				"display:inline-block;",
				"width:20em;",
				"height:auto;",
				"overflow:hidden;",
			"}",
			"div.arrow",
			"{",
				"content: ' ';",
				"position: absolute;",
				"width: 0;",
				"height: 0;",
				"left: 15px;",
				"top: 0px;",
				"border: 10px solid;",
				//"z-index: 9998;",
				"border-color: transparent transparent #ffffc0 #ffffc0;",
				//top right bottom left
			"}",
			".redborder",
			"{",
				"border-color: red  !important",
				"border-width: 1px  !important",
				"border-style: solid !important" ,
			"}"
			].join("\n");
	var css = document.createElement("style");
	css.type = "text/css";
	code = ".scallImage:hover {cursor:pointer }";
	if(css.styleSheet)
		css.styleSheet.cssText = style;
	else
		css.innerHTML = style;
	document.getElementsByTagName("head")[0].appendChild( css );	
	
	loadScript(baseUrl + "/thirdparty/jquery.xpath.js", init1_0);
}

function init1_0()
{
	loadScript(baseUrl + "/thirdparty/jquery.visible.js", init1_1);
}

function init1_1()
{
	loadScript(baseUrl + "/thirdparty/jquery-ui-1.10.4.custom.js", init1);
}

function init1()
{
	loadScript(baseUrl + "/init.js", init2);
}


function init2()
{
	loadScript(baseUrl + "/site.js", init3);
}

function init3()
{
}

loadScript(baseUrl + "/thirdparty/jquery-1.11.0.js", init0);
