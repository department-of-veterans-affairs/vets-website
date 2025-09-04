import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import formConfig from '../../../config/form';

export const testPage = ({
  data = {},
  numberOfErrors = 0,
  numberOfFields = 0,
  numberOfWebComponentErrors = 0,
  numberOfWebComponentFields = 0,
  pageTitle,
  schema,
  uiSchema,
}) => {
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    numberOfWebComponentFields,
    pageTitle,
    data,
  );

  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    numberOfWebComponentErrors,
    pageTitle,
    data,
  );

  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    numberOfFields,
    pageTitle,
    data,
  );

  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    numberOfErrors,
    pageTitle,
    data,
  );
};
