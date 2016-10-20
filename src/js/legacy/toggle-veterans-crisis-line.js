$(function() {
  var toggleVCL = function(e) {
    e.preventDefault();
    // Only affects Desktop version of the Veterans Crisis line.
    // Mobile is handled via menu.js and works with all overlays.
    $(this).parents('.crisis-line-container').toggleClass('va-crisis-panel--open');
  }
  $('a.va-overlay-trigger').on('click', toggleVCL);
});
