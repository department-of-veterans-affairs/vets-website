import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../config/form';
import dependentChildren from '../../../config/chapters/04-household-information/dependentChildren';

describe('dependent children page', () => {
  it('should render web components in form correctly', () => {
    const pageTitle = 'dependent children';
    const expectedNumberOfFields = 1;
    testNumberOfWebComponentFields(
      formConfig,
      dependentChildren.schema,
      dependentChildren.uiSchema,
      expectedNumberOfFields,
      pageTitle,
    );

    const expectedNumberOfErrors = 1;
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      dependentChildren.schema,
      dependentChildren.uiSchema,
      expectedNumberOfErrors,
      pageTitle,
    );
  });
});
