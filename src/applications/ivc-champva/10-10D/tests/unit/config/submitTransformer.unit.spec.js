import { expect } from 'chai';
import formConfig from '../../../config/form';
import transformForSubmit from '../../../config/submitTransformer';
import mockData from '../../e2e/fixtures/data/test-data.json';

describe('transform for submit', () => {
  it('should adjust zip code keyname', () => {
    const transformed = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          sponsorAddress: { postalCode: '12345' },
        },
      }),
    );
    expect(transformed.veteran.address.postal_code).to.not.equal(undefined);
  });
  it('should adjust zip code keyname for applicants', () => {
    const zip = '12345';
    const transformed = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          applicants: [
            {
              applicantAddress: {
                postalCode: zip,
              },
            },
          ],
        },
      }),
    );
    expect(transformed.applicants[0].address.postal_code).to.equal(zip);
  });
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
    expect(transformed.veteran.ssn_or_tin).to.equal('');
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
    modified.data.applicants[0].applicantMedicareCardFront = [
      {
        name: 'file.png',
      },
    ];
    const transformed = JSON.parse(transformForSubmit(formConfig, modified));
    expect(transformed.supporting_docs[0].applicantName.first).to.equal(
      transformed.applicants[0].full_name.first,
    );
  });
});
