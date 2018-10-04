import React from 'react';
import { PtsdNameTitle, getPtsdClassification } from '../helpers';

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

const medalsList = [
  'Air Force Achievement Medal with “V” Device',
  'Air Force Combat Action Medal',
  'Air Force Commendation Medal with “V” Device',
  'Air Force Cross',
  'Air Medal with “V” Device',
  'Army Commendation Medal with “V” Device',
  'Bronze Star Medal with “V” Device',
  'Combat Action Badge',
  'Combat Action Ribbon (Note: Prior to February 1969, the Navy Achievement Medal with “V” Device was awarded.)',
  'Combat Aircrew Insignia',
  'Combat Infantry/Infantryman Badge',
  'Combat Medical Badge',
  'Distinguished Flying Cross',
  'Distinguished Service Cross',
  'Joint Service Commendation Medal with “V” Device',
  'Medal of Honor',
  'Navy Commendation Medal with “V” Device',
  'Navy Cross',
  'Purple Heart',
  'Silver Star',
];

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
  'view:selectMedals': {
    'ui:title': ' ',
    'ui:description': 'Please choose the medals or citations you received',
    //  'ui:help': patientAcknowledgmentText,
    'ui:options': {
      expandUnder: 'view:medalsChoice',
      expandUnderCondition: 'yes',
      //  showFieldLabel: true,
    },

    // 'view:uploadPtsdChoiceHelp': {
    //   'ui:description': ptsdChoiceDescription,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:medalsChoice': {
      type: 'string',
      enum: ['yes', 'no'],
    },
    'view:selectMedals': {
      type: 'string',
      enum: medalsList,
    },
  },
};
