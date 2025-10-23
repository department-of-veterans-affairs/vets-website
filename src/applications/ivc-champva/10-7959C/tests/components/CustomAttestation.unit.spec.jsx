import { expect } from 'chai';
import { signatureValidator } from '../../components/CustomAttestation';

describe('signatureValidator', () => {
  it('should return an error when applicantName does not match signatureName', () => {
    const formData = {
      applicantName: {
        first: 'firstname',
        last: 'lastname',
      },
    };
    const signatureName = 'DOES NOT MATCH';
    const result = signatureValidator(signatureName, formData);
    // It should be an error string
    expect(typeof result).to.equal('string');
    expect(result.includes('Please enter your full name')).to.be.true;
  });
  it('should return `undefined` when applicantName matches signatureName', () => {
    const formData = {
      applicantName: {
        first: 'firstname',
        middle: 'middlename',
        last: 'lastname',
      },
    };
    const signatureName = 'firstname middlename lastname';
    expect(signatureValidator(signatureName, formData)).to.be.undefined;
  });
  it('should ignore casing differences between applicantName and signatureName', () => {
    const formData = {
      applicantName: {
        first: 'Firstname',
        middle: 'Middlename',
        last: 'LASTNAME',
      },
    };
    const signatureName = 'firstname middlename lastname';
    expect(signatureValidator(signatureName, formData)).to.be.undefined;
  });
  it('should ignore whitespace differences between applicantName and signatureName', () => {
    const formData = {
      applicantName: {
        first: 'first name',
        middle: 'middlename',
        last: 'lastname',
      },
    };
    const signatureName = 'firstname middlename lastname';
    expect(signatureValidator(signatureName, formData)).to.be.undefined;
  });
});
