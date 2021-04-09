import { submit, transformForSubmit } from './submit-questionnaire';
import { loadQuestionnaires } from './load-questionnaires';
import environment from 'platform/utilities/environment';
import { loadPdfData } from './load-pdf';

const USE_MOCK_DATA =
  window.Cypress || environment.isLocalhost() || environment.isStaging();

const loadQuestionnairesCurry = () => loadQuestionnaires(USE_MOCK_DATA);
const submitCurry = (form, formConfig) => submit(false, form, formConfig);
const pdfCurry = questionnaireResponseId =>
  loadPdfData(USE_MOCK_DATA, questionnaireResponseId);

export {
  submitCurry as submit,
  transformForSubmit,
  loadQuestionnairesCurry as loadQuestionnaires,
  pdfCurry as loadPdfData,
};
