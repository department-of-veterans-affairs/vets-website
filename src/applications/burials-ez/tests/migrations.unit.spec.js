import { expect } from 'chai';

import migrations from '../migrations';

describe('Burials migrations', () => {
  it('should set url to claimant address if invalid country code', () => {
    const { formData, metadata } = migrations[0]({
      formData: {
        claimantAddress: {
          country: 'US',
        },
      },
      metadata: {
        returnUrl: 'asdf',
      },
    });

    expect(metadata.returnUrl).to.equal(
      '/claimant-information/mailing-address',
    );
    expect(formData).to.be.an('object');
  });

  it('should set url to contact information if claimantEmail is missing', () => {
    const { formData, metadata } = migrations[1]({
      formData: {
        claimantFullName: {
          first: 'John',
          middle: 'A',
          last: 'Doe',
        },
        claimantAddress: {
          street: '123 Main St',
          city: 'Springfield',
          country: 'USA',
          postalCode: '12345',
        },
      },
      metadata: {
        returnUrl: '/original-url',
      },
    });

    expect(metadata.returnUrl).to.equal(
      '/claimant-information/contact-information',
    );
    expect(formData).to.be.an('object');
  });

  it('should not change url if claimantEmail is present', () => {
    const { formData, metadata } = migrations[1]({
      formData: {
        claimantEmail: 'user@example.com',
        claimantFullName: {
          first: 'John',
          middle: 'A',
          last: 'Doe',
        },
        claimantAddress: {
          street: '123 Main St',
          city: 'Springfield',
          country: 'USA',
          postalCode: '12345',
        },
      },
      metadata: {
        returnUrl: '/original-url',
      },
    });

    expect(metadata.returnUrl).to.equal('/original-url');
    expect(formData).to.be.an('object');
  });
});
