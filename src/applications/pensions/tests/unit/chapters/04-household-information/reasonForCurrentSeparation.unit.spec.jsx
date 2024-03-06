import { expect } from 'chai';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import reasonForCurrentSeparation, {
  otherExplanationRequired,
} from '../../../../config/chapters/04-household-information/reasonForCurrentSeparation';

describe('reason for current separation page', () => {
  const pageTitle = 'reason for separation';
  const formData = { reasonForCurrentSeparation: 'OTHER' };
  const expectedNumberOfFields = 2;
  testNumberOfWebComponentFields(
    formConfig,
    reasonForCurrentSeparation.schema,
    reasonForCurrentSeparation.uiSchema,
    expectedNumberOfFields,
    pageTitle,
    formData,
  );

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    reasonForCurrentSeparation.schema,
    reasonForCurrentSeparation.uiSchema,
    expectedNumberOfErrors,
    pageTitle,
    formData,
  );

  describe('otherExplanationRequired', () => {
    it('returns true if the reason for separation is Other', () => {
      expect(otherExplanationRequired({ reasonForCurrentSeparation: 'OTHER' }))
        .to.be.true;
    });
  });
});
