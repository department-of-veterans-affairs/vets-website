import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

describe('prefillTransformer', () => {
  it('should transform formData correctly', () => {
    const pages = ['page1', 'page2'];
    const formData = {
      application: {
        claimant: {
          name: {
            first: 'John',
            last: 'Doe',
          },
          address: '123 Main St',
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
              first: 'John',
              last: 'Doe',
            },
            'view:applicantInfo': {
              mailingAddress: '123 Main St',
            },
          },
          claimant: {
            name: {
              first: 'John',
              last: 'Doe',
            },
            address: '123 Main St',
            ssn: '123-45-6789',
            dateOfBirth: '1990-01-01',
          },
        },
      },
      metadata,
    });
  });
});
