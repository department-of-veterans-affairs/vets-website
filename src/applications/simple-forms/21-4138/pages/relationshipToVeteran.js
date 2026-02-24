import {
  radioUI,
  radioSchema,
  textUI,
  textSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const RELATIONSHIP_OPTIONS = {
  servedWith: 'I served with the Veteran',
  familyFriend: "I'm the Veteran’s family member or friend",
  coworkerSupervisor: 'I’m the Veteran’s coworker or supervisor',
  notListed: 'We have a relationship not listed here',
};

/** @type {PageSchema} */
export const relationshipToVeteranPage = {
  uiSchema: {
    ...titleUI({
      title: 'What’s your relationship to the Veteran?',
      headerLevel: 1,
    }),
    relationshipToVeteran: radioUI({
      title: 'What’s your relationship to the Veteran?',
      labels: RELATIONSHIP_OPTIONS,
      errorMessages: {
        required: 'Select your relationship to the Veteran',
      },
      labelHeaderLevel: '3',
      labelHeaderLevelStyle: '3',
    }),
    relationshipToVeteranOther: textUI({
      title:
        'Since your relationship with the Veteran was not listed, please describe it here',
      errorMessages: {
        required: 'Enter your relationship to the Veteran',
      },
      required: formData => formData?.relationshipToVeteran === 'notListed',
      expandUnder: 'relationshipToVeteran',
      expandUnderCondition: val => val === 'notListed',
    }),
  },
  schema: {
    type: 'object',
    required: ['relationshipToVeteran'],
    properties: {
      relationshipToVeteran: radioSchema(Object.keys(RELATIONSHIP_OPTIONS)),
      relationshipToVeteranOther: textSchema,
    },
  },
};
