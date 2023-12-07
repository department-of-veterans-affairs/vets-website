import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../config/form';
import maritalStatus from '../../../config/chapters/household-information/maritalStatus';

describe('marital status page', () => {
  it('should render web components in form correctly', () => {
    const pageTitle = 'marital status';
    const expectedNumberOfFields = 1;
    testNumberOfWebComponentFields(
      formConfig,
      maritalStatus.schema,
      maritalStatus.uiSchema,
      expectedNumberOfFields,
      pageTitle,
    );

    const expectedNumberOfErrors = 1;
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      maritalStatus.schema,
      maritalStatus.uiSchema,
      expectedNumberOfErrors,
      pageTitle,
    );
  });
});
