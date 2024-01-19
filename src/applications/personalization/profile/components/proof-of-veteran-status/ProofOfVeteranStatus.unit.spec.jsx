import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ProofOfVeteranStatus from './ProofOfVeteranStatus';

describe('ProofOfVeteranStatus', () => {
  describe('when it exists', () => {
    it('should render heading', () => {
      const view = render(<ProofOfVeteranStatus />);
      expect(view.queryByText(/Proof of Veteran status/)).to.exist;
    });
    it('should render description copy', () => {
      const view = render(<ProofOfVeteranStatus />);
      expect(
        view.queryByText(
          /get discounts offered to Veterans at many restaurants/i,
        ),
      ).to.exist;
    });
    it('should render mobile app callout', () => {
      const view = render(<ProofOfVeteranStatus />);
      expect(
        view.queryByText(/Get proof of Veteran Status on your mobile device/i),
      ).to.exist;
    });
  });
});
