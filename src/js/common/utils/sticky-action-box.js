$(function() {
  var $actionBox  = $('.show-for-large-up .sticky-action-box'),
    $window    = $(window),
    offset     = $actionBox.offset();

	$window.scroll(function() {
    if ($window.scrollTop() > offset.top) {
      $actionBox.css({
      	position: "fixed",
      	right: ($window.width()-1000)/2
      });
    } else {
      $actionBox.css({
      	position: "absolute",
      	right: 0
      });
    }
  });
});
