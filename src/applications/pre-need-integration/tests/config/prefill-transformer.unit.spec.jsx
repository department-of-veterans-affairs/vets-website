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
        'view:loginState': {
          isLoggedIn: false,
        },
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
            email: undefined,
            phoneNumber: undefined,
          },
        },
      },
      metadata,
    });
  });

  it('should handle formContext with logged in user', () => {
    const pages = ['page1', 'page2'];
    const formData = {
      application: {
        claimant: {
          name: {
            first: 'Clark',
            last: 'Kent',
          },
          address: '123 Daily Planet St',
          ssn: '987-65-4321',
          dateOfBirth: '1985-05-15',
          email: 'clark@dailyplanet.com',
          phoneNumber: '555-0123',
        },
      },
    };
    const metadata = { some: 'metadata' };
    const formContext = {
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
    };

    const result = prefillTransformer(pages, formData, metadata, formContext);

    expect(result).to.deep.equal({
      pages,
      formData: {
        'view:loginState': {
          isLoggedIn: true,
        },
        application: {
          applicant: {
            name: {
              first: 'Clark',
              last: 'Kent',
            },
            'view:applicantInfo': {
              mailingAddress: '123 Daily Planet St',
            },
          },
          claimant: {
            name: {
              first: 'Clark',
              last: 'Kent',
            },
            address: '123 Daily Planet St',
            ssn: '987-65-4321',
            dateOfBirth: '1985-05-15',
            email: 'clark@dailyplanet.com',
            phoneNumber: '555-0123',
          },
        },
      },
      metadata,
    });
  });
});
