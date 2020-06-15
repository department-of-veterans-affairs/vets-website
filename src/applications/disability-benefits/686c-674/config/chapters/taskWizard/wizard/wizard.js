import {
  validateAtLeastOneSelected,
  DescriptionText,
  AddChildTitle,
  Student674Title,
  StepchildTitle,
  OptionsReviewField,
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
    'ui:title': 'What would you like to do? Check all that apply.',
    'ui:options': { showFieldLabel: true },
    'ui:validations': [validateAtLeastOneSelected],
    addChild: {
      'ui:title': AddChildTitle,
      'ui:reviewField': OptionsReviewField,
    },
    addSpouse: {
      'ui:title': 'Claim benefits for a spouse',
      'ui:reviewField': OptionsReviewField,
    },
    reportDivorce: {
      'ui:title': 'Report a divorce',
      'ui:reviewField': OptionsReviewField,
    },
    reportStepchildNotInHousehold: {
      'ui:title': StepchildTitle,
      'ui:reviewField': OptionsReviewField,
    },
    reportDeath: {
      'ui:title': 'Report the death of a spouse, child or dependent parent',
      'ui:reviewField': OptionsReviewField,
    },
    reportMarriageOfChildUnder18: {
      'ui:title': 'Report the marriage of a child under 18',
      'ui:reviewField': OptionsReviewField,
    },
    reportChild18OrOlderIsNotAttendingSchool: {
      'ui:title':
        'Report that a child 18 to 23 years old has stopped attending school',
      'ui:reviewField': OptionsReviewField,
    },
    report674: {
      'ui:title': Student674Title,
      'ui:reviewField': OptionsReviewField,
    },
  },
};
