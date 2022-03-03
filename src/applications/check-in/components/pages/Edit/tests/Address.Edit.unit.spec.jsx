import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import Address from '../Address';

describe('pre-check-in experience', () => {
  describe('Edit pages', () => {
    describe('Address', () => {
      it('passes axeCheck', () => {
        axeCheck(<Address />);
      });
    });
  });
});
