import { testNumberOfFields } from '../pageTests.spec';
import formConfig from '../../../config/form';
import supportingDocuments from '../../../config/chapters/06-additional-information/supportingDocuments';

const { schema, uiSchema } = supportingDocuments;

describe('Supporting documents pension page', () => {
  const pageTitle = 'Supporting documents';
  const expectedNumberOfFields = 0;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );
});
