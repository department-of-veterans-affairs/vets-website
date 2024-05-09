import { expect } from 'chai';
import formConfig from '../../config/form';
import mockData from '../fixtures/data/test-data.json';

import transformForSubmit from '../../config/submitTransformer';
import { prefillTransformer } from '../../config/prefillTransformer';

describe('Prefill transformer', () => {
  it('should return pages, formData, and metadata', () => {
    const result = prefillTransformer({}, {}, {});
    expect(
      ['pages', 'formData', 'metadata'].every(k =>
        Object.keys(result).includes(k),
      ),
    ).to.be.true;
  });
});

describe('Submit transformer', () => {
  it('should add the form number to the data', () => {
    const result = JSON.parse(transformForSubmit(formConfig, mockData));
    expect(result.form_number).to.equal(formConfig.formId);
  });
  it('should set `hasOtherHealthInsurance` to true if applicant has either primary or secondary', () => {
    expect(
      JSON.parse(
        transformForSubmit(formConfig, {
          data: {
            ...mockData.data,
            applicantHasPrimary: true,
            applicantHasSecondary: false,
          },
        }),
      ).hasOtherHealthInsurance,
    ).to.be.true;
    expect(
      JSON.parse(
        transformForSubmit(formConfig, {
          data: {
            ...mockData.data,
            applicantHasPrimary: false,
            applicantHasSecondary: true,
          },
        }),
      ).hasOtherHealthInsurance,
    ).to.be.true;
  });
  it('should set certifier info as primary contact if certifierRole == other', () => {
    const certifierCert = {
      data: {
        applicantName: { middle: 'unused' }, // prevents unrelated error
        certifierRole: 'other',
        certifierPhone: '1231231234',
        certifierName: { first: 'Jack', last: 'Certifier' },
        certifierEmail: 'certifier@email.gov',
      },
    };
    const transformed = JSON.parse(
      transformForSubmit(formConfig, certifierCert),
    );
    expect(transformed.primaryContactInfo.name.first).to.equal(
      certifierCert.data.certifierName.first,
    );
    expect(transformed.primaryContactInfo.name.last).to.equal(
      certifierCert.data.certifierName.last,
    );
    expect(transformed.primaryContactInfo.phone).to.equal(
      certifierCert.data.certifierPhone,
    );
    expect(transformed.primaryContactInfo.email).to.equal(
      certifierCert.data.certifierEmail,
    );
  });
  it('should set applicant info as primary contact if certifierRole == applicant', () => {
    const certifierCert = {
      data: {
        certifierRole: 'applicant',
        applicantName: { first: 'Jack', middle: 'Middle', last: 'Applicant' },
        applicantPhone: '1231231234',
        applicantEmailAddress: 'applicant@email.gov',
      },
    };
    const transformed = JSON.parse(
      transformForSubmit(formConfig, certifierCert),
    );
    expect(transformed.primaryContactInfo.name.first).to.equal(
      certifierCert.data.applicantName.first,
    );
    expect(transformed.primaryContactInfo.name.last).to.equal(
      certifierCert.data.applicantName.last,
    );
    expect(transformed.primaryContactInfo.phone).to.equal(
      certifierCert.data.applicantPhone,
    );
    expect(transformed.primaryContactInfo.email).to.equal(
      certifierCert.data.applicantEmailAddress,
    );
  });
  it('should set missing primary contact values to false', () => {
    const certifierCert = {
      data: {
        certifierRole: 'other',
        applicantName: { middle: 'unused' }, // prevents unrelated error
      },
    };
    const transformed = JSON.parse(
      transformForSubmit(formConfig, certifierCert),
    );
    expect(transformed.primaryContactInfo.name).to.equal(false);
    expect(transformed.primaryContactInfo.phone).to.equal(false);
    expect(transformed.primaryContactInfo.email).to.equal(false);
  });
});
