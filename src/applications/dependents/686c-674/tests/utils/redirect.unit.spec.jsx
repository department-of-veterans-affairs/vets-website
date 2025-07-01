import { expect } from 'chai';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import { getShouldUseV2 } from '../../utils/redirect';

describe('getShouldUseV2', () => {
  const v1Form = { form: VA_FORM_IDS.FORM_21_686C };
  const v2Form = { form: VA_FORM_IDS.FORM_21_686CV2 };

  it('should return true when V2 flag is on and no forms are present', () => {
    const result = getShouldUseV2(true, []);
    expect(result).to.be.true;
  });

  it('should return false when V2 flag is on and only V1 form is present', () => {
    const result = getShouldUseV2(true, [v1Form]);
    expect(result).to.be.false;
  });

  it('should return true when V2 flag is on and only V2 form is present', () => {
    const result = getShouldUseV2(true, [v2Form]);
    expect(result).to.be.true;
  });

  it('should return true when V2 flag is on and both V1 and V2 forms are present', () => {
    const result = getShouldUseV2(true, [v1Form, v2Form]);
    expect(result).to.be.true;
  });

  it('should return false when V2 flag is off and no forms are present', () => {
    const result = getShouldUseV2(false, []);
    expect(result).to.be.false;
  });

  it('should return false when V2 flag is off and only V1 form is present', () => {
    const result = getShouldUseV2(false, [v1Form]);
    expect(result).to.be.false;
  });

  it('should return false when V2 flag is off and only V2 form is present', () => {
    const result = getShouldUseV2(false, [v2Form]);
    expect(result).to.be.false;
  });

  it('should return false when V2 flag is off and both forms are present', () => {
    const result = getShouldUseV2(false, [v1Form, v2Form]);
    expect(result).to.be.false;
  });
});
