import React from 'react';
import { flattenFormData } from '../../common/schemaform/helpers';

export const benefitsLabels = {
  chapter33: <p>Post-9/11 GI Bill (Chapter 33)<br/><a href="/education/gi-bill/post-9-11/" target="_blank">Learn more</a></p>,
  chapter30: <p>Montgomery GI Bill (MGIB-AD, Chapter 30)<br/><a href="/education/gi-bill/montgomery-active-duty/" target="_blank">Learn more</a></p>,
  chapter1606: <p>Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)<br/><a href="/education/gi-bill/montgomery-selected-reserve/" target="_blank">Learn more</a></p>,
  chapter32: <p>Post-Vietnam Era Veterans' Educational Assistance Program<br/>(VEAP, Chapter 32)<br/><a href="/education/other-educational-assistance-programs/veap/" target="_blank">Learn more</a></p>,
  chapter1607: 'Reserve Educational Assistance Program (REAP, Chapter 1607)',
  transferOfEntitlement: 'Transfer of Entitlement Program (TOE)'
};

export function transformForSubmit(form) {
  const formData = flattenFormData(form);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: JSON.stringify(formData)
    }
  });
}
