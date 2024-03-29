import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import DirectDepositBlocked from '../../../../../components/direct-deposit/alerts/DirectDepositBlocked';

describe('authenticated experience -- profile -- direct deposit', () => {
  describe('DirectDepositBlocked', () => {
    it('passes axeCheck', () => {
      axeCheck(<DirectDepositBlocked />);
    });
  });
});
