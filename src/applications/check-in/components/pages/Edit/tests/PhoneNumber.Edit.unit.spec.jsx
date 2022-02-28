import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import PhoneNumber from '../PhoneNumber';

describe('pre-check-in experience', () => {
  describe('Edit pages', () => {
    describe('PhoneNumber', () => {
      it('passes axeCheck', () => {
        axeCheck(<PhoneNumber />);
      });
    });
  });
});
