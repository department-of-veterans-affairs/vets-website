import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import Name from '../Name';

describe('pre-check-in experience', () => {
  describe('Edit pages', () => {
    describe('Name', () => {
      it('passes axeCheck', () => {
        axeCheck(<Name />);
      });
    });
  });
});
