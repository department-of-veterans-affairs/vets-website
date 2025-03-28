import React from 'react';
import PropTypes from 'prop-types';
import { checkboxGroupSchema } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import EditReviewSupplies from '../components/EditReviewSupplies';

import {
  numberOfSuppliesPhrase,
  suppliesReplaceSchema,
  suppliesUpdateUiSchema,
  suppliesUi,
} from '../utils/helpers';

export const Description = ({ formData }) => {
  const count = formData?.supplies?.length || 0;

  return (
    <>
      <h3>Available for reorder</h3>
      <p>
        You have {numberOfSuppliesPhrase(count)} that are available for reorder.
      </p>
      <p>
        <strong>Note:</strong> We’ll send you a 6-month supply of each item
        added to your order. You can only order each item once every 5 months.
      </p>
    </>
  );
};

Description.propTypes = {
  formData: PropTypes.shape({
    supplies: PropTypes.array,
  }),
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:objectViewField': EditReviewSupplies,
    'ui:description': Description,
    chosenSupplies: suppliesUi({
      title: 'Select available supplies for reorder',
      tile: true,
      replaceSchema: suppliesReplaceSchema,
      updateUiSchema: suppliesUpdateUiSchema,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      chosenSupplies: checkboxGroupSchema([]),
    },
  },
};
