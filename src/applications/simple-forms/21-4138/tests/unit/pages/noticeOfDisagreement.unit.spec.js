import formConfig from '../../../config/form';
import { testPage } from './pageTests.spec';

[
  'newSupplementalClaimPage',
  'supplementalClaimPage',
  'higherLevelReviewPage',
  'boardAppealPage',
].forEach(page => {
  const { schema, uiSchema } = formConfig.chapters.statementTypeChapter.pages[
    page
  ];
  const pageTestExpectation = {
    data: {},
    numberOfWebComponentErrors: 0,
    numberOfWebComponentFields: 0,
    pageTitle: "There's a better way for you to ask for a decision review",
    schema,
    uiSchema,
  };

  testPage(pageTestExpectation);
});
