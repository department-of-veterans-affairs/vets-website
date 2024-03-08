import 'core-js/features/promise';
import '@department-of-veterans-affairs/component-library/dist/main.css';
import {
  applyPolyfills,
  defineCustomElements,
} from '@department-of-veterans-affairs/component-library';

// Don't initialize web components on saved pages because this causes the
// content to become hidden. It does end up breaking the styling, but this is
// better than not being able to see the internal content
if (window.location?.protocol !== 'file:') {
  applyPolyfills().then(() => {
    defineCustomElements();
  });
}
