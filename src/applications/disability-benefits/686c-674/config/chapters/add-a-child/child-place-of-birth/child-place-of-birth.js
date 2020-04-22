import { genericSchemas } from '../../../generic-schema';
import { childInfo } from '../child-information/helpers';
import { childStatusDescription } from './childStatusDescription';
import { isChapterFieldRequired } from '../../../helpers';
import { TASK_KEYS } from '../../../constants';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { merge } from 'lodash/fp';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';

export const schema = {
  type: 'object',
  properties: {
    childrenToAdd: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          childPlaceOfBirth: {
            type: 'object',
            properties: {
              state: genericSchemas.genericTextInput,
              city: genericSchemas.genericTextInput,
            },
          },
          childStatus: {
            type: 'object',
            properties: {
              biological: genericSchemas.genericTrueFalse,
              adopted: genericSchemas.genericTrueFalse,
              notCapable: genericSchemas.genericTrueFalse,
              stepchild: genericSchemas.genericTrueFalse,
              dateBecameDependent: genericSchemas.date,
            },
          },
          'view:childStatusInformation': {
            type: 'object',
            properties: {},
          },
          childPreviouslyMarried: {
            type: 'string',
            enum: ['Yes', 'No'],
            default: 'No',
          },
          childPreviousMarriageDetails: {
            type: 'object',
            properties: {
              dateMarriageEnded: genericSchemas.date,
              reasonMarriageEnded: {
                type: 'string',
                enum: ['Divorce', 'Death', 'Annulment', 'Other'],
                default: 'Divorce',
              },
              otherReasonMarriageEnded: genericSchemas.genericTextInput,
            },
          },
        },
      },
    },
  },
};

export const uiSchema = {
  childrenToAdd: {
    'ui:options': {
      itemName: 'Child',
      viewField: childInfo,
    },
    items: {
      childPlaceOfBirth: {
        'ui:title': "Child's place of birth",
        state: {
          'ui:title': 'State (or country if outside the USA)',
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addChild),
        },
        city: {
          'ui:title': 'City or county',
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addChild),
        },
      },
      childStatus: {
        'ui:title': "Your child's status (Check all that apply)",
        'ui:validations': [
          {
            validator: validateBooleanGroup,
          },
        ],
        'ui:errorMessages': {
          atLeastOne: 'You must choose at least one option',
        },
        'ui:required': () => true,
        'ui:options': {
          showFieldLabel: true,
        },
        biological: {
          'ui:title': 'Biological',
        },
        adopted: {
          'ui:title': 'Adopted',
        },
        notCapable: {
          'ui:title': 'Not capable of self-support',
        },
        stepchild: {
          'ui:title': 'Stepchild',
        },
        dateBecameDependent: merge(
          currentOrPastDateUI('Date stepchild became dependent'),
          {
            'ui:options': {
              expandUnder: 'stepchild',
              expandUnderCondition: true,
              keepInPageOnReview: true,
            },
            'ui:required': (formData, index) =>
              formData?.childrenToAdd[`${index}`]?.childStatus?.stepchild ===
              true,
          },
        ),
      },
      'view:childStatusInformation': {
        'ui:title': 'Additional evidence needed',
        'ui:description': childStatusDescription,
      },
      childPreviouslyMarried: {
        'ui:widget': 'radio',
        'ui:title': 'Was this child previously married?',
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addChild),
      },
      childPreviousMarriageDetails: {
        'ui:options': {
          expandUnder: 'childPreviouslyMarried',
          expandUnderCondition: 'Yes',
          keepInPageOnReview: true,
        },
        dateMarriageEnded: merge(
          currentOrPastDateUI('When did the marriage end'),
          {
            'ui:required': (formData, index) =>
              formData.childrenToAdd[`${index}`].childPreviouslyMarried ===
              'Yes',
          },
        ),
        reasonMarriageEnded: {
          'ui:widget': 'radio',
          'ui:title': 'Reason marriage ended',
          'ui:required': (formData, index) =>
            formData.childrenToAdd[`${index}`].childPreviouslyMarried === 'Yes',
        },
        otherReasonMarriageEnded: {
          'ui:title': 'Reason marriage ended',
          'ui:options': {
            expandUnder: 'reasonMarriageEnded',
            expandUnderCondition: 'Other',
            keepInPageOnReview: true,
          },
          'ui:required': (formData, index) =>
            formData?.childrenToAdd[`${index}`]?.childPreviousMarriageDetails
              ?.reasonMarriageEnded === 'Other',
        },
      },
    },
  },
};
