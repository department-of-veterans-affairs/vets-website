$(document).ready(function() {

	function toggleOverlay(event) {
	  event.preventDefault();
	  
	  // Let overlay be _either_ the value of 
	  // - href attribute
	  // - data-show attribute
	  // - The button's ancestor element, .va-overlay
	  // Only one of these should ever be defined per button.
	  
	  var overlay = $(this).attr('href') || $(this).data('show') || $(this).parents('.va-overlay');
	  
	  if( $(overlay).hasClass('va-overlay--open')) {
	  
	    $(overlay).toggleClass('va-overlay--open', false);
	    $(overlay).toggleClass('va-overlay--closed', true);
		
		} else {
		
		  $(overlay).toggleClass('va-overlay--closed', false);
	    $(overlay).toggleClass('va-overlay--open', true);
		
		}
	}

  $('.va-overlay-trigger, .va-overlay-close').on('click', toggleOverlay);
});
