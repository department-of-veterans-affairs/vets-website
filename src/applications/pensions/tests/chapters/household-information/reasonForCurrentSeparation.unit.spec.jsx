import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../config/form';
import reasonForCurrentSeparation from '../../../config/chapters/household-information/reasonForCurrentSeparation';

describe('reason for current separation page', () => {
  it('should render web components in form correctly', () => {
    const pageTitle = 'reason for separation';
    const expectedNumberOfFields = 1;
    testNumberOfWebComponentFields(
      formConfig,
      reasonForCurrentSeparation.schema,
      reasonForCurrentSeparation.uiSchema,
      expectedNumberOfFields,
      pageTitle,
    );

    const expectedNumberOfErrors = 1;
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      reasonForCurrentSeparation.schema,
      reasonForCurrentSeparation.uiSchema,
      expectedNumberOfErrors,
      pageTitle,
    );
  });
});
