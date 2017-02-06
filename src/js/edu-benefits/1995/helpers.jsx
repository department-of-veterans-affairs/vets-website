import React from 'react';
import { flattenFormData } from '../../common/schemaform/helpers';

export const benefitsLabels = {
  chapter33: <p>Post-9/11 GI Bill (Chapter 33)<br/><a href="/education/gi-bill/post-9-11/" target="_blank">Learn more</a></p>,
  chapter30: <p>Montgomery GI Bill (MGIB-AD, Chapter 30)<br/><a href="/education/gi-bill/montgomery-active-duty/" target="_blank">Learn more</a></p>,
  chapter1606: <p>Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)<br/><a href="/education/gi-bill/montgomery-selected-reserve/" target="_blank">Learn more</a></p>,
  chapter32: <p>Post-Vietnam Era Veterans' Educational Assistance Program<br/>(VEAP, Chapter 32)<br/><a href="/education/other-educational-assistance-programs/veap/" target="_blank">Learn more</a></p>,
  chapter1607: <p>Reserve Educational Assistance Program (REAP, Chapter 1607)<br/><a href="/education/other-educational-assistance-programs/reap/" target="_blank">Learn more</a></p>,
  transferOfEntitlement: <p>Transfer of Entitlement Program (TOE)<br/><a href="/education/gi-bill/transfer/" target="_blank">Learn more</a></p>
};

export const educationTypeLabels = {
  college: 'College, university, or other educational program, including online courses',
  correspondence: 'Correspondence',
  apprenticeship: 'Apprenticeship or on-the-job training',
  flightTraining: 'Vocational fight training',
  testReimbursement: 'National test reimbursement (for example, SAT or CLEP)',
  licensingReimbursement: 'Licensing or certification test reimbursement (for example, MCSE, CCNA, EMT, or NCLEX)',
  tuitionTopUp: 'Tuition assistance top up (Post 9/11 GI Bill and MGIB-AD only)'
};

export function transformForSubmit(form) {
  const formData = flattenFormData(form);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: JSON.stringify(formData)
    }
  });
}

export function enumToNames(enumValues, names) {
  return enumValues.map(item => names[item]);
}
