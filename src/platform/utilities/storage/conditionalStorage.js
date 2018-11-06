import { isEmpty } from 'lodash';

import localStorage from './localStorage';

function getConditionalStorage() {
  const storageType = localStorage.getItem('storageType');

  const shouldUseLocalStorage =
    storageType === 'localStorage' || isEmpty(window.sessionStorage); // Substitute for sessionStorage in tests.

  return shouldUseLocalStorage ? localStorage : window.sessionStorage;
}

export default getConditionalStorage;
