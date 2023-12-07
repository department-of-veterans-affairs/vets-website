import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from './pageTests.spec';
import formConfig from '../../config/form';
import currentSpouse from '../../pages/currentSpouse';

describe('current spouse full name page', () => {
  it('should render web components in form correctly', () => {
    const pageTitle = 'current spouse full name';
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
