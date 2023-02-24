import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import LandingPage from '../LandingPage';

describe('MHV landing page', () => {
  describe('LandingPage', () => {
    it('renders landing page container', () => {
      const { getByTestId } = render(<LandingPage />);
      expect(getByTestId('landing-page-container')).to.exist;
    });
  });
});
