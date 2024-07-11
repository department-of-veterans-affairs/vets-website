import {
  validateAtLeastOneSelected,
  DescriptionText,
  AddChildTitle,
  Student674Title,
  StepchildTitle,
  OptionsReviewField,
  ChildAttendingSchool,
} from './helpers';
import { optionSelection } from '../../../utilities';

export const schema = {
  type: 'object',
  required: ['view:selectable686Options'],
  properties: {
    'view:selectable686Options': optionSelection['view:selectable686Options'],
    'view:686Information': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  'view:selectable686Options': {
    'ui:title': 'What would you like to do? Check all that apply.',
    'ui:options': { showFieldLabel: true },
    'ui:validations': [validateAtLeastOneSelected],
    addSpouse: {
      'ui:title': 'Add your spouse',
      'ui:reviewField': OptionsReviewField,
    },
    addChild: {
      'ui:title': AddChildTitle,
      'ui:reviewField': OptionsReviewField,
    },
    report674: {
      'ui:title': Student674Title,
      'ui:reviewField': OptionsReviewField,
    },
    reportDivorce: {
      'ui:title': 'Remove a divorced spouse',
      'ui:reviewField': OptionsReviewField,
    },
    reportStepchildNotInHousehold: {
      'ui:title': StepchildTitle,
      'ui:reviewField': OptionsReviewField,
    },
    reportDeath: {
      'ui:title': 'Remove a spouse, child or dependent parent who has died',
      'ui:reviewField': OptionsReviewField,
    },
    reportMarriageOfChildUnder18: {
      'ui:title': 'Remove a child under 18 who has married',
      'ui:reviewField': OptionsReviewField,
    },
    reportChild18OrOlderIsNotAttendingSchool: {
      'ui:title': ChildAttendingSchool,
      'ui:reviewField': OptionsReviewField,
    },
  },
  'view:686Information': {
    'ui:options': { showFieldLabel: false },
    'ui:description': DescriptionText,
  },
};
