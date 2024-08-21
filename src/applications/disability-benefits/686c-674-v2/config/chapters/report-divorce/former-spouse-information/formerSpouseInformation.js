import {
  titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { TASK_KEYS } from '../../../constants';
import { isChapterFieldRequired } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    reportDivorce: {
      type: 'object',
      properties: {
        fullName: fullNameNoSuffixSchema,
        ssn: ssnSchema,
        birthDate: dateOfBirthSchema,
      },
    },
  },
};

export const uiSchema = {
  reportDivorce: {
    ...titleUI('Divorced spouse’s information'),
    fullName: {
      ...fullNameNoSuffixUI(title => `Former spouse’s ${title}`),
      'ui:options': {
        width: 'md',
      },
    },
    ssn: {
      ...ssnUI('Former spouse’s Social Security number'),
      'ui:required': formData =>
        isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
      'ui:options': {
        width: 'md',
      },
    },
    birthDate: {
      ...dateOfBirthUI('Former spouse’s date of birth'),
      'ui:required': formData =>
        isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
    },
    // date: merge(currentOrPastDateUI('Date of divorce'), {
    //   'ui:required': formData =>
    //     isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
    // }),
    // location: locationUISchema(
    //   'reportDivorce',
    //   'location',
    //   false,
    //   'Where did this marriage end?',
    //   TASK_KEYS.reportDivorce,
    // ),
    // reasonMarriageEnded: {
    //   'ui:required': formData =>
    //     isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
    //   'ui:title': 'Reason marriage ended',
    //   'ui:widget': 'radio',
    //   'ui:errorMessages': {
    //     required: 'Select an option',
    //   },
    //   'ui:options': {
    //     updateSchema: () => ({
    //       enumNames: ['Divorce', 'Annulment or other'],
    //     }),
    //   },
    // },
    // explanationOfOther: {
    //   'ui:title': 'Give a brief explanation',
    //   'ui:required': formData =>
    //     formData?.reportDivorce?.reasonMarriageEnded === 'Other',
    //   'ui:options': {
    //     expandUnder: 'reasonMarriageEnded',
    //     expandUnderCondition: 'Other',
    //   },
    // },
    // spouseIncome: {
    //   'ui:options': {
    //     hideIf: () => environment.isProduction(),
    //     hideEmptyValueInReview: true,
    //   },
    //   'ui:title': PensionIncomeRemovalQuestionTitle,
    //   'ui:widget': 'yesNo',
    // },
  },
};
