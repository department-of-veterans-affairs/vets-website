$(function() {
  var toggleVCL = function(e) {
    e.preventDefault();
    // Only affects Desktop version of the Veterans Crisis line.
    // Mobile is handled via menu.js and works with all overlays.
    $(this).parents('.va-crisis-panel').toggleClass('va-crisis-panel--open');
  }
  $('.va-crisis-line--notouch').on('click', toggleVCL);
});


