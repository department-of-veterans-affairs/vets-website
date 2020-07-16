import { TASK_KEYS } from '../../../constants';
import { isChapterFieldRequired } from '../../../helpers';
import DependentViewField from '../../../../components/DependentViewField';
import { validateName, deceasedDependents } from '../../../utilities';

export const schema = deceasedDependents.properties.dependentInformation;

export const uiSchema = {
  deaths: {
    'ui:options': {
      viewField: DependentViewField,
      itemName: 'deceased dependent',
    },
    items: {
      'ui:title': 'Dependent who is deceased',
      fullName: {
        'ui:validations': [validateName],
        first: {
          'ui:title': 'First name',
          'ui:errorMessages': { required: 'Please enter a first name' },
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
        },
        middle: {
          'ui:title': 'Middle name',
        },
        last: {
          'ui:title': 'Last name',
          'ui:errorMessages': { required: 'Please enter a last name' },
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
        },
        suffix: {
          'ui:title': 'Suffix',
          'ui:options': { widgetClassNames: 'form-select-medium' },
        },
      },
      dependentType: {
        'ui:title': "What was your dependent's status?",
        'ui:widget': 'radio',
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
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
        },
        childUnder18: {
          'ui:title': 'Child under 18',
        },
        stepChild: {
          'ui:title': 'Stepchild',
        },
        adopted: {
          'ui:title': 'Adopted child',
        },
        disabled: {
          'ui:title': 'Child incapable of self-support',
        },
        childOver18InSchool: {
          'ui:title': 'Child 18-23 and in school',
        },
      },
    },
  },
};
