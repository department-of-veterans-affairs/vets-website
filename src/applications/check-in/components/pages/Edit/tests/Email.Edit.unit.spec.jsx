import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import Email from '../Email';

describe('pre-check-in experience', () => {
  describe('Edit pages', () => {
    describe('Email', () => {
      it('passes axeCheck', () => {
        axeCheck(<Email />);
      });
    });
  });
});
