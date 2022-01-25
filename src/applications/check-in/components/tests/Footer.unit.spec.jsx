import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import Footer from '../Footer';

describe('pre-check-in', () => {
  describe('Footer', () => {
    it('check in button passes axeCheck', () => {
      axeCheck(<Footer />);
    });
    it('renders additional information', () => {
      const { getByText } = render(<Footer message={<p>foo</p>} />);
      expect(getByText('foo')).to.exist;
    });
  });
});
