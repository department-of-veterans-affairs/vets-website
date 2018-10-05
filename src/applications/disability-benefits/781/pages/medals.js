// import _ from 'lodash/fp';
import React from 'react';
// import PropTypes from 'prop-types';
import { PtsdNameTitle, getPtsdClassification } from '../helpers';

import MedalsCheckbox from '../components/MedalsCheckbox';

const MedalsDescription = ({ formData, formType }) => {
  const { incidentText } = getPtsdClassification(formData, formType);
  //  console.log(formData, 'formdata');

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

// const medalsList = [
//   // 'Air Force Achievement Medal with “V” Device': { type: 'boolean' },
//   // 'Air Force Combat Action Medal': { type: 'boolean' },
//   // 'Air Force Commendation Medal with “V” Device': { type: 'boolean' },
//   // 'Air Force Cross': { type: 'boolean' },
//   'Air Medal with “V” Device',
//   'Army Commendation Medal with “V” Device',
//   'Bronze Star Medal with “V” Device',
//   'Combat Action Badge',
//   'Combat Action Ribbon (Note: Prior to February 1969, the Navy Achievement Medal with “V” Device was awarded.)',
//   'Combat Aircrew Insignia',
//   'Combat Infantry/Infantryman Badge',
//   'Combat Medical Badge',
//   'Distinguished Flying Cross',
//   'Distinguished Service Cross',
//   'Joint Service Commendation Medal with “V” Device',
//   'Medal of Honor',
//   'Navy Commendation Medal with “V” Device',
//   'Navy Cross',
//   'Purple Heart',
//   'Silver Star',
//   //  Other: { type: 'boolean' },
// ];

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
    //  'ui:description': 'Select all that apply',
    'ui:field': 'StringField',
    'ui:widget': MedalsCheckbox,
    hasReadPrideAndPrejudice: {
      'ui:title': 'Pride and Prejudice by Jane Austen',
    },
    hasReadJaneEyre: {
      'ui:title': 'Jane Eyre by Charlotte Brontë',
    },
    hasReadGreatGatsby: {
      'ui:title': 'The Great Gatsby by F. Scott Fitzgerald',
    },
    hasReadBuddenbrooks: {
      'ui:title': 'Buddenbrooks by Thomas Mann',
    },

    'ui:options': {
      // expandUnder: 'view:medalsChoice',
      // expandUnderCondition: 'yes',
      // expandUnderCondition: formData =>
      //   _.get('view:medalsChoice', formData, '') === 'yes',
    },
  },
  'view:otherMedal': {
    'ui:title': ' ',
    'ui:description': 'Enter other medals or citations here',
    'ui:options': {
      expandUnder: 'selectMedals',
      expandUnderCondition: true,
      // 'ui:options': {
      //   expandUnder: 'view:selecMedals',
      //
      //   expandUnderCondition: medal => !!status && status !== 'Other',
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
      type: 'string',
      //  properties: medalsList,
      properties: {
        hasReadPrideAndPrejudice: { type: 'boolean' },
        hasReadJaneEyre: { type: 'boolean' },
        hasReadGreatGatsby: { type: 'boolean' },
        hasReadBuddenbrooks: { type: 'boolean' },
      },
    },
    'view:otherMedal': {
      type: 'string',
      properties: {},
    },
  },
};
