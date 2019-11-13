import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import recordEvent from 'platform/monitoring/record-event';
import PercentageCalloutBox from '../components/PercentageCalloutBox';

export const errorMessage = () => {
  const message = (
    <>
      <p>
        Please refresh this page or check back later. You can also sign out of
        VA.gov and try signing back into this page.
      </p>
      <p>
        If you get this error again, please call VA.gov help desk at{' '}
        <a
          href="tel:1-855-574-7286"
          aria-label="Dial the telephone number 1-855-574-7286"
          title="Dial the telephone number 1-855-574-7286"
        >
          1-855-574-7286
        </a>{' '}
        (TTY:711). We’re here Monday-Friday, 8:00 a.m.-8:00 p.m. ET.
      </p>
    </>
  );
  return (
    <AlertBox
      headline="We’re sorry. Something went wrong on our end"
      content={message}
      status="error"
      isVisible
    />
  );
};

export const missingTotalMessage = () => {
  const message = (
    <>
      <p>
        We’re sorry. We can’t find a disability rating for you. If you have a
        disability that was caused by or got worse because of your service, you
        can file a claim for disability benefits.
      </p>
      <a
        href="/disability/how-to-file-claim/"
        className="usa-link"
        aria-label="go to the how-to-file-claim page"
      >
        Learn how to file a claim for disability compensation
      </a>
    </>
  );
  return (
    <AlertBox
      headline="We don’t have a disability rating on file for you"
      content={message}
      status="info"
      isVisible
    />
  );
};

export const totalRatingMessage = totalDisabilityRating => (
  <div className="total-rated-disabilities">
    <div className="vads-l-row medium-screen:vads-u-padding-bottom--2p5">
      <div className="vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--9 vads-u-padding-right--1p5">
        <p>
          <strong>
            Your combined disability rating is {totalDisabilityRating}%
          </strong>
          . This rating doesn’t include disabilities for your claims that are
          still pending. You can check the status of your disability claims or
          appeals with the Claim Status tool.
        </p>
        <a
          href="/claim-or-appeal-status/"
          arial-label="check your claims or appeals status"
          title="check your claims or appeals status"
          onClick={() => {
            recordEvent({ event: 'disability-navigation-check-claims' });
          }}
        >
          Check your claims or appeals
        </a>
      </div>
      <div className="vads-u-margin-top--2p5 medium-screen:vads-u-margin-top--0 vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--3 medium-screen:vads-u-padding-top--2p5">
        <PercentageCalloutBox
          value={totalDisabilityRating}
          isPercentage
          label="Your combined VA disability rating"
        />
      </div>
    </div>
  </div>
);
