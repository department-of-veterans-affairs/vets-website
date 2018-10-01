import {
  ptsdNameTitle781,
  medalsDescription,
} from '../helpers';

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
  'ui:title': ptsdNameTitle781,
  'ui:description': medalsDescription,
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
      'enum': ['yes', 'no'],
    },
    'view:selectMedals': {
      type: 'string',
      'enum': medalsList,
    },
  },
};
