import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { focusElement } from 'platform/utilities/ui';
import ApplicationDownloadLink from '../ApplicationDownloadLink';

const SubmissionErrorAlert = ({ form }) => {
  useEffect(() => {
    focusElement('.caregiver-error-message');
  }, []);

  return (
    <div className="caregiver-error-message">
      <va-alert status="error">
        <h3 slot="headline">We didn’t receive your online application</h3>
        <p>
          We’re sorry. Something went wrong when you tried to submit your
          application. You won’t be able to resubmit the form online.
        </p>

        <h4 className="vads-u-font-size--h5">What you can do now</h4>
        <p>
          Please review your application to make sure you entered your
          information correctly. Then download, print, and sign a copy of your
          completed application.
        </p>

        <p className="vads-u-margin-top--1p5">Mail your application to:</p>

        <p className="va-address-block vads-u-margin-bottom--2 vads-u-margin-x--0">
          <strong>
            Program of Comprehensive Assistance for Family Caregivers
          </strong>
          <br />
          Health Eligibility Center <br />
          2957 Clairmont Road NE, Ste 200 <br />
          Atlanta, GA 30329-1647 <br />
        </p>

        <p>
          If you have trouble downloading your application, call our{' '}
          <a href="https://www.va.gov/">VA.gov</a> help desk at{' '}
          <va-telephone contact={CONTACTS.HELP_DESK} /> (
          <va-telephone contact={CONTACTS['711']} tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>

        <div className="caregiver-application--download">
          <ApplicationDownloadLink form={form} />
        </div>
      </va-alert>
    </div>
  );
};

SubmissionErrorAlert.propTypes = {
  form: PropTypes.object,
};

export default SubmissionErrorAlert;
