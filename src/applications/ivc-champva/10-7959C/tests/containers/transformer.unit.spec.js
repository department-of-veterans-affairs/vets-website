import { expect } from 'chai';
import formConfig from '../../config/form';
import transformForSubmit from '../../config/submitTransformer';

describe('transform for submit', () => {
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
});
