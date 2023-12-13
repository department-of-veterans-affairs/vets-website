import { expect } from 'chai';

import {
  formDescriptions,
  sipEnabledForms,
} from 'applications/personalization/dashboard/helpers';
import { replaceDashesWithSlashes } from '../utils/date-formatting/helpers';

describe('profile helpers:', () => {
  describe('formDescriptions', () => {
    it('should have description information for each verified form', () => {
      sipEnabledForms.forEach(form => {
        expect(formDescriptions[form]).to.exist;
      });
    });
  });
});

describe('replaceDashesWithSlashes function', () => {
  it('should replace the dashes in a string with slashes', () => {
    expect(replaceDashesWithSlashes('2023-10-23')).to.equal('2023/10/23');
  });
});
