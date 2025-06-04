import React from 'react';
import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { alert } from '../helpers';

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
    {alert}
  </>
);

const uiSchema = {
  ...titleUI(
    'Individuals with a potential conflict of interest who receive VA educational benefits',
  ),
  'ui:description': uiDescription,
  allProprietarySchools: yesNoUI({
    title:
      'Do any certifying officials, owners, or officers at your institution receive educational benefits based on enrollment at your school?',
    errorMessages: {
      required: 'Please make a selection',
    },
  }),
};

const schema = {
  type: 'object',
  required: ['allProprietarySchools'],
  properties: {
    allProprietarySchools: yesNoSchema,
  },
};

export { schema, uiSchema };
