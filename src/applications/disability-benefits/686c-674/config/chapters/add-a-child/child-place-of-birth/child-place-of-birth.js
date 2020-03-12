import { genericSchemas } from '../../../generic-schema';
import { childInfo } from '../child-information/helpers';
import { isChapterFieldRequired } from '../../../helpers';
import { childStatusDescription } from './childStatusField';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import _ from 'lodash/fp';

export const schema = {
  type: 'object',
  properties: {
    childrenToAdd: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          state: genericSchemas.genericUSAStateDropdown,
          city: genericSchemas.genericTextInput,
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
          'view:marriageTypeInformation': {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
}

export const uiSchema = {
  childrenToAdd: {
    'ui:options': {
      itemName: 'Child',
      viewField: childInfo,
    },
    items: {
      state: {
        'ui:title': 'State (or country if outside the USA)',
      },
      city: {
        'ui:title': 'City or county',
      },
      childStatus: {
        'ui:title': 'Your child\'s status (check all that apply)',
        dateBecameDependent: _.merge(currentOrPastDateUI('Date stepchild became dependent'), {
          'ui:options': {
            expandUnder: 'stepchild',
            expandUnderCondition: true,
            keepInPageOnReview: true,
          },
        }),
      },
      'view:marriageTypeInformation': {
        'ui:description': childStatusDescription,
      },
    },
  },
}

