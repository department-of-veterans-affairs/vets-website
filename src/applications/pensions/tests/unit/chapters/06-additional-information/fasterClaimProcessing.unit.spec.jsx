import { testNumberOfFields } from '../pageTests.spec';
import formConfig from '../../../../config/form';
import fasterClaimProcessing from '../../../../config/chapters/06-additional-information/fasterClaimProcessing';

const { schema, uiSchema } = fasterClaimProcessing;

describe('Faster claim processing pension page', () => {
  const pageTitle = 'Faster claim processing (optional)';
  const expectedNumberOfFields = 2;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );
});
