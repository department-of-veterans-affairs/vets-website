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
  yesNoUI,
  yesNoSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { travelerTypeLabels } from '../../../utils/labels';
import ListItemView from '../../../components/ListItemView';

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
        }),
        childName: textUI({
          title: 'Enter the child’s name',
          expandUnder: 'traveler',
          expandUnderCondition: field => {
            return field === 'DEPENDENT' || field === 'OTHER';
          },
          hideIf: (formData, index) =>
            !['DEPENDENT', 'OTHER'].includes(
              formData?.mileage?.[index]?.traveler,
            ),
          required: (formData, index) =>
            ['DEPENDENT', 'OTHER'].includes(
              formData?.mileage?.[index]?.traveler,
            ),
        }),
        travelLocation: radioUI({
          title: 'Who is the expense for?',
          labels: {
            HOSPITAL: 'Hospital',
            CLINIC: 'Clinic',
            PHARMACY: 'Pharmacy',
            OTHER: 'Other',
          },
          descriptions: {
            CLINIC:
              'This would be a doctor’s office, dentist, or other outpatient medical provider.',
          },
        }),
        travelLocationOther: textUI({
          title: 'Tell us where you traveled',
          expandUnder: 'travelLocation',
          expandUnderCondition: field => field === 'OTHER',
          hideIf: (formData, index) =>
            formData?.mileage?.[index]?.travelLocation !== 'OTHER',
          required: (formData, index) =>
            formData?.mileage?.[index]?.travelLocation === 'OTHER',
        }),
        travelMilesTraveled: numberUI('Miles traveled'),
        travelDate: currentOrPastDateUI({
          title: 'What’s the date of your travel?',
          monthSelect: false,
        }),
        travelReimbursed: yesNoUI('Were you reimbursed from another source?'),
        travelReimbursementAmount: currencyUI({
          title: 'How much were you reimbursed?',
          expandUnder: 'travelReimbursed',
          expandUnderCondition: field => field === true,
        }),
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
          required: [
            'traveler',
            'travelLocation',
            'travelMilesTraveled',
            'travelReimbursed',
          ],
          properties: {
            traveler: radioSchema(Object.keys(travelerTypeLabels)),
            childName: textSchema,
            travelLocation: radioSchema([
              'HOSPITAL',
              'CLINIC',
              'PHARMACY',
              'OTHER',
            ]),
            travelLocationOther: textSchema,
            travelMilesTraveled: numberSchema,
            travelDate: currentOrPastDateSchema,
            travelReimbursed: yesNoSchema,
            travelReimbursementAmount: currencySchema,
          },
        },
      },
    },
  },
};
