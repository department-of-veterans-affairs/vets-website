import React from 'react';

import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

export const showConflictOfInterestText = () => {
  window.dataLayer.push({
    event: 'edu-1919--form-help-text-clicked',
    'help-text-label': 'Review the conflict of interest policy',
  });
};

export const conflictOfInterestPolicy = (
  <va-additional-info
    trigger="Review the conflict of interest policy"
    onClick={showConflictOfInterestText}
  >
    <p>
      Title 38 C.F.R. 21.4202(c), 21.5200(c), 21.7122(e)(6), and
      21.7622(f)(4)(iv) prohibit the payment of educational assistance to any
      Veteran or eligible person based on an enrollment in any proprietary
      school as an owner or an officer. If the Veteran or eligible person is an
      official authorized to sign certificates of enrollment or
      verifications/certifications of attendance, the individual cannot submit
      their own enrollment certification(s) to the VA.
    </p>
  </va-additional-info>
);

export const getCardTitle = item => {
  let title = null;

  if (item) {
    const first = item.certifyingOfficial?.first || 'Certifying';
    const last = item.certifyingOfficial?.last || 'Official';
    title = `${first} ${last}`;
  }

  return title;
};

export const getCardDescription = item => {
  return item ? (
    <>
      <p className="vads-u-margin-top--0" data-testid="card-title">
        {item.certifyingOfficial?.title || 'Title'}
      </p>
      <p data-testid="card-file-number">{item.fileNumber || 'File number'}</p>
      {item.enrollmentPeriod?.from && (
        <p data-testid="card-enrollment-period">
          {formatReviewDate(item.enrollmentPeriod.from)}
          {item.enrollmentPeriod?.to &&
            ` - ${formatReviewDate(item.enrollmentPeriod.to)}`}
        </p>
      )}
    </>
  ) : null;
};

export const conflictOfInterestArrayOptions = {
  arrayPath: 'conflict-of-interest',
  nounSingular: 'individual',
  nounPlural: 'individuals',
  required: false,
  text: {
    getItemName: item => getCardTitle(item),
    cardDescription: item => getCardDescription(item),
    cancelAddYes: 'Yes, cancel',
    cancelAddNo: 'No, continue adding information',
    summaryTitle:
      'Review the individuals with a potential conflict of interest that receive VA educational benefits',
  },
};

export const alert = (
  <va-alert
    class="vads-u-margin-bottom--1"
    data-testid="info-alert"
    close-btn-aria-label="Close notification"
    disable-analytics="false"
    full-width="false"
    slim
    status="info"
    visible
  >
    <p className="vads-u-margin-y--0">
      <strong>Note:</strong> Each time the information on this form changes, a
      new submission is required.
    </p>
  </va-alert>
);
