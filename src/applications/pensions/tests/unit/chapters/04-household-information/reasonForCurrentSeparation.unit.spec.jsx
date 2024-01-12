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

  describe('otherExplanationRequired', () => {
    it('returns true if the reason for separation is Other', () => {
      expect(otherExplanationRequired({ reasonForCurrentSeparation: 'OTHER' }))
        .to.be.true;
    });
  });
});
