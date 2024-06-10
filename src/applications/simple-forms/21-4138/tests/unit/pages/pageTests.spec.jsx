import {
  testNumberOfErrorsOnSubmit,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFields,
  testNumberOfWebComponentFields,
} from '../../../../shared/tests/pages/pageTests.spec';
import formConfig from '../../../config/form';

export const testPage = ({
  data,
  numberOfErrors,
  numberOfFields,
  numberOfWebComponentErrors,
  numberOfWebComponentFields,
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
