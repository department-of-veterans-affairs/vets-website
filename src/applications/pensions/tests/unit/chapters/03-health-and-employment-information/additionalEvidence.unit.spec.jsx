import { expect } from 'chai';
import {
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import additionalEvidence, {
  requiresAdditionalEvidence,
} from '../../../../config/chapters/03-health-and-employment-information/additionalEvidence';

const { schema, uiSchema } = additionalEvidence;

describe('pension medical evidence', () => {
  const pageTitle = 'Additional Evidence';
  const expectedNumberOfFields = 0;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);

  it('depends on medical evidence being required', () => {
    expect(
      requiresAdditionalEvidence({
        socialSecurityDisability: false,
        medicalCondition: false,
      }),
    ).to.be.false;
    expect(requiresAdditionalEvidence({ socialSecurityDisability: true })).to.be
      .true;
    expect(requiresAdditionalEvidence({ medicalCondition: true })).to.be.true;
  });
});
