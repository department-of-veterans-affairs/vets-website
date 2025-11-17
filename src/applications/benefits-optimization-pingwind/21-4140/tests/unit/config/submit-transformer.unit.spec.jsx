import { expect } from 'chai';

import formConfig from '../../../config/form';
import transformForSubmit from '../../../config/submit-transformer';

const submissionOptions = {
  submissionTimestamp: '2025-10-15T12:00:00Z',
};

const baseVeteran = {
  fullName: {
    first: 'John',
    middle: 'A',
    last: 'Doe',
  },
  ssn: '123-45-6789',
  vaFileNumber: 'C12345678',
  dateOfBirth: '1975-03-15',
  veteranServiceNumber: '1234567',
  address: {
    street: '123 Main Street',
    street2: '5B',
    city: 'Springfield',
    state: 'IL',
    postalCode: '23456',
    country: 'USA',
  },
  email: 'john.doe@example.com',
  homePhone: '217-555-1234',
  alternatePhone: '217-555-5678',
};

const parseTransformed = transformed => {
  const outer = JSON.parse(transformed);
  const formString = outer?.employment_questionnaires_claim?.form;
  return formString ? JSON.parse(formString) : {};
};

describe('21-4140 submit-transformer', () => {
  it('maps employed form data into submission payload', () => {
    const form = {
      data: {
        veteran: baseVeteran,
        employmentCheck: {
          hasEmploymentInLast12Months: 'yes',
        },
        employers: [
          {
            employerName: 'ACME Corp',
            employerAddress: {
              street: '456 Industrial Ave',
              city: 'Springfield',
              state: 'IL',
              postalCode: '62704',
            },
            datesOfEmployment: {
              from: '2020-04-04',
              to: '2020-06-20',
            },
            typeOfWork: 'Construction Worker',
            highestIncome: 3500,
            hoursPerWeek: 40,
            lostTime: 14,
          },
        ],
        employedByVA: {
          hasCertifiedSection2: true,
          hasUnderstoodSection2: true,
        },
        files: [{ confirmationCode: 'abc-123' }],
      },
    };

    const payload = parseTransformed(
      transformForSubmit(formConfig, form, submissionOptions),
    );

    expect(payload.veteranFullName).to.deep.equal(baseVeteran.fullName);
    expect(payload.veteranSocialSecurityNumber).to.equal('123456789');
    expect(payload.veteranAddress).to.deep.equal({
      street: '123 Main Street',
      apartment: '5B',
      city: 'Springfield',
      state: 'IL',
      postalCode: '23456',
      country: 'USA',
    });
    expect(payload.veteranContact).to.deep.equal({
      email: 'john.doe@example.com',
      primaryPhone: '2175551234',
      alternatePhone: '2175555678',
    });
    expect(payload.employmentStatus).to.deep.equal({
      radio: '0',
      mailedDate: '2025-10-15',
    });
    expect(payload.signatureSection1).to.deep.equal({
      signatureDate: '2025-10-15',
      veteranSocialSecurityNumber: '123456789',
    });
    expect(payload.signatureSection2).to.deep.equal({
      hasCertifiedSection2: true,
      hasUnderstoodSection2: true,
      signatureDate: '2025-10-15',
    });
    expect(payload.signatureSection3).to.be.undefined;
    expect(payload.employmentHistory).to.deep.equal([
      {
        nameAndAddress: 'ACME Corp, 456 Industrial Ave, Springfield, IL, 62704',
        typeOfWork: 'Construction Worker',
        timeLost: '14',
        hoursPerWeek: '40',
        dateRange: {
          from: '2020-04-04',
          to: '2020-06-20',
        },
        grossEarningsPerMonth: '3500',
      },
    ]);
    expect(payload.files).to.deep.equal([{ confirmationCode: 'abc-123' }]);
    expect(payload.formNumber).to.equal('21-4140');
    expect(payload.veteranServiceNumber).to.equal('1234567');
    expect(payload.veteranServiceNumer).to.equal('1234567');
  });

  it('maps unemployed flow to unemployment signature section', () => {
    const form = {
      data: {
        veteran: baseVeteran,
        employmentCheck: {
          hasEmploymentInLast12Months: 'no',
        },
        employedByVA: {
          hasCertifiedSection3: true,
          hasUnderstoodSection3: true,
        },
      },
    };

    const payload = parseTransformed(
      transformForSubmit(formConfig, form, submissionOptions),
    );

    expect(payload.employmentStatus).to.deep.equal({
      radio: '1',
      mailedDate: '2025-10-15',
    });
    expect(payload.employmentHistory).to.be.undefined;
    expect(payload.signatureSection2).to.be.undefined;
    expect(payload.signatureSection3).to.deep.equal({
      hasCertifiedSection3: true,
      hasUnderstoodSection3: true,
      signatureDate: '2025-10-15',
    });
  });
});
