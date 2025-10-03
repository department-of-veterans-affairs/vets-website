import React from 'react';
import PropTypes from 'prop-types';
import {
  currencyUI,
  currencySchema,
  titleUI,
  radioUI,
  radioSchema,
  textUI,
  textSchema,
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import get from 'platform/utilities/data/get';
import { travelerTypeLabels } from '../../../utils/labels';
import ListItemView from '../../../components/ListItemView';

const {
  childName,
} = fullSchemaPensions.definitions.medicalExpenses.items.properties;

const MileageView = ({ formData }) => (
  <ListItemView title={formData.provider} />
);

MileageView.propTypes = {
  formData: PropTypes.shape({
    provider: PropTypes.string,
  }),
};

/** @type {PageSchema} */
export default {
  title: 'Mileage report',
  path: 'expenses/mileage/add',
  depends: formData => formData.hasMileage === true,
  uiSchema: {
    ...titleUI(
      'Report mileage',
      'Report miles traveled for medical purposes (e.g. hospital, clinic, pharmacy, etc.) in a privately owned vehicle (POV) such as a car, truck or motorcycle.',
    ),
    mileage: {
      'ui:title': 'Add mileage',
      'ui:options': {
        itemName: 'Mileage',
        itemAriaLabel: data => `Mileage to ${data.travelLocation}`,
        viewField: MileageView,
        reviewTitle: 'Mileage',
        keepInPageOnReview: true,
        confirmRemove: true,
        useDlWrap: true,
        useVaCards: true,
        showSave: true,
        reviewMode: true,
        customTitle: '',
      },
      items: {
        traveler: radioUI({
          title: 'Who needed to travel?',
          labels: travelerTypeLabels,
          classNames: 'vads-u-margin-bottom--2',
        }),
        childName: {
          'ui:title': 'Enter the child’s name',
          'ui:webComponentField': VaTextInputField,
          'ui:options': {
            classNames: 'vads-u-margin-bottom--2',
            expandUnder: 'traveler',
            expandUnderCondition: 'CHILD',
          },
          'ui:required': (form, index) =>
            get(['medicalExpenses', index, 'recipients'], form) === 'DEPENDENT',
        },
        travelLocation: textUI('Travel location'),
        travelMilesTraveled: numberUI('Miles traveled'),
        travelReimbursementAmount: currencyUI(
          'Amount reimbursed from any source',
        ),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      mileage: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['traveler', 'travelLocation', 'travelMilesTraveled'],
          properties: {
            traveler: radioSchema(Object.keys(travelerTypeLabels)),
            childName,
            travelLocation: textSchema,
            travelMilesTraveled: numberSchema,
            travelReimbursementAmount: currencySchema,
          },
        },
      },
    },
  },
};
