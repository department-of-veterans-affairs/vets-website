import { expect } from 'chai';
import transform from '../../config/transform';

describe('transform function', () => {
  it('should transform form data correctly', () => {
    const formConfig = {};
    const form = {
      data: {
        applicantName: {
          first: 'John',
          last: 'Smith',
        },
        testCost: '56',
        organizationName: 'Acme Co.',
        organizationAddress: {
          country: 'USA',
          street: '123 Fake St',
          city: 'Tulsa',
          state: 'OK',
          postalCode: '23456',
        },
        testName: 'Fake test',
        testDate: '2022-11-13',
        homePhone: {
          callingCode: '1',
          countryCode: '',
          contact: '5555551234',
        },
        emailAddress: 'example@example.com',
        mailingAddress: {
          country: 'USA',
          street: '123 Maple Ln',
          city: 'Hamilton',
          state: 'IA',
          postalCode: '12345',
        },
        payeeNumber: 'AB',
        ssn: '123456789',
        vaBenefitProgram: 'chapter35',
        hasPreviouslyApplied: true,
        statementOfTruthSignature: 'Jackie Doe',
        dateSigned: '2025-01-01',
        statementOfTruthCertified: true,
      },
    };

    const result = transform(formConfig, form);
    const parsedData = JSON.parse(
      JSON.parse(result).educationBenefitsClaim.form,
    );
    expect(parsedData).to.deep.equal({
      applicantName: {
        first: 'John',
        last: 'Smith',
      },
      testCost: 56,
      organizationName: 'Acme Co.',
      organizationAddress: {
        country: 'USA',
        street: '123 Fake St',
        city: 'Tulsa',
        state: 'OK',
        postalCode: '23456',
      },
      testName: 'Fake test',
      testDate: '2022-11-13',
      homePhone: '+1 5555551234',
      emailAddress: 'example@example.com',
      mailingAddress: {
        country: 'USA',
        street: '123 Maple Ln',
        city: 'Hamilton',
        state: 'IA',
        postalCode: '12345',
      },
      payeeNumber: 'AB',
      ssn: '123456789',
      vaBenefitProgram: 'chapter35',
      hasPreviouslyApplied: true,
      statementOfTruthSignature: 'Jackie Doe',
      dateSigned: '2025-01-01',
    });
  });
});
