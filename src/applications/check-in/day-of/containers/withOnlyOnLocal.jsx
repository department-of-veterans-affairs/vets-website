import React from 'react';
import { compose } from 'redux';

import environment from 'platform/utilities/environment';

const withOnlyOnLocal = WrappedComponent => props => {
  if (!environment.isLocalhost()) {
    return <></>;
  } else {
    return <WrappedComponent {...props} />;
  }
};

const composedWrapper = compose(withOnlyOnLocal);
export default composedWrapper;
