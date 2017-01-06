/*
This script only affects the DESKTOP/WIDESCREEN version
of the Veteran's Crisis Line trigger
*/
document.addEventListener('DOMContentLoaded', () => {
  const vcls = document.querySelectorAll('.crisis-line-container--wide');
  const toggleVcl = (vcl) =>
    vcl.addEventListener('click', (domEvent) => {
      // Check that it was the va-crisis-line trigger element clicked
      if(domEvent.target.classList.contains('va-crisis-line')) {
        domEvent.preventDefault();
        domEvent.currentTarget.classList.toggle('va-crisis-panel--open');
      }
    }); 

  [].map.call(vcls, toggleVcl);
});
