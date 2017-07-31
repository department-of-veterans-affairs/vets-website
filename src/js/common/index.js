// polyfills are loaded in vendor chunk
require('./polyfills');

require('./sentry.js');

// Used in the footer.
require('../legacy/menu.js');
require('./utils/sticky-action-box.js');

// New navigation menu
require('../legacy/mega-menu.js');

// Disable scrolling on input[type="number"] because it was changing the value unexpectedly
document.addEventListener('wheel', (event) => {
  if (event.target.type === 'number' && document.activeElement === event.target) {
    event.preventDefault();
    document.body.scrollTop += event.deltaY;
  }
});
