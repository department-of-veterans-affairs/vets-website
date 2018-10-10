import React from 'react';
import { PtsdNameTitle, getPtsdClassification } from '../helpers';

import MedalsModal from '../components/MedalsModal';

const MedalsDescription = ({ formData, formType }) => {
  const { incidentText } = getPtsdClassification(formData, formType);

  return (
    <div>
      <p>
        Now we'll ask about the event or events that caused your
        {` ${incidentText}`}
        -related PTSD. If there is more than one event you want to tell us
        about, we‘ll ask questions about each event separetely.
      </p>
      <p>Did you receive a medal or citation for the first event?</p>
    </div>
  );
};

export const uiSchema = {
  'ui:title': PtsdNameTitle,
  'ui:description': ({ formData }) => (
    <MedalsDescription formData={formData} formType="781" />
  ),
  'view:medalsChoice': {
    'ui:title': ' ',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        yes: 'Yes',
        no: 'No',
      },
    },
  },
  selectMedals: {
    'ui:title': ' ',
    'ui:description': 'Please choose the medals or citations you received',
    'ui:field': 'StringField',
    'ui:widget': MedalsModal,
    'ui:options': {
      showFieldLabel: 'label',
      label: 'test',
      widgetClassNames: 'widget-outline',
      keepInPageOnReview: true,
      // expandUnder: 'view:medalsChoice',
      // expandUnderCondition: 'yes', // TODO: unable to enable expandUnderConditons twice in a ui:schema
    },
  },
  'view:otherMedal': {
    'ui:title': ' ',
    'ui:description': 'Enter other medals or citations here',
    'ui:options': {
      expandUnder: 'selectMedals',
      // TODO: unable to enable expandUnderConditons twice in a ui:schema
      expandUnderCondition: formData => {
        if (formData) {
          const other = formData.filter(
            medal => medal === 'Other medal(s) or citations',
          );

          if (other.length > 0) {
            return true;
          }
        }
        return false;
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:medalsChoice': {
      type: 'string',
      enum: ['yes', 'no'],
    },
    selectMedals: {
      type: 'array',
      items: {
        type: 'object',
        properties: {},
      },
    },

    'view:otherMedal': {
      type: 'string',
      properties: {},
    },
  },
};
