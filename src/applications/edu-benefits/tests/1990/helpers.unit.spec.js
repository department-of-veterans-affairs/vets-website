import { expect } from 'chai';
import { prefillTransformer } from '../../1990/helpers.jsx';

describe('1990 helpers', () => {
  describe('prefillTransformer', () => {
    it('should do nothing if no contact info is updated', () => {
      const formData = {};
      const pages = {};
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };
      const result = prefillTransformer(pages, formData, metadata, state);
      expect(result.formData).to.eql(formData);
    });
    it('should set the email', () => {
      const formData = {
        email: 'test@foo.com',
      };
      const pages = {};
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);
      expect(result.formData['view:otherContactInfo'].email).to.eql(
        formData.email,
      );
    });
    it('should set the homePhone', () => {
      const formData = {
        homePhone: '999',
      };
      const pages = {};
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);
      expect(result.formData['view:otherContactInfo'].homePhone).to.eql(
        formData.homePhone,
      );
    });
    it('should set the mobilePhone', () => {
      const formData = {
        mobilePhone: '999',
      };
      const pages = {};
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);
      expect(result.formData['view:otherContactInfo'].mobilePhone).to.eql(
        formData.mobilePhone,
      );
    });
  });
});
