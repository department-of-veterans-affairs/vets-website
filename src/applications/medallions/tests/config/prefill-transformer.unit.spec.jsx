import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

describe('prefillTransformer in Pre-need Integration', () => {
  it('should transform formData correctly', () => {
    const pages = ['page1', 'page2'];
    const formData = {
      applicantMailingAddress: {
        street: '123 BatCave St',
        street2: 'test',
        city: 'Gotham',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
      },
    };
    const metadata = { some: 'metadata' };

    const result = prefillTransformer(pages, formData, metadata);

    expect(result).to.deep.equal({
      pages,
      formData: {
        'view:loginState': {
          isLoggedIn: false,
        },
        applicantMailingAddress: {
          street: '123 BatCave St',
          street2: 'test',
          city: 'Gotham',
          state: 'NY',
          postalCode: '10001',
          country: 'USA',
        },
        email: '',
        phoneNumber: '',
      },
      metadata,
    });
  });
});
