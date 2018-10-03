import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

export const successMessage = claimId => (
  <div>
    <p>Thank you for filing a claim for increased disability compensation.</p>
    <strong>Claim ID number</strong>
    <div>{claimId}</div>
    <p>
      You can check the status of your claim online. Please allow 24 hours for
      your increased disability claim to show up there.
    </p>
    <p>
      <a href="/track-claims">Check the status of your claim.</a>
    </p>
    <p>
      If you don’t see your increased disability claim online after 24 hours,
      please call Veterans Benefits Assistance at{' '}
      <a href="tel:+18008271000">1-800-827-1000</a>, Monday – Friday, 8:00 a.m.
      – 9:00 a.m. (ET).
    </p>
  </div>
);

export const checkLaterMessage = jobId => (
  <div>
    <p>Thank you for filing a claim for increased disability compensation.</p>
    <strong>Confirmation number</strong>
    <div>{jobId}</div>
    <p>
      You can check the status of your claim online. Please allow 24 hours for
      your increased disability claim to show up there.
    </p>
    <p>
      <a href="/track-claims">Check the status of your claim.</a>
    </p>
    <p>
      If you don’t see your increased disability claim online after 24 hours,
      please call Vets.gov Help Desk at{' '}
      <a href="tel:+18555747286">1-855-574-7286</a>, Monday – Friday, 8:00 a.m.
      – 9:00 a.m. (ET).
    </p>
  </div>
);

export const errorMessage = () => (
  <div>
    <p>
      We're sorry. Something went wrong on our end when we tried to submit your
      application. For help submitting your claim, please call VA Benefits Call
      Center at <a href="tel:18008271000">1-800-827-1000</a>, Monday – Friday,
      8:30 a.m. – 4:30 p.m. (ET). Or, you can get in touch with your nearest
      Veterans Service Officer (VSO).
    </p>
    <p>
      <a href="/disability-benefits/apply/help/">Contact your nearest VSO.</a>
    </p>
  </div>
);

export const pendingMessage = longWait => {
  const message = !longWait
    ? 'Please wait while we submit your application and give you a confirmation number.'
    : 'We’re sorry. It’s taking us longer than expected to submit your application. Thank you for your patience.';
  return <LoadingIndicator message={message} />;
};
