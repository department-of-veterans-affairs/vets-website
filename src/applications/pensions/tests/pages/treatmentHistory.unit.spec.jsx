import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../../../simple-forms/shared/tests/pages/pageTests.spec';
import formConfig from '../../config/form';
import treatmentHistory from '../../pages/treatmentHistory';
import medicalCenters from '../../pages/medicalCenters';

describe('pension treatment history page', () => {
  it('should render web components in form correctly', () => {
    const pageTitle = 'treatment history';
    const expectedNumberOfFields = 1;
    testNumberOfWebComponentFields(
      formConfig,
      treatmentHistory.schema,
      treatmentHistory.uiSchema,
      expectedNumberOfFields,
      pageTitle,
    );

    const expectedNumberOfErrors = 1;
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      treatmentHistory.schema,
      treatmentHistory.uiSchema,
      expectedNumberOfErrors,
      pageTitle,
    );
  });
});

describe('pension add medical centers page', () => {
  it('should render web components in form correctly', () => {
    const pageTitle = 'medical centers';
    const expectedNumberOfFields = 1;
    testNumberOfWebComponentFields(
      formConfig,
      medicalCenters.schema,
      medicalCenters.uiSchema,
      expectedNumberOfFields,
      pageTitle,
    );

    const expectedNumberOfErrors = 1;
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      medicalCenters.schema,
      medicalCenters.uiSchema,
      expectedNumberOfErrors,
      pageTitle,
    );
  });
});
