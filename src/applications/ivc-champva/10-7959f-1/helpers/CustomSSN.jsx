import React from 'react';
import PropTypes from 'prop-types';
import { validateSSN } from 'platform/forms-system/src/js/validation';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import SSNReviewWidget from 'platform/forms-system/src/js/review/SSNWidget';
import get from 'platform/utilities/data/get';
import { vaFileNumberUI } from 'platform/forms-system/src/js/web-component-patterns';
import HandlePrefilledSSN, { maskSSN } from '../../shared/components/maskSSN';

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
    vaFileNumber: vaFileNumberUI(),

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

export function CustomSSNReviewPage(props) {
  const maskedSSN = maskSSN(props?.data?.veteranSocialSecurityNumber?.ssn);
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
          <dt>Social Security number</dt>
          <dd>{maskedSSN}</dd>
        </div>
        <div className="review-row">
          <dt>VA file number</dt>
          <dd>{props?.data?.veteranSocialSecurityNumber?.vaFileNumber}</dd>
        </div>
      </dl>
    </div>
  ) : null;
}

CustomSSNReviewPage.propTypes = {
  data: PropTypes.shape({
    veteranSocialSecurityNumber: PropTypes.shape({
      ssn: PropTypes.string,
    }),
  }),
  editPage: PropTypes.func,
  title: PropTypes.string,
};
