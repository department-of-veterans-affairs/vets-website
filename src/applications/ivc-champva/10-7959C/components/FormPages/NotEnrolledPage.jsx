import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  CHAMPVA_FAX_NUMBER,
  CHAMPVA_ELIGIBILITY_ADDRESS,
} from '../../../shared/constants';
import { APP_URLS } from '../../utils/appUrls';

const NotEnrolledPage = () => (
  <form className="rjsf" noValidate>
    {
      titleUI(
        'You should wait to receive the CHAMPVA benefits enrollment packet in the mail before submitting this form',
      )['ui:title']
    }
    <p>
      If you have not applied for CHAMPVA benefits, you can apply online, by
      mail, or by fax. Make sure to submit the required supporting documents
      with your application.
    </p>
    <p>
      <va-link
        href="/family-and-caregiver-benefits/health-and-disability/champva/#supporting-documents-for-your-"
        text="Find out what supporting documents you need"
      />
    </p>
    <h2 className="mobile-lg:vads-u-font-size--h3 vads-u-font-size--h4">
      <strong>Option 1: Online</strong>
    </h2>
    <p>You can apply online now.</p>
    <p>
      <va-link-action
        href={APP_URLS['1010d']}
        text="Apply for CHAMPVA online"
      />
    </p>
    <h2 className="mobile-lg:vads-u-font-size--h3 vads-u-font-size--h4">
      <strong>Option 2: By mail or fax</strong>
    </h2>
    <p>
      You’ll need to fill out an application for CHAMPVA Benefits (VA Form
      10-10d).
    </p>
    <p>
      <va-link
        href="/find-forms/about-form-10-10d/"
        text="Get VA Form 10-10d to download"
      />
    </p>
    <p>Mail your completed form and supporting documents to this address:</p>

    {CHAMPVA_ELIGIBILITY_ADDRESS}

    <p>
      Or fax it to: <va-telephone contact={CHAMPVA_FAX_NUMBER} />
    </p>
    <p>
      <va-link
        href="/family-and-caregiver-benefits/health-and-disability/champva/"
        text="Learn about CHAMPVA benefits"
      />
    </p>
  </form>
);

export default NotEnrolledPage;
