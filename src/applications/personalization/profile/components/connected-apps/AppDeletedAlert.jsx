import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from '~/platform/utilities/ui';

export const AppDeletedAlert = ({ title, privacyUrl }) => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

  return (
    <div tabIndex="-1" data-focus-target className="vads-u-margin-y--4">
      <va-alert
        status="success"
        backgroundOnly
        class="vads-u-padding-bottom--0 vasd-u-margin-bottom--2"
        uswds
      >
        <p className="vads-u-margin-y--0" role="alert" aria-live="polite">
          We disconnected {title} from your VA.gov profile. If you have
          questions about data the app has already collected, review the app’s
          privacy policy or contact customer support.
        </p>
        <a href={privacyUrl} target="_blank" rel="noopener noreferrer">
          Review the {title} privacy policy.
        </a>
      </va-alert>
    </div>
  );
};

AppDeletedAlert.propTypes = {
  id: PropTypes.string.isRequired,
  privacyUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
