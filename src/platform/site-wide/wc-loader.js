import 'core-js/features/promise';
import '@department-of-veterans-affairs/component-library/dist/main.css';
import {
  applyPolyfills,
  defineCustomElements,
} from '@department-of-veterans-affairs/web-components/loader';

applyPolyfills().then(() => {
  defineCustomElements();
});
