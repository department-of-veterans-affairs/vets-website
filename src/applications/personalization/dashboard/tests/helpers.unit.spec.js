import { expect } from 'chai';

import {
  FORM_DESCRIPTIONS,
  SIP_ENABLED_FORMS,
  MY_VA_SIP_FORMS,
} from '~/platform/forms/constants';

describe('profile helpers:', () => {
  describe('FORM_DESCRIPTIONS', () => {
    it('should have description information for each verified form', () => {
      SIP_ENABLED_FORMS.forEach(form => {
        expect(FORM_DESCRIPTIONS[form]).to.exist;
      });
    });
  });

  describe('MY_VA_SIP_FORMS', () => {
    it('should have description information for each verified form', () => {
      MY_VA_SIP_FORMS.forEach(form => {
        expect(form.description).to.exist;
      });
    });
  });
});
