import { submit, transformForSubmit } from './submit-questionnaire';
import { loadQuestionnaires } from './load-questionnaires';
import environment from 'platform/utilities/environment';

const USE_MOCK_DATA =
  window.Cypress || environment.isLocalhost || environment.isStaging;

const loadQuestionnairesCurry = () => loadQuestionnaires(USE_MOCK_DATA);
const submitCurry = (form, formConfig) =>
  submit(USE_MOCK_DATA, form, formConfig);

export {
  submitCurry as submit,
  transformForSubmit,
  loadQuestionnairesCurry as loadQuestionnaires,
};
