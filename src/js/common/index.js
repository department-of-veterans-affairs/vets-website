// polyfills are loaded in vendor chunk
require('./polyfills');

require('./sentry.js');

// Used in the footer.
require('../legacy/menu.js');
require('./utils/sticky-action-box.js');

// New navigation menu
require('../legacy/mega-menu.js');

// Disable scrolling on input[type="number"] because it was changing the value unexpectedly
// NOTE: This also just stops the user from scrolling when hovering over a number
//  input that has focus. This isn't ideal, but until a solution is found to that,
//  this is what we've got.
document.addEventListener('mousewheel', (event) => {
  if (event.target.type === 'number' && document.activeElement === event.target) {
    event.preventDefault();
  }
});
