import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import ApplicationDownloadLink from '../ApplicationDownloadLink';

const ConfirmationScreenView = ({ form, name, timestamp }) => {
  useEffect(() => {
    focusElement('.caregiver-success-message');
    scrollToTop();
  }, []);

  return (
    <>
      <div className="caregiver-success-message vads-u-margin-bottom--4">
        <va-alert status="success" uswds>
          <h2 slot="headline" className="vads-u-font-size--h3">
            Thank you for completing your application
          </h2>
          <div>
            Once we’ve successfully received your application, we’ll contact you
            to tell you what happens next in the application process.
          </div>
        </va-alert>
      </div>

      <va-summary-box class="vads-u-margin-bottom--4" uswds>
        <h3 slot="headline">Your application information</h3>

        <h4>Veteran’s name</h4>
        <p data-testid="cg-veteran-fullname">
          {name.first} {name.middle} {name.last} {name.suffix}
        </p>

        {timestamp ? (
          <>
            <h4>Date you applied</h4>
            <p data-testid="cg-submission-date">
              {moment(timestamp).format('MMM D, YYYY')}
            </p>
          </>
        ) : null}

        <h4>Confirmation for your records</h4>
        <p>
          You can print this confirmation page for your records. You can also
          download your completed application as a{' '}
          <dfn>
            <abbr title="Portable Document Format">PDF</abbr>
          </dfn>
          .
        </p>

        <div className="vads-u-margin-y--2">
          <va-button
            text="Print this page"
            onClick={() => window.print()}
            data-testid="cg-print-button"
            uswds
          />
        </div>

        <div className="caregiver-application--download">
          <ApplicationDownloadLink form={form} />
        </div>
      </va-summary-box>
    </>
  );
};

ConfirmationScreenView.propTypes = {
  form: PropTypes.object,
  name: PropTypes.object,
  timestamp: PropTypes.object,
};

export default ConfirmationScreenView;
