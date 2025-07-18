import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { focusElement } from 'platform/utilities/ui';
import { scrollToTop } from 'platform/utilities/scroll';
import ApplicationDownloadLink from '../ApplicationDownloadLink';

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

      <va-summary-box class="vads-u-margin-bottom--4" uswds>
        <h3 slot="headline">Your application information</h3>

        <h4>For Veteran</h4>
        <p
          className="hca-veteran-fullname dd-privacy-mask"
          data-dd-action-name="Veteran name"
        >
          {name}
        </p>

        {timestamp && (
          <>
            <h4>Date you applied</h4>
            <p
              className="hca-application-date dd-privacy-mask"
              data-dd-action-name="application date"
            >
              {format(new Date(timestamp), 'MMM. d, yyyy')}
            </p>
          </>
        )}

        <h4>Confirmation for your records</h4>
        <p>You can print this confirmation page for your records.</p>

        <div className="vads-u-margin-y--2">
          <va-button
            text="Print this page"
            onClick={() => window.print()}
            data-testid="hca-print-button"
            uswds
          />
        </div>
        <div className="hca-application--download">
          <ApplicationDownloadLink />
        </div>
      </va-summary-box>
    </>
  );
};

ConfirmationScreenView.propTypes = {
  name: PropTypes.object,
  timestamp: PropTypes.object,
};

export default ConfirmationScreenView;
