import '@department-of-veterans-affairs/platform-polyfills';
import '../sass/simple-forms-form-engine.scss';

import React from 'react';
import { startAppFromIndex } from '@department-of-veterans-affairs/platform-startup/exports';
import reducer from '../reducers';
import FormRenderer from '../containers/FormRenderer';
import { removeTrailingSlash } from './string';

export default ({ formId, rootUrl, trackingPrefix = null, breadcrumbs }) => {
  const rootUrlNoTrailingSlash = removeTrailingSlash(rootUrl);

  startAppFromIndex({
    url: rootUrlNoTrailingSlash,
    reducer,
    component: (
      <FormRenderer
        formId={formId}
        rootUrl={rootUrlNoTrailingSlash}
        trackingPrefix={trackingPrefix}
        breadcrumbs={breadcrumbs}
      />
    ),
  });
};
