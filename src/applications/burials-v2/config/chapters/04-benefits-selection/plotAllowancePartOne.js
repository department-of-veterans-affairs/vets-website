import React from 'react';
import PropTypes from 'prop-types';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import {
  yesNoUI,
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

const { govtContributions } = fullSchemaBurials.properties;
const currencyReviewRowView = ({ children }) => {
  return (
    <div className="review-row">
      <dt>{children?.props?.uiSchema?.['ui:title']}</dt>
      <dd>${children}</dd>
    </div>
  );
};

currencyReviewRowView.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.object,
  }),
};

export default {
  uiSchema: {
    'ui:title': generateTitle('Plot or interment allowance'),
    govtContributions: {
      ...yesNoUI({
        title:
          'Did the federal government, state government, or the Veteran’s employer pay any of the burial costs?',
        errorMessages: 'Select yes or no',
      }),
      'ui:options': { classNames: 'vads-u-margin-bottom--2' },
    },
    amountGovtContribution: {
      ...numberUI({
        title: 'Amount the government or employer paid',
        hideIf: form => !form?.govtContributions,
        min: 0,
        // max: 99999999999999,
      }),
      'ui:required': form => form?.govtContributions,
      'ui:reviewField': currencyReviewRowView,
    },
  },
  schema: {
    type: 'object',
    required: ['govtContributions'],
    properties: {
      govtContributions,
      amountGovtContribution: numberSchema,
    },
  },
};
