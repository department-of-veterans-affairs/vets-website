import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

const ConfirmationScreenView = ({ name, timestamp }) => {
  useEffect(() => {
    focusElement('.hca-success-message');
    scrollToTop();
  }, []);

  return (
    <>
      <div className="hca-success-message vads-u-margin-bottom--4">
        <va-alert status="success" uswds>
          <h2 slot="headline" className="vads-u-font-size--h3">
            Thank you for completing your application for health care
          </h2>
          <div>
            Once we’ve successfully received your application, we’ll contact you
            to tell you what happens next in the application process.
          </div>
        </va-alert>
      </div>

      <va-featured-content class="vads-u-margin-bottom--4" uswds>
        <h3 slot="headline">Your application information</h3>

        <h4>Veteran’s name</h4>
        <p
          className="hca-veteran-fullname dd-privacy-mask"
          data-dd-action-name="Veteran name"
        >
          {name}
        </p>

        {timestamp ? (
          <>
            <h4>Date you applied</h4>
            <p
              className="hca-application-date dd-privacy-mask"
              data-dd-action-name="application date"
            >
              {moment(timestamp).format('MMM D, YYYY')}
            </p>
          </>
        ) : null}

        <h4>Confirmation for your records</h4>
        <p>You can print this confirmation page for your records.</p>

        <div className="vads-u-margin-top--2">
          <va-button
            text="Print this page"
            onClick={() => window.print()}
            data-testid="hca-print-button"
            uswds
          />
        </div>
      </va-featured-content>
    </>
  );
};

ConfirmationScreenView.propTypes = {
  name: PropTypes.object,
  timestamp: PropTypes.object,
};

export default ConfirmationScreenView;
