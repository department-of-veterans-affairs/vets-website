import React from 'react';
import { validateSSN } from 'platform/forms-system/src/js/validation';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import SSNReviewWidget from 'platform/forms-system/src/js/review/SSNWidget';
import get from 'platform/utilities/data/get';
import { vaFileNumberUI } from 'platform/forms-system/src/js/web-component-patterns';
import HandlePrefilledSSN from './maskSSN';

const SSN_DEFAULT_TITLE = 'Social Security number';

const customSSNUI = title => {
  return {
    'ui:title': title ?? SSN_DEFAULT_TITLE,
    'ui:webComponentField': HandlePrefilledSSN,
    'ui:reviewWidget': SSNReviewWidget,
    'ui:validations': [validateSSN],
    'ui:errorMessages': {
      pattern:
        'Please enter a valid 9 digit Social Security number (dashes allowed)',
      required: 'Please enter a Social Security number',
    },
  };
};

export const ssnOrVaFileNumberCustomUI = () => {
  return {
    ssn: customSSNUI(),
    vaFileNumber: {
      ...vaFileNumberUI(),
      'ui:options': {
        hint:
          'Enter this number only if it’s different than the Social Security number',
      },
    },
    'ui:options': {
      updateSchema: (formData, _schema, _uiSchema, index, path) => {
        const { ssn, vaFileNumber } = get(path, formData) ?? {};

        let required = ['ssn'];
        if (!ssn && vaFileNumber) {
          required = ['vaFileNumber'];
        }

        return {
          ..._schema,
          required,
        };
      },
    },
  };
};

// TODO: Needs safety checks, prop validation, and maybe some work on the title
export function CustomSSNReviewPage(props) {
  return props.data ? (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {props?.title}
        </h4>
        <VaButton secondary onClick={props?.editPage} text="Edit" uswds />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>SSN</dt>
          {/* TODO: mask the SSN */}
          <dd>{props?.data?.veteranSocialSecurityNumber?.ssn}</dd>
        </div>
      </dl>
    </div>
  ) : null;
}
