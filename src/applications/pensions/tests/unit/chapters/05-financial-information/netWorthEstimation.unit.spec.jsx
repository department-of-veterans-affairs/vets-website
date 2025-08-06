import { expect } from 'chai';
import {
  testSubmitsWithoutErrors,
  testComponentFieldsMarkedAsRequired,
  testNumberOfWebComponentFields,
  testNumberOfFieldsByType,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import netWorthEstimation, {
  hideIfUnder25000,
} from '../../../../config/chapters/05-financial-information/netWorthEstimation';

const { schema, uiSchema } = netWorthEstimation;

describe('Financial information net worth estimation pension page', () => {
  const pageTitle = 'net worth estimation';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    [`va-text-input[label="Estimate the total value of your assets"]`],
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 1,
    },
    pageTitle,
  );

  describe('hideIfUnder25000', () => {
    it('should return true if under 25000', () => {
      expect(hideIfUnder25000({ netWorthEstimation: 24999 })).to.be.true;
    });
    it('should return false if over 25000', () => {
      expect(hideIfUnder25000({ netWorthEstimation: 26000 })).to.be.false;
    });
    it('should return true if undefined', () => {
      expect(hideIfUnder25000({})).to.be.true;
    });
    it('should return true if null', () => {
      expect(hideIfUnder25000({ netWorthEstimation: null })).to.be.true;
    });
  });
});
