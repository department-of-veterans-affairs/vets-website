import React from 'react';

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
export const cardDescription = item => {
  if (!item?.first || !item?.last) {
    return 'this individual';
  }
  return `${item?.first} ${item?.last}`;
};
export const arrayBuilderOptions = {
  arrayPath: 'allProprietarySchoolsEmployeeInfo',
  nounSingular: 'allProprietarySchoolsEmployeeInfo',
  nounPlural: 'allProprietarySchoolsEmployeesInfo',
  required: true,
  text: {
    getItemName: item => cardDescription(item),
    cardDescription: item => {
      return `${item?.title}`;
    },
    cancelAddYes: 'Yes, cancel',
    cancelAddNo: 'No, continue adding information',
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
