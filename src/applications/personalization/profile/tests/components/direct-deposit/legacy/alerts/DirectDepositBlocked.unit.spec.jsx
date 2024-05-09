import React from 'react';
import { expect } from 'chai';
import { renderComponentForA11y } from 'platform/user/tests/helpers';
import DirectDepositBlocked from '../../../../../components/direct-deposit/alerts/DirectDepositBlocked';

describe('authenticated experience -- profile -- direct deposit', () => {
  describe('DirectDepositBlocked', () => {
    it('passes axeCheck', async () => {
      const component = renderComponentForA11y(<DirectDepositBlocked />);
      await expect(component).to.be.accessible();
    });
  });
});
