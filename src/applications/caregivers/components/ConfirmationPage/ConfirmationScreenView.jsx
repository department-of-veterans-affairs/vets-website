/* eslint-disable no-console */
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

  console.log('Screen Props:', { form, name, timestamp });

  return (
    <>
      <div className="caregiver-success-message vads-u-margin-bottom--4">
        <va-alert status="success" class="caregiver-success-message">
          <h2 slot="headline" className="vads-u-font-size--h3">
            Thank you for completing your application
          </h2>
          <div>
            Once we’ve successfully received your application, we’ll contact you
            to tell you what happens next in the application processs.
          </div>
        </va-alert>
      </div>

      <va-alert status="info" class="vads-u-margin-bottom--4" background-only>
        <h2 slot="headline" className="vads-u-font-size--h3">
          Your application information
        </h2>
        <dl>
          <div className="vads-u-margin-bottom--2">
            <dt className="vads-u-font-family--serif vads-u-font-weight--bold">
              Veteran’s name
            </dt>
            <dd>
              {name.first} {name.middle} {name.last} {name.suffix}
            </dd>
          </div>
          {!!timestamp && (
            <div className="vads-u-margin-bottom--2">
              <dt className="vads-u-font-family--serif vads-u-font-weight--bold">
                Date you applied
              </dt>
              <dd>{moment(timestamp).format('MMM D, YYYY')}</dd>
            </div>
          )}
          <div>
            <dt className="vads-u-font-family--serif vads-u-font-weight--bold">
              Confirmation for your records
            </dt>
            <dd>
              You can print this confirmation page for your records. You can
              also download your completed application as a{' '}
              <abbr title="Portable Document Format">PDF</abbr>.
            </dd>
          </div>
        </dl>

        <va-button
          text="Print this page"
          class="vads-u-margin-y--2"
          onClick={() => window.print()}
        />

        <ApplicationDownloadLink form={form} />
      </va-alert>
    </>
  );
};

ConfirmationScreenView.propTypes = {
  form: PropTypes.object,
  name: PropTypes.object,
  timestamp: PropTypes.object,
};

export default ConfirmationScreenView;
