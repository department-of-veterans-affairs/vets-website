import { expect } from 'chai';

import {
  FORM_DESCRIPTIONS,
  SIP_ENABLED_FORMS,
} from '~/platform/forms/constants';
import { shouldMockApiRequest } from './helpers';

describe('profile helpers:', () => {
  describe('FORM_DESCRIPTIONS', () => {
    it('should have description information for each verified form', () => {
      SIP_ENABLED_FORMS.forEach(form => {
        expect(FORM_DESCRIPTIONS[form]).to.exist;
      });
    });
  });
});

describe('shouldMockApiRequest function', () => {
  it('should return false when environment is in localhost and not in Cypress', () => {
    const environment = {
      isLocalhost: () => true,
    };
    const window = {
      Cypress: false,
      VetsGov: {
        pollTimeout: false,
      },
    };

    const result =
      environment.isLocalhost() && window.Cypress && window.VetsGov.pollTimeout;

    expect(result).equal(false);
    expect(result).equal(shouldMockApiRequest());
  });
});
