import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../config/form';
import dependentChildInformation from '../../../config/chapters/04-household-information/dependentChildInformation';

const { schema, uiSchema } = dependentChildInformation;

describe('pension dependent child info page', () => {
  it('should render web components in form correctly', () => {
    const pageTitle = 'dependent child information';
    const expectedNumberOfFields = 4;
    testNumberOfWebComponentFields(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfFields,
      pageTitle,
    );

    const expectedNumberOfErrors = 4;
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      schema,
      uiSchema,
      expectedNumberOfErrors,
      pageTitle,
    );
  });
});
