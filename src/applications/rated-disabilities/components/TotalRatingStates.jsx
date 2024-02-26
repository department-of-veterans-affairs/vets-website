import React from 'react';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const errorMessage = () => (
  <va-alert status="error" uswds="false">
    <h2 slot="headline" className="vads-u-margin-y--0 vads-u-font-size--h3">
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
      ). We’re here Monday though Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
  </va-alert>
);

export const missingTotalMessage = () => (
  <va-alert status="info" uswds="true">
    <h2 slot="headline" className="vads-u-margin-y--0 vads-u-font-size--h3">
      We don’t have a combined disability rating on file for you
    </h2>
    <p className="vads-u-font-size--base">
      We can’t find a combined disability rating for you. If you have a
      disability that was caused by or got worse because of your service, you
      can file a claim for disability benefits.
    </p>
    <va-link
      href="/disability/how-to-file-claim"
      text="Learn how to file a claim for disability compensation"
    />
  </va-alert>
);

export const totalRatingMessage = totalDisabilityRating => {
  const heading = `Your combined disability rating is ${totalDisabilityRating}%`;

  return (
    <va-summary-box uswds="false">
      <h3 slot="headline">{heading}</h3>
      <p>
        This rating doesn’t include any conditions from claims that we’re still
        reviewing. You can check the status of your disability claims, decision
        reviews, or appeals online.
      </p>
      <a
        href="/claim-or-appeal-status/"
        arial-label="check your claims or appeals status"
        title="check your claims or appeals status"
        onClick={() => {
          recordEvent({
            event: 'disability-navigation-check-claims',
          });
        }}
      >
        Check the status of your claims, decision reviews, or appeals online
      </a>
    </va-summary-box>
  );
};
