import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export const errorFragment = (
  <>
    <p>
      Please refresh this page or check back later. You can also sign out of
      VA.gov and try signing back into this page.
    </p>
    <p>
      If you get this error again, please call the VA.gov help desk at
      <Telephone contact={CONTACTS.VA_311} />{' '}
      <Telephone contact={CONTACTS['711']} pattern={PATTERNS['3_DIGIT']} />
      ). We're here Monday-Friday, 8:00a.m.-8:00p.m. ET.
    </p>
  </>
);

export const infoFragment = (
  <>
    <h2 className="vads-u-margin-top--1">
      We don't have dependents information on file for you
    </h2>
    <p>
      We can't find any dependents added to your disability award. If you are
      eligible for VA disability compensation and you have a VA combined rating
      of 30%, you may be eligible for additional disability compensation for a
      spouse, child, and/or parent.
    </p>
    <a href="/disability/add-remove-dependent/">
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
