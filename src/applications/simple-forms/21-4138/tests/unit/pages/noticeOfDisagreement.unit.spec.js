import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

const pages = [
  'newSupplementalClaimPage',
  'supplementalClaimPage',
  'higherLevelReviewPage',
  'boardAppealPage',
];

pages.forEach(page => {
  const { schema, uiSchema } = formConfig.chapters.statementTypeChapter.pages[
    page
  ];
  const pageConfig = {
    data: {},
    numberOfErrors: 0,
    numberOfFields: 0,
    numberOfWebComponentErrors: 0,
    numberOfWebComponentFields: 0,
    pageTitle: "There's a better way for you to ask for a decision review",
    schema,
    uiSchema,
  };

  testPage(pageConfig);
});
