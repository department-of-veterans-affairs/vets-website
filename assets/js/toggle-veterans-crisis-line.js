$(function() {
  var toggleVCL = function(e) {
    e.preventDefault();
    console.log( $(this).parents('.va-crisis-panel').toggleClass('va-crisis-panel--open') );
  }
  $('.va-crisis-line--notouch').on('click', toggleVCL);
});

