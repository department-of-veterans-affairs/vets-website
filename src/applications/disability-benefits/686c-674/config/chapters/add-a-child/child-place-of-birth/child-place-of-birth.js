import merge from 'lodash/merge';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import {
  isChapterFieldRequired,
  stateTitle,
  cityTitle,
} from '../../../helpers';
import { addChild } from '../../../utilities';
import { TASK_KEYS } from '../../../constants';
import { ChildNameHeader } from '../helpers';
import { childInfo } from '../child-information/helpers';
import { childStatusDescription } from './childStatusDescription';

export const schema = addChild.properties.addChildPlaceOfBirth;

export const uiSchema = {
  childrenToAdd: {
    'ui:options': {
      viewField: childInfo,
    },
    items: {
      'ui:title': ChildNameHeader,
      placeOfBirth: {
        'ui:title': "Child's place of birth",
        state: {
          'ui:title': stateTitle,
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addChild),
        },
        city: {
          'ui:title': cityTitle,
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
          currentOrPastDateUI('Date stepchild became your dependent'),
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
      previouslyMarried: {
        'ui:widget': 'radio',
        'ui:title': 'Was this child previously married?',
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addChild),
      },
      previousMarriageDetails: {
        'ui:options': {
          expandUnder: 'previouslyMarried',
          expandUnderCondition: 'Yes',
          keepInPageOnReview: true,
        },
        dateMarriageEnded: merge(
          currentOrPastDateUI('When did the marriage end'),
          {
            'ui:required': (formData, index) =>
              formData?.childrenToAdd[`${index}`]?.previouslyMarried === 'Yes',
          },
        ),
        reasonMarriageEnded: {
          'ui:widget': 'radio',
          'ui:title': 'Reason marriage ended',
          'ui:required': (formData, index) =>
            formData?.childrenToAdd[`${index}`]?.previouslyMarried === 'Yes',
        },
        otherReasonMarriageEnded: {
          'ui:title': 'Reason marriage ended',
          'ui:options': {
            expandUnder: 'reasonMarriageEnded',
            expandUnderCondition: 'Other',
            keepInPageOnReview: true,
          },
          'ui:required': (formData, index) =>
            formData?.childrenToAdd[`${index}`]?.previousMarriageDetails
              ?.reasonMarriageEnded === 'Other',
        },
      },
    },
  },
};
