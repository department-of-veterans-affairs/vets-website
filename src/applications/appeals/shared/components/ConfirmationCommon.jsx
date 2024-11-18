import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import scrollTo from '@department-of-veterans-affairs/platform-utilities/scrollTo';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';

export const ConfirmationTitle = ({ pageTitle }) => (
  <div className="print-only">
    <img
      src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
      alt="VA logo"
      width="300"
    />
    <h2 className="vads-u-margin-top--0">{pageTitle}</h2>
  </div>
);

ConfirmationTitle.propTypes = {
  pageTitle: PropTypes.string,
};

export const ConfirmationAlert = ({ alertTitle, alertContent }) => {
  const alertRef = useRef(null);

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo('topScrollElement');
        // delay focus for Safari
        waitForRenderThenFocus('va-alert h2', alertRef.current);
      }
    },
    [alertRef],
  );

  return (
    <div>
      <va-alert status="success" ref={alertRef}>
        <h2 slot="headline">{alertTitle}</h2>
        {alertContent}
      </va-alert>
    </div>
  );
};

ConfirmationAlert.propTypes = {
  alertContent: PropTypes.element,
  alertTitle: PropTypes.string,
};

export const ConfirmationReturnLink = () => (
  <div className="screen-only vads-u-margin-top--4">
    <a className="vads-c-action-link--green" href="/">
      Go back to VA.gov
    </a>
  </div>
);
