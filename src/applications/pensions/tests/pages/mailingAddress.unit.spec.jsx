import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../../../simple-forms/shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';
import mailingAddress from '../../pages/mailingAddress';

const { schema, uiSchema } = mailingAddress;

describe('pension mailing address page', () => {
  const pageTitle = 'mailing address';
  const expectedNumberOfFields = 6;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 4;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});
