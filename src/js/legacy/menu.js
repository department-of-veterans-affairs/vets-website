document.addEventListener('DOMContentLoaded', () => {
  const overlays = document.querySelectorAll('.va-overlay-trigger, .va-overlay');

  const toggleOverlay = (domEvent) => {
    const overlayTarget = domEvent.currentTarget; // The overlay to open or close
    const clickTarget = domEvent.target; // The element clicked
    
    /* 
    overlayId will be _either_    
    - The value of element.getAttribute('href')
    - The value of element.dataset.show
    
    A .va-overlay-trigger element should have either a data-show attribute 
    (preferred) or an href attribute.
    */
    const overlayId = overlayTarget.getAttribute('href') || overlayTarget.dataset.show;
   
    if (overlayTarget.classList.contains('va-overlay') &&
        clickTarget.classList.contains('va-overlay-close')) {
          overlayTarget.classList.remove('va-overlay--open');
    } else if(overlayId) {
        document.querySelector(overlayId).classList.add('va-overlay--open');
    }
  }   

  Array.from(overlays).map((ol) => {
    ol.addEventListener('click', toggleOverlay);
  });
});
