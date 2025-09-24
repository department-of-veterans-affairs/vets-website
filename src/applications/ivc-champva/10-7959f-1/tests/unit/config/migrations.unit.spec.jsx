import { expect } from 'chai';
import { expandPhoneNumberToInternational } from '../../../config/migrations';

const EXAMPLE_SIP_METADATA = {
  version: 0,
  prefill: true,
  returnUrl: '/signer-type',
};

describe('expandPhoneNumberToInternational', () => {
  it('should expand the phone number property into the object expected by internationalPhoneUI', () => {
    const props = {
      formData: { veteranPhoneNumber: '5555555555' },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-7959F-1',
    };
    // Deep copying since migration operates on input data
    const propsDeepCopy = JSON.parse(JSON.stringify(props));
    const migrated = expandPhoneNumberToInternational(propsDeepCopy);
    expect(migrated.formData.veteranPhoneNumber.callingCode).to.eq('');
    expect(migrated.formData.veteranPhoneNumber.countryCode).to.eq('');
    expect(migrated.formData.veteranPhoneNumber.contact).to.eq('5555555555');
  });

  it('should not modify anything if phone number is not a string', () => {
    const props = {
      formData: {
        veteranPhoneNumber: {
          callingCode: '1',
          countryCode: 'US',
          contact: '5555555555',
        },
      },
      metadata: EXAMPLE_SIP_METADATA,
      formId: '10-7959F-1',
    };
    // Deep copying since migration operates on input data
    const propsDeepCopy = JSON.parse(JSON.stringify(props));
    const migrated = expandPhoneNumberToInternational(propsDeepCopy);
    expect(migrated.formData.veteranPhoneNumber.callingCode).to.eq('1');
    expect(migrated.formData.veteranPhoneNumber.countryCode).to.eq('US');
    expect(migrated.formData.veteranPhoneNumber.contact).to.eq('5555555555');
  });
});
