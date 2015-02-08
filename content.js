function type(o){
	return Object.prototype.toString.call(o).slice(8,-1).toLowerCase();
}

function loadCss(path){
	if( type(path) === 'array' ){
		return path.map(function(p){
			return loadCss(p);
		});
	}

	var link = document.createElement('link');
	link.setAttribute('rel','stylesheet');
	link.setAttribute('type','text/css');
	link.setAttribute('href',path);
	document.head.appendChild(link);
	return link;
}

function htmlFilter(s){
	return s.replace(/&/g,'&amp;')
			.replace(/</g,'&lt;')
			.replace(/>/g,'&gt;')
			.replace(/ /g,'&nbsp;')
			.replace(/\'/g,'&#39')
			.replace(/\"/g,'&quot;')
}

(function(){
	function isScriptFile(){
		if( document.body.firstElementChild.tagName.toLowerCase() === "pre" && /\.js$/.test(location.pathname) ){
			return true;
		}
		return false;
	}

	var file = isScriptFile();
	if( file ){
		var scriptNode = document.getElementsByTagName('pre')[0],
			script = scriptNode.innerText;

		var code = js_beautify(script),
			container = document.createElement('pre');

		// use dom.innerText here caused a problem that google-code-prettify detected the code as a single line
		container.innerHTML = htmlFilter(code);
		document.body.appendChild(container);
		scriptNode.style.display = 'none';

		// google-code-prettify takes a long time to analysis and write dom
		if( code.length < '32768' || window.confirm('文本高亮需要较长时间，是否继续？') ){
			container.classList.add('prettyprint');
			container.classList.add('linenums');
			loadCss([
				chrome.extension.getURL('bootstrap-light-prettify.css'),
				chrome.extension.getURL('style.css')
			]);
		}
	}
})();
