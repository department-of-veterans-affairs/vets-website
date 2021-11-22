import 'core-js/features/promise';
import '@department-of-veterans-affairs/component-library/dist/main.css';
import {
  applyPolyfills,
  defineCustomElements,
} from '@department-of-veterans-affairs/component-library';

applyPolyfills().then(() => {
  defineCustomElements();
});
