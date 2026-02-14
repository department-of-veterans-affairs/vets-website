import { expect } from 'chai';
import transform from '../../config/transform';
import { todaysDate } from '../../helpers';

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
          street: '123 Fake St',
          city: 'Tulsa',
          state: 'OK',
          postalCode: '23456',
        },
        testName: 'Fake test',
        testDate: '2022-11-13',
        payeeNumber: 'AB',
        ssn: '123456789',
        vaBenefitProgram: 'chapter35',
        hasPreviouslyApplied: true,
        statementOfTruthSignature: 'Jackie Doe',
        dateSigned: '2025-01-01',
        statementOfTruthCertified: true,
        veteran: {
          mailingAddress: {
            addressLine1: '123 Mailing Address St.',
            addressLine2: 'Apt 1',
            addressLine3: '',
            addressType: 'DOMESTIC',
            city: 'Fulton',
            countryName: 'United States',
            countryCodeIso2: 'US',
            countryCodeIso3: 'USA',
            stateCode: 'NY',
            zipCode: '97063',
          },
          homePhone: {
            areaCode: '989',
            countryCode: '22',
            isInternational: true,
            phoneNumber: '8981233',
          },
          email: {
            emailAddress: 'example@example.com',
          },
        },
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
      homePhone: '+22 9898981233',
      emailAddress: 'example@example.com',
      mailingAddress: {
        isMilitary: false,
        country: 'USA',
        street: '123 Mailing Address St.',
        street2: 'Apt 1',
        street3: '',
        city: 'Fulton',
        state: 'NY',
        postalCode: '97063',
      },
      payeeNumber: 'AB',
      ssn: '123456789',
      vaBenefitProgram: 'chapter35',
      hasPreviouslyApplied: true,
      statementOfTruthSignature: 'Jackie Doe',
      dateSigned: todaysDate(),
    });
  });
});
