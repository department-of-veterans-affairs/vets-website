import { expect } from 'chai';
import {
  testComponentFieldsMarkedAsRequired,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
  testSubmitsWithoutErrors,
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
  testComponentFieldsMarkedAsRequired(
    formConfig,
    reasonForCurrentSeparation.schema,
    reasonForCurrentSeparation.uiSchema,
    [`va-radio[label="What’s the reason you’re separated from your spouse?"]`],
    pageTitle,
    formData,
  );

  testSubmitsWithoutErrors(
    formConfig,
    reasonForCurrentSeparation.schema,
    reasonForCurrentSeparation.uiSchema,
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    reasonForCurrentSeparation.schema,
    reasonForCurrentSeparation.uiSchema,
    {
      'va-radio': 1,
    },
    pageTitle,
  );

  describe('otherExplanationRequired', () => {
    it('returns true if the reason for separation is Other', () => {
      expect(otherExplanationRequired({ reasonForCurrentSeparation: 'OTHER' }))
        .to.be.true;
    });
  });
});
