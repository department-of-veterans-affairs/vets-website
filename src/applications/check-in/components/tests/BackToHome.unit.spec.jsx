import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import BackToHome from '../BackToHome';

describe('pre-check-in', () => {
  describe('BackToHome', () => {
    it('Does not render when not run in a local environment', () => {
      const goBack = sinon.spy();

      const mockRouter = { goBack, location: {} };
      const screen = render(<BackToHome router={mockRouter} />);

      expect(screen.queryByTestId('back-to-home-button')).to.equal(null);
    });
  });
});
