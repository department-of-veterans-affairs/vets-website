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
          applicants: [{ applicantRelationshipToSponsor: 'Spouse' }],
        },
      }),
    );
    expect(transformed.applicants[0].vetRelationship).to.equal('Spouse');
  });
  it('should flatten relationship details', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          applicants: [
            {
              applicantRelationshipToSponsor: {
                relationshipToVeteran: 'other',
                otherRelationshipToVeteran: 'Sibling',
              },
            },
          ],
        },
      }),
    );
    expect(transformed.applicants[0].vetRelationship).to.equal('Sibling');
  });
  it('should produce a semicolon separated list of relationships for third party certifiers', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          certifierRole: 'other',
          certifierRelationship: {
            relationshipToVeteran: {
              spouse: true,
              parent: true,
              thirdParty: false,
            },
          },
        },
      }),
    );
    expect(transformed.certification.relationship).to.equal('spouse; parent');
  });
  it('should insert blank values as needed', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, { data: {} }),
    );
    expect(transformed.veteran.ssnOrTin).to.equal('');
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
  it('should set certifier info as primary contact if certifierRole == other', () => {
    const certifierCert = {
      data: {
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
