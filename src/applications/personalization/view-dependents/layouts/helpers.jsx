import React from 'react';

export const errorFragment = (
  <>
    <p>
      Please refresh this page or check back later. You can also sign out of
      VA.gov and try signing back into this page.
    </p>
    <p>
      If you get this error again, please call the VA.gov help desk at
      <a href="tel:8446982311">844-698-2311</a> (TTY:711). We're here
      Monday-Friday, 8:00a.m.-8:00p.m. ET.
    </p>
  </>
);

export const infoFragment = (
  <>
    <p>
      We can't find any dependents added to your disability award. If you are eligable for
      VA disability compensation and you have a VA combined rating of 30%, you may be eligable
      for additional disability compensation for a spouse, child, and/or parent. 
    </p>
    <a href="/disability/add-remove-dependent/">Find out how to add a dependent to your disability claim</a>
  </>
);

export const breadcrumbLinks = [
  <a href="/" aria-label="back to VA Home page" key="1">
    Home
  </a>,
  <a
    href="/disability"
    aria-label="Back to the Disability Benefits page"
    key="2"
  >
    Disability Benefits
  </a>,
  <a
    href="/disability/add-remove-dependent"
    aria-label="Back to the Add or remove dependents page"
    key="3"
  >
    Add or remove dependents
  </a>,
  <a href="/disability/view-dependents/" key="4">
    Your Dependents
  </a>,
];
