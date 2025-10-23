import merge from 'lodash/merge';
import currentOrPastDateUI from '@department-of-veterans-affairs/platform-forms-system/currentOrPastDate';
import ssnUI from '@department-of-veterans-affairs/platform-forms-system/ssn';
import { validateBooleanGroup } from '@department-of-veterans-affairs/platform-forms-system/validation';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { isChapterFieldRequired } from '../../../helpers';
import { addChild } from '../../../utilities';
import { TASK_KEYS } from '../../../constants';
import { ChildNameHeader } from '../helpers';
import { childInfo } from '../child-information/helpers';
import { childStatusDescription } from './childStatusDescription';
import { notSelfSufficientDescription } from './notSelfSufficientDescription';
import { locationUISchema } from '../../../location-schema';

export const schema = addChild.properties.addChildPlaceOfBirth;

export const uiSchema = {
  childrenToAdd: {
    'ui:options': {
      viewField: childInfo,
    },
    items: {
      'ui:title': ChildNameHeader,
      placeOfBirth: locationUISchema(
        'childrenToAdd',
        'placeOfBirth',
        true,
        "Child's place of birth",
        'addChild',
      ),
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
          'ui:options': {
            hideEmptyValueInReview: true,
          },
        },
        adopted: {
          'ui:title': 'Adopted',
          'ui:options': {
            hideEmptyValueInReview: true,
          },
        },
        stepchild: {
          'ui:title': 'Stepchild',
          'ui:options': {
            hideEmptyValueInReview: true,
          },
        },
        biologicalStepchild: {
          'ui:title': 'Is this child the biological child of your spouse?',
          'ui:widget': 'yesNo',
          'ui:required': (formData, index) =>
            formData?.childrenToAdd[`${index}`]?.childStatus?.stepchild ===
            true,
          'ui:options': {
            expandUnder: 'stepchild',
          },
        },
        dateBecameDependent: merge(
          currentOrPastDateUI('Date the child entered your household'),
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
        stepchildParent: {
          'ui:options': {
            expandUnder: 'stepchild',
            expandUnderCondition: true,
          },
          first: {
            'ui:title': 'Parent’s first name',
            'ui:required': (formData, index) =>
              formData?.childrenToAdd[`${index}`]?.childStatus?.stepchild ===
              true,
          },
          middle: {
            'ui:title': 'Child’s middle name',
            'ui:options': {
              hideEmptyValueInReview: true,
              hideIf: () => true,
            },
          },
          last: {
            'ui:title': 'Parent’s last name',
            'ui:required': (formData, index) =>
              formData?.childrenToAdd[`${index}`]?.childStatus?.stepchild ===
              true,
          },
          suffix: {
            'ui:title': 'Child’s suffix',
            'ui:options': {
              widgetClassNames: 'usa-input-medium',

              hideEmptyValueInReview: true,
              hideIf: () => true,
            },
          },
        },
        ssn: {
          ...ssnUI,
          'ui:title': 'Parent’s Social Security number',
          'ui:required': (formData, index) =>
            formData?.childrenToAdd[`${index}`]?.childStatus?.stepchild ===
            true,
          'ui:options': {
            widgetClassNames: 'usa-input-medium',
            expandUnder: 'stepchild',
            expandUnderCondition: true,
          },
        },
        birthDate: merge(currentOrPastDateUI("Parent's date of birth"), {
          'ui:required': (formData, index) =>
            formData?.childrenToAdd[`${index}`]?.childStatus?.stepchild ===
            true,
          'ui:options': {
            expandUnder: 'stepchild',
            expandUnderCondition: true,
          },
        }),
      },
      'view:childStatusInformation': {
        'ui:title': 'Additional evidence needed to add children',
        'ui:description': childStatusDescription,
      },
      notSelfSufficient: {
        'ui:title':
          'Is this child permanently unable to support themself because of a mental or physical disability?',
        'ui:widget': 'yesNo',
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addChild),
      },
      'view:notSelfSufficientDescription': {
        'ui:description': notSelfSufficientDescription,
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
      childIncome: {
        'ui:options': {
          hideIf: () => environment.isProduction(),
          hideEmptyValueInReview: true,
        },
        'ui:title': 'Did this child have income in the last 365 days?',
        'ui:description':
          'Answer this question only if you are adding this dependent to your pension.',
        'ui:widget': 'yesNo',
      },
    },
  },
};
