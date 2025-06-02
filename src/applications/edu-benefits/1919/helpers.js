import React from 'react';

export const showConflictOfInterestText = () => {
  window.dataLayer.push({
    event: 'edu-1919--form-help-text-clicked',
    'help-text-label': 'Review the conflict of interest policy',
  });
};
export const conlflictOfInterestPolicy = (
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
  if (
    !item?.allProprietarySchoolsEmployeeInfo.first ||
    !item?.allProprietarySchoolsEmployeeInfo.last
  ) {
    return 'this individual';
  }
  return `${item?.allProprietarySchoolsEmployeeInfo.first} ${
    item?.allProprietarySchoolsEmployeeInfo.last
  }`;
};
export const arrayBuilderOptions = {
  arrayPath: 'all-proprietary-schools',
  nounSingular: 'individual',
  nounPlural: 'individuals',
  required: true,
  text: {
    getItemName: item => cardDescription(item),
    cardDescription: item => {
      return `${item?.allProprietarySchoolsEmployeeInfo?.title}`;
    },
    cancelAddYes: 'Yes, cancel',
    cancelAddNo: 'No, continue adding information',
  },
};
