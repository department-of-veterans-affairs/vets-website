import { expect } from 'chai';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import totalNetWorth from '../../../../config/chapters/05-financial-information/totalNetWorth';
import { hideIfUnder25000 } from '../../../../config/chapters/05-financial-information/netWorthEstimation';

const { schema, uiSchema } = totalNetWorth;

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

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
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
  });
});
