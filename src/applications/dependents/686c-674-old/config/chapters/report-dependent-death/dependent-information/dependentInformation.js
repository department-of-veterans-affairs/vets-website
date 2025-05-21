import merge from 'lodash/merge';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { TASK_KEYS } from '../../../constants';
import { isChapterFieldRequired } from '../../../helpers';
import DependentViewField from '../../../../components/DependentViewField';
import { validateName, deceasedDependents } from '../../../utilities';

export const schema = deceasedDependents.properties.dependentInformation;

export const uiSchema = {
  deaths: {
    'ui:options': {
      viewField: DependentViewField,
      itemName: 'Deceased dependent',
      keepInPageOnReview: true,
      customTitle: ' ',
    },
    items: {
      'ui:title': 'Dependent who is deceased',
      fullName: {
        'ui:validations': [validateName],
        first: {
          'ui:title': 'First name',
          'ui:errorMessages': {
            required: 'Enter a first name',
            pattern: 'This field accepts alphabetic characters only',
          },
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
          'ui:options': {
            useDlWrap: true,
          },
        },
        middle: {
          'ui:title': 'Middle name',
          'ui:options': {
            useDlWrap: true,
            hideEmptyValueInReview: true,
          },
          'ui:errorMessages': {
            pattern: 'This field accepts alphabetic characters only',
          },
        },
        last: {
          'ui:title': 'Last name',
          'ui:errorMessages': {
            required: 'Enter a last name',
            pattern: 'This field accepts alphabetic characters only',
          },
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
          'ui:options': {
            useDlWrap: true,
          },
        },
        suffix: {
          'ui:title': 'Suffix',
          'ui:options': {
            widgetClassNames: 'form-select-medium',
            useDlWrap: true,
            hideEmptyValueInReview: true,
          },
        },
      },
      ssn: {
        ...ssnUI,
        'ui:title': 'Dependent’s Social Security number',
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
        'ui:options': {
          useDlWrap: true,
          widgetClassNames: 'usa-input-medium',
        },
      },
      birthDate: merge(currentOrPastDateUI('Dependent’s date of birth'), {
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
        'ui:options': {
          useDlWrap: true,
        },
      }),
      dependentType: {
        'ui:title': "What was your dependent's status?",
        'ui:widget': 'radio',
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
        'ui:options': {
          useDlWrap: true,
        },
      },
      childStatus: {
        'ui:title': "Child's status (Check all that apply)",
        'ui:required': (formData, index) =>
          formData.deaths[`${index}`].dependentType === 'CHILD',
        'ui:options': {
          expandUnder: 'dependentType',
          expandUnderCondition: 'CHILD',
          showFieldLabel: true,
          keepInPageOnReview: true,
          useDlWrap: true,
        },
        childUnder18: {
          'ui:title': 'Child under 18',
          'ui:options': {
            useDlWrap: true,
          },
        },
        stepChild: {
          'ui:title': 'Stepchild',
          'ui:options': {
            useDlWrap: true,
          },
        },
        adopted: {
          'ui:title': 'Adopted child',
          'ui:options': {
            useDlWrap: true,
          },
        },
        disabled: {
          'ui:title': 'Child incapable of self-support',
          'ui:options': {
            useDlWrap: true,
          },
        },
        childOver18InSchool: {
          'ui:title': 'Child 18-23 and in school',
          'ui:options': {
            useDlWrap: true,
          },
        },
      },
    },
  },
};
