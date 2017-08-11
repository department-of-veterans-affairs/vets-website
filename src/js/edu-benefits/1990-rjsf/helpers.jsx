import React from 'react';

import { transformForSubmit } from '../../common/schemaform/helpers';

export function transform(formConfig, form) {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData
    }
  });
}

export const benefitsEligibilityBox = (
  <div className="usa-alert usa-alert-info">
    <div className="usa-alert-body">
      <ul>
        <li>You may be eligible for more than 1 education benefit program.</li>
        <li>You can only get payments from 1 program at a time.</li>
        <li>You can’t get more than 48 months of benefits under any combination of VA education programs.</li>
      </ul>
    </div>
  </div>
);

export const benefitsRelinquishmentLabels = {
  unknown: 'I’m only eligible for the Post-9/11 GI Bill',
  chapter30: 'Montgomery GI Bill (MGIB-AD, Chapter 30)',
  chapter1606: 'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',
  chapter1607: 'Reserve Educational Assistance Program (REAP, Chapter 1607)'
};

export const benefitsRelinquishmentWarning = (
  <div>
    <p>Because you chose to apply for your Post-9/11 benefit, you have to relinquish (give up) 1 other benefit you may be eligible for.</p>
    <p><strong>Your decision is irrevocable</strong> (you can’t change your mind).</p>
    <br/>
  </div>
);

export const benefitsRelinquishedDescription = (
  <span>
    <br/>
    If you have questions or don’t understand the choice, talk to a specialist at 1-888-442-4551 (1-888-GI-BILL-1) from 8:00 a.m. - 7:00 p.m. ET Mon - Fri.
  </span>
);
