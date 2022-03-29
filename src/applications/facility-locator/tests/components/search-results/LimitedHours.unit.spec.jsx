import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import LimitedHours from '../../../components/search-results-items/LimitedHours';

describe('facility-locator', () => {
  describe('LimitedHours', () => {
    it('passes axeCheck', () => {
      axeCheck(<LimitedHours />);
    });
  });
});
