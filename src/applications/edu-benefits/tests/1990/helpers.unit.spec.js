import { expect } from 'chai';
import { prefillTransformer } from '../../1900/helpers';

describe.only('1990 helpers', () => {
  describe('prefillTransformer', () => {
    it('should set the email', () => {
      const formData = {
        email: 'test@foo.com'
      };
      const pages = {};
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: []
          }
        }
      };

      const result = prefillTransformer(pages, formData, metadata, state);
      expect(result.formData['view:otherContactInfo'].email).to.eql(formData.email);
      expect(result.formData['view:otherContactInfo']['view:confirmEmail'].email).to.eql(formData.email);
  });
});
