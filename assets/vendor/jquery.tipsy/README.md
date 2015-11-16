jquery.tipsy
============

Tipsy is a jQuery plugin for creating tooltips.

Usage
-------
__HTML:__

Include the jquery.tipsy styles file in your html page.
~~~~ html
<link href="./css/jquery.tipsy.css" type="text/css" rel="stylesheet" />
~~~~
Include the jQuery library and jquery.tipsy script file in your html page.
~~~~ html
<script src="http://code.jquery.com/jquery-latest.min.js"></script>
<script src="./js/jquery.tipsy.min.js"></script>
~~~~
Create an Element with title.
~~~~ html
<a href="http://google.com" title="Simple Tooltip"></a>
~~~~
__Javascript:__

The plugin is named "tipsy" and can be applied to an element. You will probably also specify some options while applying the plugin.
~~~ javascript
$('a[title]').tipsy({
      arrowWidth: 10, //arrow css border-width + margin-(left|right), default is 5 + 5
      attr: 'data-tipsy', //default attributes for tipsy - data-tipsy-position | data-tipsy-offset | data-tipsy-disabled
      cls: null, //tipsy custom class
      duration: 150, //tipsy fadeIn, fadeOut duration
      offset: 7, //tipsy offset from element
      position: 'top-center', //tipsy position - top-left | top-center | top-right | bottom-left | bottom-center | bottom-right | left | right
      trigger: 'hover', // how tooltip is triggered - hover | focus | click | manual
      onShow: null, //onShow event
      onHide: null //onHide event
})
~~~~

Features
-------
__trgigger Options:__

jQuery Manual Triggering. Works only when option trigger is 'manual':
* $('a[title]').tipsy("show");
* $('a[title]').tipsy("hide");
* $('a[title]').trigger("tipsy.show");
* $('a[title]').trigger("tipsy.hide");

__attribute Options:__

Form element attributes:
* data-title
* data-tipsy-disabled
* data-tipsy-position
* data-tipsy-offset

Bugs
-------
* On 'hover' trigger when element disappears, tipsy doesn't disappear too

License
-------
> Licensed under <a href="http://opensource.org/licenses/MIT">MIT license</a>.
