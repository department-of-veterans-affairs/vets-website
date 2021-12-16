import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export const AppDeletedAlert = props => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

  const { title, privacyUrl } = props;
  const privacyLink = (
    <a href={privacyUrl} target="_blank" rel="noopener noreferrer">
      Review the {title} privacy policy
    </a>
  );
  const alertMessage = (
    <>
      <span>
        We disconnected {title} from your VA.gov profile. If you have questions
        about data the app has already collected, review the app’s privacy
        policy or contact customer support.
      </span>
      <p>{privacyLink}</p>.
    </>
  );
  return (
    <div tabIndex="-1" data-focus-target className="vads-u-margin-y--4">
      <AlertBox
        status="success"
        backgroundOnly
        className="vads-u-padding-bottom--0"
      >
        <div className="vads-u-display--flex">
          <i
            aria-hidden="true"
            className="fa fa-check-circle vads-u-padding-top--0p5 vads-u-margin-right--1"
          />
          <p className="vads-u-margin-y--0" role="alert" aria-live="polite">
            {alertMessage}
          </p>
        </div>
      </AlertBox>
    </div>
  );
};

AppDeletedAlert.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  dismissAlert: PropTypes.func.isRequired,
  privacyUrl: PropTypes.string.isRequired,
};
