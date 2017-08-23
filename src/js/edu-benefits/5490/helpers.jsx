import _ from 'lodash/fp';

import React from 'react';
import { transformForSubmit } from '../../common/schemaform/helpers';

export function transform(formConfig, form) {
  // Clone the form in so we don’t modify the original...because of reasons FP
  const newForm = _.cloneDeep(form);

  // Copy the data if necessary
  if (form.data['view:currentSameAsPrevious']) {
    newForm.data['view:currentSponsorInformation'] = {
      veteranFullName: form.data.previousBenefits.veteranFullName,
      'view:veteranId': form.data.previousBenefits['view:veteranId']
    };
  }

  const formData = transformForSubmit(formConfig, newForm);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData
    }
  });
}

export const relationshipLabels = {
  child: 'Child, stepchild, adopted child',
  spouse: 'Spouse or surviving spouse',
};

export const highSchoolStatusLabels = {
  graduated: 'Graduated from high school',
  graduationExpected: 'Expect to graduate from high school',
  neverAttended: 'Never attended high school',
  discontinued: 'Discontinued or stopped high school',
  ged: 'Awarded GED'
};

export const benefitsRelinquishedInfo = (
  <span>
    While receiving DEA or FRY scholarship benefits you may not receive payments of Dependency and Indemnity Compensation (DIC) or Pension and you may not be claimed as a dependent in a Compensation claim. If you are unsure of this decision it is strongly encouraged you talk with a VA counselor.
  </span>
);

export const benefitsRelinquishedWarning = (
  <div className="usa-alert usa-alert-warning usa-content">
    <div className="usa-alert-body">
      I certify that I understand the effects that this election to receive DEA or FRY scholarship benefits will have on my eligibility for DIC payments, and I elect to receive the selected scholarship benefit on the above date.
    </div>
  </div>
);

export const benefitsDisclaimerSpouse = (
  <p>
    IMPORTANT: If you are eligible for Chapter 35 Survivors’ and Dependents’ Educational Assistance Program (DEA) and eligible for Chapter 33 Post-9/11 GI Bill Marine Gunnery Sergeant John David Fry Scholarship (Fry Scholarship), you must relinquish entitlement to the benefit that you are not applying for (even if entitlement arises from separate events). <strong>You cannot retain eligibility for both programs simultaneously</strong>.
  </p>
);

export const benefitsDisclaimerChild = (
  <p>
    IMPORTANT: If you are eligible for Chapter 35 Survivors’ and Dependents’ Educational Assistance Program (DEA) and eligible for Chapter 33 Post-9/11 GI Bill Marine Gunnery Sergeant John David Fry Scholarship (Fry Scholarship), you must relinquish entitlement to the benefit that you are not applying for (but only with regards to the entitlement arising from the same events). <strong>You cannot retain eligibility for both programs based on the same event</strong>.
  </p>
);
