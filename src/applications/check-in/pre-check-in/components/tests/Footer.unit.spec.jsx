import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import Footer from '../Footer';

describe('pre-check-in', () => {
  describe('Footer', () => {
    it('check in button passes axeCheck', () => {
      axeCheck(<Footer />);
    });
  });
});
