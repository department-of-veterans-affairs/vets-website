import Raven from 'raven-js';

import environment from './helpers/environment';

if (environment.TRACK_ERRORS) {
  const url = `${environment.BASE_URL}/js-report/0`.replace('//', '//faker@');
  console.log(url);
  Raven
    .config(url)
    .install();
}

