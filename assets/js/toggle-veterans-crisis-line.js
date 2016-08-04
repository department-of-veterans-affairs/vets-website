$(function() {
  var toggleVCL = function(e) {
    e.preventDefault();
    // Only affects Desktop version of the Veterans Crisis line.
    // Mobile is handled via menu.js and works with all overlays.
    $(this).parents('.va-crisis-panel').toggleClass('va-crisis-panel--open');
  }
  $('.va-crisis-line--notouch').on('click', function() {
  	toggleVCL;

  	if ($(this).parents('.va-crisis-panel').hasClass('va-crisis-panel--open')) {
  		window.dataLayer.push({ event: 'vcl-opened' });
  	} else {
  		window.dataLayer.push({ event: 'vcl-closed' });
  	}
  });
});


