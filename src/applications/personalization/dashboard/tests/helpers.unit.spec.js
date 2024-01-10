import { expect } from 'chai';

import {
  FORM_DESCRIPTIONS,
  SIP_ENABLED_FORMS,
} from '~/platform/forms/constants';

import { replaceDashesWithSlashes } from '../utils/date-formatting/helpers';

describe('profile helpers:', () => {
  describe('FORM_DESCRIPTIONS', () => {
    it('should have description information for each verified form', () => {
      SIP_ENABLED_FORMS.forEach(form => {
        expect(FORM_DESCRIPTIONS[form]).to.exist;
      });
    });
  });
});

describe('replaceDashesWithSlashes function', () => {
  it('should replace the dashes in a string with slashes', () => {
    expect(replaceDashesWithSlashes('2023-10-23')).to.equal('2023/10/23');
  });
});
