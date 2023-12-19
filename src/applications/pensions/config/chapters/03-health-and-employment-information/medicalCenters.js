import React from 'react';
import PropTypes from 'prop-types';

import { VaTextInputField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';

// View component for Medical Center
const MedicalCenterView = ({ formData }) => {
  return (
    <h3 className="vads-u-font-size--h5 vads-u-margin-y--1">
      {formData.medicalCenter}
    </h3>
  );
};

MedicalCenterView.propTypes = {
  formData: PropTypes.shape({
    medicalCenter: PropTypes.string,
  }),
};

/**
 * Function to generate UI Schema and Schema for medical centers
 * @param {string} medicalCentersKey - Key for medical centers in the schema
 * @param {string} medicalCentersTitle - Title for the medical centers in UI
 * @param {string} medicalCenterMessage - Message for individual medical centers in UI
 * @param {string} medicalCenterFieldLabel - Label for the medical center field in UI
 * @param {string} medicalCentersReviewTitle - Review title for medical centers
 * @returns {Object} - Object containing uiSchema and schema
 */
const generateMedicalCentersSchemas = (
  medicalCentersKey = 'medicalCenters',
  medicalCentersTitle = 'Default Medical Centers Title',
  medicalCenterMessage = 'Default Message',
  medicalCenterFieldLabel = 'Default Field Label',
  medicalCentersReviewTitle = 'Default Review Title',
) => {
  return {
    uiSchema: {
      'ui:title': medicalCentersTitle,
      [medicalCentersKey]: {
        'ui:title': medicalCenterMessage,
        'ui:options': {
          itemName: 'medical center',
          viewField: MedicalCenterView,
          reviewTitle: medicalCentersReviewTitle,
        },
        items: {
          medicalCenter: {
            'ui:title': medicalCenterFieldLabel,
            'ui:webComponentField': VaTextInputField,
          },
        },
      },
    },
    schema: {
      type: 'object',
      properties: {
        [medicalCentersKey]: {
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
};

export default generateMedicalCentersSchemas;
