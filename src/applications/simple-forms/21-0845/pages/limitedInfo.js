import React from 'react';

import { LIMITED_INFORMATION_ITEMS } from '../definitions/constants';
import GroupCheckboxWidget from '../../shared/components/GroupCheckboxWidget';

const limitedInfoItemsLabel =
  'Which specific information do you authorize us to release?';

/** @type {PageSchema} */
export default {
  uiSchema: {
    limitedInformationItems: {
      'ui:title': (
        <>
          <h3>
            {limitedInfoItemsLabel}{' '}
            <span className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-color--secondary-dark">
              (*Required)
            </span>
          </h3>
          <span className="vads-u-margin-bottom--0 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-line-height--4 vads-u-display--block">
            Select the items we can share with your third-party source. You can
            select more than one.
          </span>
        </>
      ),
      'ui:widget': GroupCheckboxWidget,
      'ui:reviewField': ({ children }) => (
        // prevent ui:title's <h3> from getting pulled into
        // review-field's <dt> & causing a11y headers-hierarchy errors.
        <div className="review-row">
          <dt>{limitedInfoItemsLabel}</dt>
          <dd>{children}</dd>
        </div>
      ),
      'ui:required': formData => !formData.limitedInformationOther,
      'ui:options': {
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
        const errMsg =
          'Please select at least one type of information here, or specify something else below';
        if (
          fields.limitedInformationItems === '' &&
          typeof fields.limitedInformationOther === 'undefined'
        ) {
          errors.limitedInformationItems.addError(errMsg);
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
