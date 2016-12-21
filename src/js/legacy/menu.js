document.addEventListener('DOMContentLoaded', () => {
  const overlays = document.querySelectorAll('.va-overlay-trigger, .va-overlay');

  const toggleOverlay = (domEvent) => {
    domEvent.preventDefault();
    const clickTarget = domEvent.currentTarget;

    /* 
    overlay will be _either_    
    - A .va-overlay parent with a .va-overlay-close child
    - The value of element.getAttribute('href')
    - The value of element.dataset.show
    
    A .va-overlay-trigger element should have either a data-show attribute 
    (preferred) or an href attribute.
    */
    let overlay;

    if (clickTarget.classList.contains('va-overlay')) {
        overlay = clickTarget;
    } else {
        const overlayId = domEvent.currentTarget.getAttribute('href') || domEvent.currentTarget.dataset.show;
        overlay = document.querySelector(overlayId);
    }
    
    overlay.classList.toggle('va-overlay--open');
  }   

  Array.from(overlays).map((ol) => {
    ol.addEventListener('click', toggleOverlay);
  });
});
