import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import {
  srSubstitute,
  maskBankInformation,
  hasNewBankInformation,
  hasPrefillBankInformation,
} from '../utils';

describe('0994 utils', () => {
  describe('srSubstitute', () => {
    it('do the srSubstitute', () => {
      const srIgnored = <span>Test</span>;
      const substitutionText = 'substitutionText';
      const srSub = shallow(srSubstitute(srIgnored, substitutionText));

      expect(srSub.text()).to.contain('Test');
      srSub.unmount();
    });
  });
  describe('maskBankInformation', () => {
    it('should mask all but last 4 characters', () => {
      const maskedBankInfo = shallow(maskBankInformation('000000000', 4));

      expect(maskedBankInfo.text()).to.contain('●●●●●ending with0000');

      maskedBankInfo.unmount();
    });
  });
  describe('maskBankInformation string is blank', () => {
    it('should mask all but last 4 characters', () => {
      const maskedBankInfo = shallow(maskBankInformation(undefined, 4));

      expect(maskedBankInfo.text()).to.contain('is blank');

      maskedBankInfo.unmount();
    });
  });
  describe('hasNewBankInformation', () => {
    it('should confirm valid input', () => {
      const data = {
        prefillBankAccount: {
          accountType: 'Checking',
          accountNumber: '*********1234',
          routingNumber: '*****2115',
        },
      };
      const result = hasNewBankInformation(data.prefillBankAccount);
      expect(result).to.be.true;
    });
    it('should confirm invalid input', () => {
      const result = hasNewBankInformation();
      expect(result).to.be.false;
    });
  });
});

describe('hasPrefillBankInformation', () => {
  it('should confirm invalid input', () => {
    const result = hasPrefillBankInformation();
    expect(result).to.be.false;
  });
});
