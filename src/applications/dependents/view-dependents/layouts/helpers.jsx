import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const errorFragment = (
  <>
    <h2 slot="headline" className="vads-u-font-size--h3">
      We’re sorry. Something went wrong on our end
    </h2>
    <p className="vads-u-font-size--base">
      Please refresh this page or check back later. You can also sign out of
      VA.gov and try signing back into this page.
    </p>
    <p className="vads-u-font-size--base">
      If you get this error again, please call the VA.gov help desk at{' '}
      <va-telephone contact={CONTACTS.VA_311} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
  </>
);

export const infoFragment = (
  <>
    <h2 slot="headline" className="vads-u-margin-top--0 vads-u-font-size--h3">
      We don’t have dependents information on file for you
    </h2>
    <p className="vads-u-font-size--base">
      We can’t find any dependents added to your disability award. If you are
      eligible for VA disability compensation and you have a VA combined rating
      of 30%, you may be eligible for additional disability compensation for a
      spouse, child, and/or parent.
    </p>
    <a
      className="vads-u-font-size--base"
      href="/disability/add-remove-dependent/"
    >
      Find out how to add a dependent to your disability claim
    </a>
  </>
);

export const breadcrumbLinks = [
  <a href="/" aria-label="Back to VA Home page" key="1">
    Home
  </a>,
  <a
    href="/view-change-dependents/"
    aria-label="Back to the Add or remove dependents page"
    key="3"
  >
    Add or remove dependents
  </a>,
  <a href="/view-change-dependents/view" key="4">
    Your Dependents
  </a>,
];
