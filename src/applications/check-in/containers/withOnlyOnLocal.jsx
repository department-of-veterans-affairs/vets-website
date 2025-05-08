import React from 'react';
import { compose } from 'redux';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const withOnlyOnLocal = WrappedComponent => props => {
  if (!environment.isLocalhost()) {
    return <></>;
  }
  // Allowing for HOC
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <WrappedComponent {...props} />;
};

const composedWrapper = compose(withOnlyOnLocal);
export default composedWrapper;
