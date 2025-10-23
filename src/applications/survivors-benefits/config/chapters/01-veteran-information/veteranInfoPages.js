import { vetInfoNameDob, vetInfoQuestions } from './veteranInformation';

/** @type {PageSchema} */
const vetInfoNameDobPage = {
  title: "Veteran's identification information",
  path: 'veteran/name-and-dob',
  uiSchema: vetInfoNameDob.uiSchema,
  schema: vetInfoNameDob.schema,
};

/** @type {PageSchema} */
const vetInfoQuestionsPage = {
  title: 'Additional veteran information',
  path: 'veteran/identification-info',
  uiSchema: vetInfoQuestions.uiSchema,
  schema: vetInfoQuestions.schema,
};

export { vetInfoNameDobPage, vetInfoQuestionsPage };
