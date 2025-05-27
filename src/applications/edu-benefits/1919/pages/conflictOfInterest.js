import React from 'react';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiDescription = (
  <>
    <p>
      Title 38 C.F.R. 21.4202(c), 21.5200(c), 21.7122(e)(6), and
      21.7622(f)(4)(iv) prohibit the payment of educational assistance to any
      Veteran or eligible person enrolled in a proprietary school as an owner or
      officer. If a Veteran or eligible person is an official authorized to sign
      enrollment certificates or certify/verifying attendance, they cannot
      submit their own enrollment certification(s) to VA.
    </p>
    <p>
      In the next step, provide the names and VA file numbers (claim or Social
      Security numbers) of any certifying officials, owners, or officers at your
      school who receive VA educational assistance based on their enrollment.
    </p>
  </>
);

const uiSchema = {
  ...titleUI('Optional demographic information'),
  'ui:description': uiDescription,
  conflictOfInterest: yesNoUI(
    'Do any certifying officials, owners, or officers at your institution receive educational benefits based on enrollment at your school? ',
  ),
};

const schema = {
  type: 'object',
  properties: {
    conflictOfInterest: yesNoSchema,
  },
};

export { schema, uiSchema };
