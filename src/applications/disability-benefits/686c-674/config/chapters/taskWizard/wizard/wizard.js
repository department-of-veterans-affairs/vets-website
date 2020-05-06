import {
  validateAtLeastOneSelected,
  DescriptionText,
  AddChildTitle,
  Student674Title,
  StepchildTitle,
} from './helpers';
import { optionSelection } from '../../../utilities';

export const schema = {
  type: 'object',
  required: ['view:selectable686Options'],
  properties: {
    'view:686Information': {
      type: 'object',
      properties: {},
    },
    'view:selectable686Options': optionSelection['view:selectable686Options'],
  },
};

export const uiSchema = {
  'view:686Information': {
    'ui:options': { showFieldLabel: false },
    'ui:description': DescriptionText,
  },
  'view:selectable686Options': {
    'ui:title': 'What would you like to do?',
    'ui:options': { showFieldLabel: true },
    'ui:validations': [validateAtLeastOneSelected],
    addChild: {
      'ui:title': AddChildTitle,
    },
    addSpouse: {
      'ui:title': 'Claim benefits for a spouse',
    },
    reportDivorce: {
      'ui:title': 'Report a divorce',
    },
    reportStepchildNotInHousehold: {
      'ui:title': StepchildTitle,
    },
    reportDeath: {
      'ui:title': 'Report the death of a spouse, child or dependent parent',
    },
    reportMarriageOfChildUnder18: {
      'ui:title': 'Report the marriage of a child under 18',
    },
    reportChild18OrOlderIsNotAttendingSchool: {
      'ui:title':
        'Report that a child 18 to 23 years old has stopped attending school',
    },
    report674: {
      'ui:title': Student674Title,
    },
  },
};
