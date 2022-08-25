import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import VerifyIdentity from '../../../../components/direct-deposit/alerts/VerifyIdentity';

describe('authenticated experience -- profile -- direct deposit', () => {
  describe('VerifyIdentity', () => {
    it('passes axeCheck', () => {
      axeCheck(<VerifyIdentity />);
    });
  });
});
