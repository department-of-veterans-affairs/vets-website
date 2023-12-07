import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../config/form';
import currentSpouse from '../../../config/chapters/household-information/currentSpouse';

describe('current spouse page', () => {
  it('should render web components in form correctly', () => {
    const pageTitle = 'current spouse';
    const expectedNumberOfFields = 4;
    testNumberOfWebComponentFields(
      formConfig,
      currentSpouse.schema,
      currentSpouse.uiSchema,
      expectedNumberOfFields,
      pageTitle,
    );

    const expectedNumberOfErrors = 2;
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      currentSpouse.schema,
      currentSpouse.uiSchema,
      expectedNumberOfErrors,
      pageTitle,
    );
  });
});
