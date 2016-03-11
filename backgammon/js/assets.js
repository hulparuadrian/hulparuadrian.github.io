function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

Element.prototype.setAttributes = function (attrs) {
	for(var key in attrs) {
		this.setAttribute(key, attrs[key]);	
	}
} 

Element.prototype.removeAttributes = function (attrs) {
	for(var i = 0; i < attrs.length; i++) {
		this.removeAttribute(attrs[i]);	
	}
} 