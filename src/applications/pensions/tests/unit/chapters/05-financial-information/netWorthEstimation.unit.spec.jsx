import { expect } from 'chai';
import {
  testSubmitsWithoutErrors,
  testComponentFieldsMarkedAsRequired,
  testNumberOfWebComponentFields,
  testNumberOfFieldsByType,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import netWorthEstimation, {
  hideIfUnder75000,
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

  describe('hideIfUnder75000', () => {
    it('should return true if under 75000', () => {
      expect(hideIfUnder75000({ netWorthEstimation: 74999 })).to.be.true;
    });
    it('should return false if over 75000', () => {
      expect(hideIfUnder75000({ netWorthEstimation: 76000 })).to.be.false;
    });
    it('should return true if undefined', () => {
      expect(hideIfUnder75000({})).to.be.true;
    });
    it('should return true if null', () => {
      expect(hideIfUnder75000({ netWorthEstimation: null })).to.be.true;
    });
  });
});
