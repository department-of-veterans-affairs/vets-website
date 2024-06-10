import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

[
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
].forEach(page => {
  const { schema, uiSchema } = formConfig.chapters.statementTypeChapter.pages[
    page.name
  ];

  const pageTestExpectation = {
    numberOfWebComponentErrors: page.webComponentErrorCount,
    numberOfWebComponentFields: page.webComponentCount,
    pageTitle: page.title,
    schema,
    uiSchema,
  };

  testPage(pageTestExpectation);
});
