import { expect } from 'chai';
import { shallow } from 'enzyme';

import { maskBankInformation } from '../../0994/utils';

describe('0994 utils', () => {
  describe('maskBankInformation', () => {
    it('should mask all but last 4 characters', () => {
      const maskedBankInfo = shallow(maskBankInformation('000000000', 4));

      expect(maskedBankInfo.text()).to.contain('●●●●●ending with0000');

      maskedBankInfo.unmount();
    });
  });
});
