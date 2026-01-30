// @ts-check
import React from 'react';
import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import PropTypes from 'prop-types';
import { employmentCheckFields } from '../definitions/constants';
import { applyEmploymentSelection } from '../utils/employment';

const EmploymentCheckReviewObjectField = ({ title, renderedProperties }) => {
  return (
    <>
      {title ? (
        <div className="form-review-panel-page-header-row">
          <h3 className="form-review-panel-page-header vads-u-font-size--h5">
            {title}
          </h3>
        </div>
      ) : null}
      <dl className="review" style={{ margin: '16px auto' }}>
        {renderedProperties}
      </dl>
    </>
  );
};

const reviewField = ({ children }) => {
  const selection = children?.props?.formData;

  if (selection !== 'yes' && selection !== 'no') {
    return null;
  }

  const message =
    selection === 'yes'
      ? 'You told us you worked during the past 12 months. The employers you added are listed below.'
      : "We skipped Section II because you told us you didn't work in the past 12 months.";

  return (
    <div className="review-row">
      <dt>Employment in the past 12 months</dt>
      <dd>
        <p className="vads-u-margin--0">{message}</p>
      </dd>
    </div>
  );
};

const getSelection = formData =>
  formData?.[employmentCheckFields.parentObject]?.[
    employmentCheckFields.hasEmploymentInLast12Months
  ];

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:objectViewField': EmploymentCheckReviewObjectField,
    employmentCheck: {
      [employmentCheckFields.hasEmploymentInLast12Months]: {
        ...radioUI({
          title:
            'Were you employed or self-employed at any time in the past 12 months?',
          labels: {
            yes: 'Yes, I have employment to report',
            no: "No, I don't have any employment to report",
          },
          errorMessages: {
            required:
              'Please select whether you were employed during the past 12 months.',
          },
          labelHeaderLevel: '2',
        }),
        'ui:description':
          "If you have employment to report, you'll need to add at least one employer. You can add up to four. Don't have employment to report? We'll skip to Section III.",
        'ui:reviewField': reviewField,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      employmentCheck: {
        type: 'object',
        required: [employmentCheckFields.hasEmploymentInLast12Months],
        properties: {
          [employmentCheckFields.hasEmploymentInLast12Months]: radioSchema([
            'yes',
            'no',
          ]),
        },
      },
    },
  },
  updateFormData: (oldFormData, newFormData) => {
    const selection = getSelection(newFormData);
    if (selection === 'yes' || selection === 'no') {
      return applyEmploymentSelection(newFormData, selection);
    }
    return newFormData;
  },
};

EmploymentCheckReviewObjectField.propTypes = {
  renderedProperties: PropTypes.any,
  title: PropTypes.string,
};
