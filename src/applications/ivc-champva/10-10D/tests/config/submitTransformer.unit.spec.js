import { expect } from 'chai';
import formConfig from '../../config/form';
import transformForSubmit from '../../config/submitTransformer';

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
});
