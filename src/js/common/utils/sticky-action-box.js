// $(function() {
//   var $actionBox = $('.show-for-large-up .sticky-action-box'),
//     $window = $(window),
//     offset = $actionBox.offset();

// 	$window.scroll(function() {
//     if ($window.scrollTop() > offset.top) {
//       $actionBox.css({
//       	position: "fixed",
//       	right: ($window.width()-1000)/2
//       });
//     } else {
//       $actionBox.css({
//       	position: "absolute",
//       	right: 0
//       });
//     }
//   });
// });

window.onload = function() {
  const actionBox = document.querySelectorAll('.show-for-large-up .sticky-action-box')[0],
    offset = actionBox.getBoundingClientRect();

  window.addEventListener('scroll', function() {
    if (document.body.scrollTop > offset.top) {
      actionBox.style.position = "fixed";
      actionBox.style.right = (document.body.offsetWidth-1000)/2 + "px";
    } else {
      actionBox.style.position = "absolute";
      actionBox.style.right = 0;
    }
  });
};