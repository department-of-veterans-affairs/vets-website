import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import VerifyIdentiy from '../../../../components/direct-deposit/alerts/VerifyIdentiy';

describe('authenticated experience -- profile -- direct deposit', () => {
  describe('VerifyIdentiy', () => {
    it('passes axeCheck', () => {
      axeCheck(<VerifyIdentiy />);
    });
  });
});
