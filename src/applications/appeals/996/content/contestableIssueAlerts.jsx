import React from 'react';

import recordEvent from 'platform/monitoring/record-event';

import { PROFILE_URL } from '../constants';

const networkError = (
  <p className="vads-u-font-size--base">
    We’re having some connection issues on our end. Please refresh this page to
    try again.
  </p>
);

const benefitError = type => (
  <p className="vads-u-font-size--base">
    We don’t currently support the "{type}" benefit type
  </p>
);

let timeoutId;

export const showContestableIssueError = ({ error, status } = {}, delay) => {
  const invalidBenefitType = error.error === 'invalidBenefitType';
  const headline = invalidBenefitType
    ? `We don’t support this benefit type`
    : 'We can’t load your issues';
  const content = invalidBenefitType ? benefitError(error?.type) : networkError;

  const record = () =>
    recordEvent({
      event: 'visible-alert-box',
      'alert-box-type': 'error',
      'alert-box-heading': headline,
      'alert-box-subheading': invalidBenefitType
        ? `${error?.type} not supported`
        : 'network error',
      'error-key': status,
      'alert-box-full-width': false,
      'alert-box-background-only': false,
      'alert-box-closeable': false,
    });

  // Using a debounce method to prevent duplication (2 alerts on intro page)
  // Not using platform debounce function since it doesn't behave as expected
  clearTimeout(timeoutId);
  if (delay) {
    timeoutId = setTimeout(record(), delay);
  } else {
    record(); // no delay in unit tests
  }
  return (
    <va-alert status="error">
      <h3 slot="headline">{headline}</h3>
      {content}
    </va-alert>
  );
};

export const showHasEmptyAddress = (
  <va-alert status="info">
    <h3 slot="headline">You need to have an address on file</h3>
    <p className="vads-u-font-size--base">
      To request a Higher-Level Review, you need to have an address in your
      VA.gov profile. To add an address,{' '}
      <a href={PROFILE_URL}>please go to your profile page.</a>
    </p>
  </va-alert>
);
