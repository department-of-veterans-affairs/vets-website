import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from './pageTests.spec';
import formConfig from '../../config/form';
import currentSpouse from '../../pages/currentSpouse';
import currentSpouseMonthlySupport from '../../pages/currentSpouseMonthlySupport';

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

describe('current spouse monthly support page', () => {
  it('should render web components in form correctly', () => {
    const pageTitle = 'current spouse monthly support';
    const expectedNumberOfFields = 1;
    testNumberOfWebComponentFields(
      formConfig,
      currentSpouseMonthlySupport.schema,
      currentSpouseMonthlySupport.uiSchema,
      expectedNumberOfFields,
      pageTitle,
    );

    const expectedNumberOfErrors = 1;
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      currentSpouseMonthlySupport.schema,
      currentSpouseMonthlySupport.uiSchema,
      expectedNumberOfErrors,
      pageTitle,
    );
  });
});
