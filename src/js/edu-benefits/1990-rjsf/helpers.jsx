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

export const benefitsLabels = {
  chapter33:
    (<p>
      Post-9/11 GI Bill (Chapter 33)
      <br/>
      <a href="/education/gi-bill/post-9-11/" target="_blank">Learn more</a>
    </p>),
  chapter30: (
    <p>
      Montgomery GI Bill (MGIB-AD, Chapter 30)
      <br/>
      <a href="/education/gi-bill/montgomery-active-duty/" target="_blank">Learn more</a>
    </p>
  ),
  chapter1606: (
    <p>
      Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)
      <br/>
      <a href="/education/gi-bill/montgomery-selected-reserve/" target="_blank">Learn more</a>
    </p>
  ),
  chapter32: (
    <p>
      Post-Vietnam Era Veterans’ Educational Assistance Program <br/>
      (VEAP, Chapter 32)
      <br/>
      <a href="/education/other-educational-assistance-programs/veap/" target="_blank">Learn more</a>
    </p>
  )
};
