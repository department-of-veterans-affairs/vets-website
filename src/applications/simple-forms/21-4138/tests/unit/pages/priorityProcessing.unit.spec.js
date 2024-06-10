import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../../config/form';

const pages = [
  {
    name: 'aboutPriorityProcessingPage',
    title: 'What to know before you request priority processing',
  },
  {
    name: 'housingRisksPage',
    title: 'Which of these statements best describes your living situation?',
    webComponentCount: 7,
    webComponentErrorCount: 1,
  },
  {
    name: 'otherHousingRisksPage',
    title: 'Other housing risks',
    webComponentCount: 1,
  },
  {
    name: 'hardshipsPage',
    title: 'Which of these descriptions is true for you?',
    webComponentCount: 8,
    webComponentErrorCount: 1,
  },
  {
    name: 'priorityProcessingNotQualifiedPage',
    title: 'You may not qualify for priority processing',
  },
  {
    name: 'priorityProcessingRequestPage',
    title: "There's a better way to request priority processing",
  },
];

pages.forEach(page => {
  const { schema, uiSchema } = formConfig.chapters.statementTypeChapter.pages[
    page.name
  ];

  const pageTitle = page.title;

  const data = {};

  const expectedNumberOfWebComponentFields = page.webComponentCount || 0;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentFields,
    pageTitle,
    data,
  );

  const expectedNumberOfWebComponentErrors = page.webComponentErrorCount || 0;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentErrors,
    pageTitle,
    data,
  );

  const expectedNumberOfFields = 0;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
    data,
  );

  const expectedNumberOfErrors = 0;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
    data,
  );
});
