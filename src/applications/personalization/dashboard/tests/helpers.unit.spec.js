import { expect } from 'chai';

import { MY_VA_SIP_FORMS } from '~/platform/forms/constants';

describe('profile helpers:', () => {
  describe('MY_VA_SIP_FORMS', () => {
    it('should have description information for each verified form', () => {
      MY_VA_SIP_FORMS.forEach(form => {
        expect(form.description).to.exist;
      });
    });
  });
});
