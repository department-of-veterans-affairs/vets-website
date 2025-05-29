import React from 'react';
import {
  arrayBuilderItemFirstPageTitleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const noSpaceOnlyPattern = '^(?!\\s*$).+';
const showConflictOfInterestText = () => {
  window.dataLayer.push({
    event: 'edu-0994--form-help-text-clicked',
    'help-text-label': 'Review the conflict of interest policy',
  });
};
const conlflictOfInterestPolicy = (
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
const uiSchema = {
  allProprietarySchoolsEmployeeInfo: {
    ...arrayBuilderItemFirstPageTitleUI({
      title:
        'Information on an individual with a potential conflict of interest who receives VA educational benefits',
    }),
    'ui:description': conlflictOfInterestPolicy,
    first: textUI({
      title: 'First name of individual ',
      errorMessages: {
        required: 'Please enter a first name',
        pattern: 'You must provide a response',
      },
    }),
    last: textUI({
      title: 'Last name of individual',
      errorMessages: {
        required: 'Please enter a last name',
        pattern: 'You must provide a response',
      },
    }),
    title: textUI({
      title: 'Last name of individual',
      errorMessages: {
        required: 'Please enter a title',
        pattern: 'You must provide a response',
      },
    }),
  },
};
const schema = {
  type: 'object',
  properties: {
    allProprietarySchoolsEmployeeInfo: {
      type: 'object',
      required: ['first', 'last', 'title'],
      properties: {
        first: {
          ...textSchema,
          maxLength: 30,
          pattern: noSpaceOnlyPattern,
        },
        last: {
          ...textSchema,
          maxLength: 30,
          pattern: noSpaceOnlyPattern,
        },
        title: {
          ...textSchema,
          maxLength: 30,
          pattern: noSpaceOnlyPattern,
        },
      },
    },
  },
};
export { uiSchema, schema };
