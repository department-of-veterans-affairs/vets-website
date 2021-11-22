import { expect } from 'chai';

import {
  formDescriptions,
  sipEnabledForms,
} from 'applications/personalization/dashboard/helpers';

describe('profile helpers:', () => {
  describe('formDescriptions', () => {
    it('should have description information for each verified form', () => {
      sipEnabledForms.forEach(form => {
        expect(formDescriptions[form]).to.exist;
      });
    });
  });
});
