import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

describe('prefillTransformer in Pre-need Integration', () => {
  it('should transform formData correctly', () => {
    const pages = ['page1', 'page2'];
    const formData = {
      application: {
        claimant: {
          name: {
            first: 'Bruce',
            last: 'Wayne',
          },
          address: '123 BatCave St',
          ssn: '123-45-6789',
          dateOfBirth: '1990-01-01',
        },
      },
    };
    const metadata = { some: 'metadata' };

    const result = prefillTransformer(pages, formData, metadata);

    expect(result).to.deep.equal({
      pages,
      formData: {
        application: {
          applicant: {
            name: {
              first: 'Bruce',
              last: 'Wayne',
            },
            'view:applicantInfo': {
              mailingAddress: '123 BatCave St',
            },
          },
          claimant: {
            name: {
              first: 'Bruce',
              last: 'Wayne',
            },
            address: '123 BatCave St',
            ssn: '123-45-6789',
            dateOfBirth: '1990-01-01',
          },
        },
      },
      metadata,
    });
  });
});
