import 'web-components/dist/component-library/component-library.css';
import { applyPolyfills, defineCustomElements } from 'web-components/loader';

applyPolyfills().then(() => {
  defineCustomElements();
});
