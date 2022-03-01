import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import Relationship from '../Relationship';

describe('pre-check-in experience', () => {
  describe('Edit pages', () => {
    describe('Relationship', () => {
      it('passes axeCheck', () => {
        axeCheck(<Relationship />);
      });
    });
  });
});
