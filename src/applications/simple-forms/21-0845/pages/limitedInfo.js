import React from 'react';

import { LIMITED_INFORMATION_ITEMS } from '../definitions/constants';
import GroupCheckboxWidget from '../../shared/components/GroupCheckboxWidget';

/** @type {PageSchema} */
export default {
  uiSchema: {
    limitedInformationItems: {
      'ui:description':
        'Select the items we can share with your third-party source. You can select more than one.',
      'ui:widget': GroupCheckboxWidget,
      'ui:required': formData => !formData.limitedInformationOther,
      'ui:options': {
        updateSchema: formData => {
          const { authorizerType } = formData;
          const titleString =
            authorizerType === 'veteran'
              ? 'Which specific information do you authorize us to release?'
              : 'Which information should be limited from this disclosure?';

          return {
            title: (
              <h3 className="custom-header disclosure-information-limited-information">
                {titleString}{' '}
                <span className="custom-required-span">(*Required)</span>
              </h3>
            ),
          };
        },
        forceDivWrapper: true,
        labels: Object.values(LIMITED_INFORMATION_ITEMS),
        showFieldLabel: true,
      },
    },
    limitedInformationOther: {
      'ui:title': 'Other (specify here)',
    },
    'ui:validations': [
      (errors, fields) => {
        if (
          !fields.limitedInformationItems &&
          !fields.limitedInformationOther
        ) {
          errors.limitedInformationItems.addError(
            'Please select at least one item here, or enter unlisted item(s) in “Other” text-field below.',
          );
        }
      },
    ],
  },
  schema: {
    type: 'object',
    properties: {
      limitedInformationItems: {
        type: 'string',
      },
      limitedInformationOther: {
        type: 'string',
      },
    },
  },
};
