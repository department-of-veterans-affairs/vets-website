import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import ServiceDown from '../../../../components/direct-deposit/alerts/ServiceDown';

describe('authenticated experience -- profile -- direct deposit', () => {
  describe('ServiceDown', () => {
    it('passes axeCheck', () => {
      axeCheck(<ServiceDown />);
    });
  });
});
