import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns/datePatterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Authorization and Certification',
    'ui:description':
      'AUTHORIZATION FOR RELEASE OF INFORMATION: I authorize the person or entity, including but not limited to any organization, service provider, employer, or Government agency, to give the Department of Veterans Affairs any information about me except protected health information, and I waive any privilege which makes the information confidential. CERTIFICATION OF STATEMENTS: I CERTIFY THAT as a result of my service-connected disabilities, I am unable to secure or follow any substantially gainful occupation and that the statements in this application are true and complete to the best of my knowledge and belief. I understand that these statements will be considered in determining my eligibility for VA benefits based on unemployability because of service-connected disability. I UNDERSTAND THAT IF I AM GRANTED SERVICE-CONNECTED TOTAL DISABILITY BENEFITS BASED ON MY UNEMPLOYABILITY, I MUST IMMEDIATELY INFORM VA IF I RETURN TO WORK. I ALSO UNDERSTAND THAT TOTAL DISABILITY BENEFITS PAID TO ME AFTER I BEGIN WORK MAY BE CONSIDERED AN OVERPAYMENT REQUIRING REPAYMENT TO VA.',

    signatureOfClaimant: textUI({
      title: 'Signature of claimant',
      hint: 'Please type your full name to serve as your electronic signature',
    }),

    dateSigned: currentOrPastDateUI('Date signed'),
  },
  schema: {
    type: 'object',
    properties: {
      signatureOfClaimant: textSchema,
      dateSigned: currentOrPastDateSchema,
    },
    required: ['signatureOfClaimant', 'dateSigned'],
  },
};
