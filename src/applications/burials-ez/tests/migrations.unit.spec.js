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
});
