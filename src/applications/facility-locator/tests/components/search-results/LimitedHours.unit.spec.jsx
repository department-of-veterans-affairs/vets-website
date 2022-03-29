import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import LimitedHours from '../../../components/search-results-items/LimitedHours';

describe('facility-locator', () => {
  describe('LimitedHours', () => {
    it('passes axeCheck', () => {
      axeCheck(<LimitedHours />);
    });
    it('should have tabIdex on the div', () => {
      const { container } = render(<LimitedHours />);
      expect(container.querySelector('div').getAttribute('tabindex')).to.equal(
        '0',
      );
    });
  });
});
