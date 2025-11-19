import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import {
  CHAMPVA_FAX_NUMBER,
  CHAMPVA_PHONE_NUMBER,
} from '../../utils/constants';
import { APP_URLS } from '../../utils/appUrls';
import { VaLinkAction, CONTACTS } from '../../utils/imports';
import { ChampVaClaimsAddress } from '../ChampVaClaimsAddress';

const NotEnrolledPage = () => (
  <form className="rjsf" noValidate>
    {
      titleUI(
        'Don’t submit a claim until after you get your enrollment packet in the mail',
      )['ui:title']
    }

    <h2 className="mobile-lg:vads-u-font-size--h3 vads-u-font-size--h4">
      If you already applied for CHAMPVA benefits
    </h2>
    <p>
      You don’t need to do anything while you wait. It currently takes us about
      14 days to process an application. If we need more information from you
      during this time, we’ll contact you.
    </p>
    <p>
      If you have questions about the status of your application, call us at{' '}
      <va-telephone contact={CHAMPVA_PHONE_NUMBER} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here Monday through Friday, 8:00 a.m. to 7:30 p.m.{' '}
      <dfn>
        <abbr title="Eastern Time">ET</abbr>
      </dfn>
      .
    </p>

    <va-additional-info
      trigger="What to know if you already received care or prescriptions"
      class="vads-u-margin-y--4"
    >
      If we approve your application, you’ll have 180 days from your CHAMPVA
      effective date to submit a claim. You can find your effective date on your
      CHAMPVA ID card.
    </va-additional-info>

    <h2 className="mobile-lg:vads-u-font-size--h3 vads-u-font-size--h4">
      If you haven’t applied for CHAMPVA benefits
    </h2>
    <p>
      You can apply online, by mail, or by fax. Make sure to submit the required
      supporting documents with your application.
    </p>
    <p>
      <va-link
        href="/family-and-caregiver-benefits/health-and-disability/champva/#supporting-documents-for-your-application"
        text="Find out what supporting documents you need"
      />
    </p>

    <h3 className="mobile-lg:vads-u-font-size--h4 vads-u-font-size--h5">
      Option 1: Online
    </h3>
    <p>You can apply online now.</p>
    <VaLinkAction href={APP_URLS['1010d']} text="Apply for CHAMPVA online" />

    <h3 className="mobile-lg:vads-u-font-size--h4 vads-u-font-size--h5">
      Option 2: By mail or fax
    </h3>
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
    {ChampVaClaimsAddress}
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
