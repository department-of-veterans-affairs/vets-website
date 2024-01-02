import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
<<<<<<<< HEAD:src/applications/pensions/tests/unit/chapters/04-household-information/currentSpouseAddress.unit.spec.jsx
import formConfig from '../../../config/form';
import currentSpouseAddress from '../../../config/chapters/04-household-information/currentSpouseAddress';
========
import formConfig from '../../../../config/form';
import currentSpouse from '../../../../config/chapters/04-household-information/currentSpouse';
>>>>>>>> aeeeb23e29 (moved around unit and cypress tests):src/applications/pensions/tests/unit/chapters/04-household-information/currentSpouse.unit.spec.jsx

describe('current spouse address page', () => {
  it('should render web components in form correctly', () => {
    const pageTitle = 'current spouse address';
    const expectedNumberOfFields = 6;
    testNumberOfWebComponentFields(
      formConfig,
      currentSpouseAddress.schema,
      currentSpouseAddress.uiSchema,
      expectedNumberOfFields,
      pageTitle,
    );

    const expectedNumberOfErrors = 4;
    testNumberOfErrorsOnSubmitForWebComponents(
      formConfig,
      currentSpouseAddress.schema,
      currentSpouseAddress.uiSchema,
      expectedNumberOfErrors,
      pageTitle,
    );
  });
});
