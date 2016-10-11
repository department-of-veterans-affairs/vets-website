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