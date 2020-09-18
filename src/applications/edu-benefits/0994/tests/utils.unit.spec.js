import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { srSubstitute, maskBankInformation } from '../../0994/utils';

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
});
