import { genericSchemas } from '../../../generic-schema';
import { childInfo } from '../child-information/helpers';
import { childStatusDescription } from './childStatusDescription';
import { isChapterFieldRequired } from '../../../helpers';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { merge } from 'lodash/fp';

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
            type: 'string',
            enum: [
              'Biological',
              'Adopted',
              'Not capable of self-support',
              'Stepchild',
            ],
          },
          dateBecameDependent: genericSchemas.date,
          'view:marriageTypeInformation': {
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
            isChapterFieldRequired(formData, 'addChild'),
        },
        city: {
          'ui:title': 'City or county',
          'ui:required': formData =>
            isChapterFieldRequired(formData, 'addChild'),
        },
      },
      childStatus: {
        'ui:title': "Your child's status (check all that apply)",
        'ui:widget': 'radio',
        'ui:required': formData => isChapterFieldRequired(formData, 'addChild'),
      },
      dateBecameDependent: merge(
        currentOrPastDateUI('Date stepchild became dependent'),
        {
          'ui:options': {
            expandUnder: 'childStatus',
            expandUnderCondition: 'Stepchild',
            keepInPageOnReview: true,
          },
          'ui:required': (formData, index) =>
            formData.childrenToAdd[`${index}`].childStatus === 'Stepchild',
        },
      ),
      'view:marriageTypeInformation': {
        'ui:description': childStatusDescription,
      },
      childPreviouslyMarried: {
        'ui:widget': 'radio',
        'ui:title': 'Was this child previously married?',
        'ui:required': formData => isChapterFieldRequired(formData, 'addChild'),
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
            formData.childrenToAdd[`${index}`].reasonMarriageEnded === 'Other',
        },
      },
    },
  },
};
