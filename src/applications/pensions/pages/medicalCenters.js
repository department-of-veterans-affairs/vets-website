import React from 'react';
import PropTypes from 'prop-types';

import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

const MedicalCenterView = ({ formData }) => {
  return (
    <p>
      <strong>{formData.medicalCenter}</strong>
    </p>
  );
};

MedicalCenterView.propTypes = {
  formData: PropTypes.shape({
    medicalCenter: PropTypes.string,
  }),
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'VA medical centers',
    medicalCenters: {
      'ui:title':
        'Enter all VA medical centers where you have received treatment',
      'ui:options': {
        itemName: 'medical center',
        viewField: MedicalCenterView,
        reviewTitle: 'VA medical centers',
      },
      items: {
        medicalCenter: {
          'ui:title': 'VA medical center',
          'ui:webComponentField': VaTextInputField,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      medicalCenters: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['medicalCenter'],
          properties: {
            medicalCenter: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};
