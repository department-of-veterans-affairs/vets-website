import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/Telephone';

export const errorMessage = () => (
  <va-alert status="error">
    <h2 slot="headline" className="vads-u-margin-y--0 vads-u-font-size--h3">
      We’re sorry. Something went wrong on our end
    </h2>
    <p className="vads-u-font-size--base">
      Please refresh this page or check back later. You can also sign out of
      VA.gov and try signing back into this page.
    </p>
    <p className="vads-u-font-size--base">
      If you get this error again, please call the VA.gov help desk at{' '}
      <va-telephone contact={CONTACTS.VA_311} /> (TTY:{' '}
      <va-telephone contact={CONTACTS['711']} />
      ). We’re here Monday though Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
  </va-alert>
);

export const missingTotalMessage = () => (
  <va-alert status="info">
    <h2 slot="headline" className="vads-u-margin-y--0 vads-u-font-size--h3">
      We don’t have a combined disability rating on file for you
    </h2>
    <p className="vads-u-font-size--base">
      We can’t find a combined disability rating for you. If you have a
      disability that was caused by or got worse because of your service, you
      can file a claim for disability benefits.
    </p>
    <a
      href="/disability/how-to-file-claim/"
      className="usa-link vads-u-font-size--base"
      aria-label="Learn how to file a claim for disability compensation"
    >
      Learn how to file a claim for disability compensation
    </a>
  </va-alert>
);

export const totalRatingMessage = totalDisabilityRating => (
  <>
    <h2 id="combined-rating" className="vads-u-margin-top--0">
      Your combined disability rating
    </h2>
    <div className="vads-l-col--12 vads-u-background-color--gray-lightest vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-padding-top--1 vads-u-padding-bottom--2 vads-u-padding-x--2">
      <dl className="vads-u-display--block vads-u-margin--0">
        <dt className="vads-u-display--inline-block vads-u-font-size--h2 vads-u-font-weight--bold vads-u-margin--0 vads-u-border-color--gray-light vads-u-border-bottom--1px">
          {totalDisabilityRating}%
        </dt>
        <dd className="vads-u-display--inline-block vads-u-margin-y--1">
          This rating doesn’t include any disabilities for your claims that are
          still in process. You can check the status of your disability claims
          or appeals with the Claim Status tool.
        </dd>
      </dl>
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
        Check your claims or appeals
      </a>
    </div>
  </>
);
