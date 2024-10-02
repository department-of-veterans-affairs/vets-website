import { expect } from 'chai';
import formConfig from '../../../config/form';
import transformForSubmit from '../../../config/submitTransformer';
import mockData from '../../e2e/fixtures/data/test-data.json';
import { REQUIRED_FILES } from '../../../config/constants';

describe('transform for submit', () => {
  it('should return passed in relationship if already flat', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          certifierRole: 'other',
          certifierRelationship: 'Spouse',
        },
      }),
    );
    expect(transformed.certification.relationship).to.equal('Spouse');
  });
  it('should flatten relationship details', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          certifierRole: 'other',
          certifierRelationship: {
            relationshipToVeteran: 'other',
            otherRelationshipToVeteran: 'Sibling',
          },
        },
      }),
    );
    expect(transformed.certification.relationship).to.equal('Sibling');
  });
  it('should insert blank values as needed', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, { data: {} }),
    );
    expect(transformed.veteran.ssnOrTin).to.equal('');
  });
  it('should format certifier information', () => {
    const modified = JSON.parse(JSON.stringify(mockData));
    modified.data.certifierRole = 'sponsor';
    const transformed = JSON.parse(transformForSubmit(formConfig, modified));
    expect(transformed.certification.firstName).equals(
      modified.data.veteransFullName.first,
    );
  });
  it('should attach applicant name to each uploaded file', () => {
    const modified = JSON.parse(JSON.stringify(mockData));
    const fileKey = Object.keys(REQUIRED_FILES)[0]; // grab a file we expect to be uploaded
    modified.data.applicants[0][fileKey] = [
      {
        name: 'file.png',
      },
    ];
    const transformed = JSON.parse(transformForSubmit(formConfig, modified));
    expect(transformed.supportingDocs[0].applicantName.first).to.equal(
      transformed.applicants[0].applicantName.first,
    );
  });
  it('should set sponsor info as primary contact if certifierRole == sponsor', () => {
    const sponsorCert = {
      data: {
        certifierRole: 'sponsor',
        sponsorPhone: '1231231234',
        veteransFullName: { first: 'Jack', last: 'Veteran' },
      },
    };
    const transformed = JSON.parse(transformForSubmit(formConfig, sponsorCert));
    expect(transformed.primaryContactInfo.name.first).to.equal(
      sponsorCert.data.veteransFullName.first,
    );
    expect(transformed.primaryContactInfo.name.last).to.equal(
      sponsorCert.data.veteransFullName.last,
    );
    expect(transformed.primaryContactInfo.phone).to.equal(
      sponsorCert.data.sponsorPhone,
    );
  });
  it('should set certifier info as primary contact if certifierRole == other', () => {
    const certifierCert = {
      data: {
        certifierRole: 'other',
        certifierPhone: '1231231234',
        certifierName: { first: 'Jack', last: 'Certifier' },
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
  });
  it('should set first applicant info as primary contact if no applicants have an email address and certifierRole == applicant', () => {
    const appCert = {
      data: {
        certifierRole: 'applicant',
        applicants: [
          {
            applicantAddress: { street: 'fake' },
            applicantName: { first: 'Jack', last: 'Applicant' },
            applicantPhone: '1231231234',
          },
          {
            applicantAddress: { street: 'fake' },
            applicantName: { first: 'John', last: 'Applicant' },
            applicantPhone: '555333222',
          },
        ],
      },
    };
    const transformed = JSON.parse(transformForSubmit(formConfig, appCert));
    expect(transformed.primaryContactInfo.name.first).to.equal(
      appCert.data.applicants[0].applicantName.first,
    );
    expect(transformed.primaryContactInfo.name.last).to.equal(
      appCert.data.applicants[0].applicantName.last,
    );
    expect(transformed.primaryContactInfo.phone).to.equal(
      appCert.data.applicants[0].applicantPhone,
    );
  });
  it('should set primary contact keys to false if data is missing', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, { data: {} }),
    );
    expect(transformed.primaryContactInfo.name.first).to.be.false;
  });
  it('should set primary contact to first applicant with an email if certifierRole == applicant', () => {
    const appCert = {
      data: {
        certifierRole: 'applicant',
        applicants: [
          {
            applicantAddress: { street: 'fake' },
            applicantName: { first: 'First', last: 'Applicant' },
            applicantPhone: '5554443333',
          },
          {
            applicantAddress: { street: 'fake' },
            applicantName: { first: 'Second', last: 'Applicant' },
            applicantPhone: '1112223333',
            applicantEmailAddress: 'second@applicant.com',
          },
          {
            applicantAddress: { street: 'fake' },
            applicantName: { first: 'Third', last: 'Applicant' },
            applicantPhone: '5552223333',
            applicantEmailAddress: 'third@applicant.com',
          },
        ],
      },
    };
    const transformed = JSON.parse(transformForSubmit(formConfig, appCert));
    expect(transformed.primaryContactInfo.name.first).to.equal(
      appCert.data.applicants[1].applicantName.first,
    );
    expect(transformed.primaryContactInfo.name.last).to.equal(
      appCert.data.applicants[1].applicantName.last,
    );
    expect(transformed.primaryContactInfo.phone).to.equal(
      appCert.data.applicants[1].applicantPhone,
    );
    expect(transformed.primaryContactInfo.email).to.equal(
      appCert.data.applicants[1].applicantEmailAddress,
    );
  });
  it('should set `hasApplicantOver65` to false if all applicants are under 65', () => {
    const tmpData = JSON.parse(JSON.stringify(mockData));
    tmpData.data.applicants.forEach(app => {
      // eslint-disable-next-line no-param-reassign
      app.applicantDob = '2003-01-01'; // None over 65
    });

    const transformed = JSON.parse(transformForSubmit(formConfig, tmpData));
    expect(transformed.hasApplicantOver65).to.be.false;
  });
  it('should set `hasApplicantOver65` to true if any applicant is 65 or over', () => {
    const tmpData = JSON.parse(JSON.stringify(mockData));
    tmpData.data.applicants.forEach(app => {
      // eslint-disable-next-line no-param-reassign
      app.applicantDob = '2003-01-01'; // None over 65
    });

    // One is over 65
    tmpData.data.applicants[0].applicantDob = '1947-01-01';

    const transformed = JSON.parse(transformForSubmit(formConfig, tmpData));
    expect(transformed.hasApplicantOver65).to.be.true;
  });
});
