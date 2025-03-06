import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { focusElement } from 'platform/utilities/ui';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import ContactCard from '../components/ContactCard';

import { useTransformForReview } from '../hooks/useTransformForReview';
import {
  getFormNumber,
  getOrgName,
  getEntityAddressAsObject,
} from '../utilities/helpers';

export default function ConfirmationDigitalSubmission() {
  const form = useSelector(state => state?.form);

  const { submission, data: formData } = form;

  const selectedRepAttributes =
    formData?.['view:selectedRepresentative']?.attributes || {};
  const repName = selectedRepAttributes?.fullName;
  const orgName = getOrgName(formData);

  const dateSubmitted = moment(submission?.timestamp).format('MMMM D, YYYY');
  const expirationDate = moment(submission?.timestamp)
    .add(60, 'days')
    .format('MMMM D, YYYY');

  useEffect(() => {
    focusElement('va-alert');
  }, []);

  return (
    <>
      <va-alert
        close-btn-aria-label="Close notification"
        status="continue"
        visible
      >
        <h2 id="track-your-status-on-mobile" slot="headline">
          You’ve submitted your form to appoint the accredited representative on{' '}
          {dateSubmitted}
        </h2>
        <React.Fragment key=".1">
          <p className="vads-u-margin-y--0">
            We’ve sent your form to the Veterans Service Organization you’d like
            to appoint.
          </p>
        </React.Fragment>
      </va-alert>
      <h2 className="vads-u-font-size--h3">Save a copy of your form</h2>
      <p>
        If you’d like a PDF copy of your completed form, you can download it.
      </p>
      <div className="vads-u-margin-bottom--2">
        <va-link
          download
          filetype="PDF"
          href={localStorage.getItem('pdfUrl')}
          filename={`VA Form ${getFormNumber(formData)}`}
          label="Download a copy of your form"
          text="Download a copy of your form"
        />
      </div>

      <va-accordion bordered open-single>
        <va-accordion-item
          header="Information you submitted on this form"
          id="submittedInfo"
          bordered="true"
        >
          {useTransformForReview(formData)}
        </va-accordion-item>
      </va-accordion>

      <h3>Print this confirmation page</h3>
      <p>
        If you’d like to keep a copy of the information on this page, you can
        print it now.
      </p>
      <va-button
        text="Print this page for your records"
        message-aria-describedby="Print this page for your records"
        onClick={() => {
          window.print();
        }}
      />

      <h2>What to expect next</h2>
      <p>
        The Veteran Service Organization (VSO) is reviewing your request. Your
        request will expire on <strong>{expirationDate}</strong>.
      </p>
      <p>
        After the VSO reviews your request, we’ll send you an email with their
        decision.
      </p>
      <p>
        <strong>Note:</strong> Don’t submit another request before we email you.
        If you submit another request, you’ll cancel your current one.
      </p>

      <ContactCard
        repName={repName}
        orgName={orgName}
        addressData={getEntityAddressAsObject(selectedRepAttributes)}
        phone={selectedRepAttributes?.phone}
        email={selectedRepAttributes?.email}
      />

      <VaLinkAction
        class="vads-u-margin-top--4"
        text="Go back to VA.gov"
        label="Go back to VA.gov"
        href="/"
        type="secondary"
      />
    </>
  );
}
