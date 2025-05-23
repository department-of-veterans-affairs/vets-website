import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';
import { CONTACTS } from '../../utils/imports';
import ApplicationDownloadLink from '../ApplicationDownloadLink';

const SubmissionErrorAlert = () => {
  useEffect(() => {
    focusElement('va-alert[status="error"]');
  }, []);

  return (
    <div className="caregiver-error-message">
      <div className="vads-u-margin-y--4">
        <va-alert status="error" uswds>
          <h3 slot="headline">We didn’t receive your online application</h3>
          <p className="vads-u-margin-y--0">
            We’re sorry. Something went wrong when you tried to submit your
            application. You won’t be able to resubmit the form online.
          </p>
        </va-alert>
      </div>
      <va-card background className="vads-u-margin-top--4">
        <h4 className="vads-u-margin-y--0">What you can do now</h4>
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
          <br role="presentation" />
          10-10CG Evidence Intake Center
          <br role="presentation" />
          PO Box 5154
          <br role="presentation" />
          Janesville, WI 53547-5154
        </p>

        <p>
          If you have trouble downloading your application, call our{' '}
          <a href="https://www.va.gov">VA.gov</a> help desk at{' '}
          <va-telephone contact={CONTACTS.HELP_DESK} /> (
          <va-telephone contact={CONTACTS['711']} tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>

        <p className="caregiver-application--download">
          <ApplicationDownloadLink />
        </p>
      </va-card>
    </div>
  );
};

export default SubmissionErrorAlert;
