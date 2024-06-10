import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../../config/form';

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

  const pageTitle = "There's a better way for you to ask for a decision review";

  const data = {};

  const expectedNumberOfWebComponentFields = 0;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentFields,
    pageTitle,
    data,
  );

  const expectedNumberOfWebComponentErrors = 0;
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
