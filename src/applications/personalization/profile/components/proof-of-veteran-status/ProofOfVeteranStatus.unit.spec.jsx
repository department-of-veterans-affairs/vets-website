import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ProofOfVeteranStatus from './ProofOfVeteranStatus';

describe('ProofOfVeteranStatus', () => {
  describe('when it exists', () => {
    it('should render heading', () => {
      const view = render(<ProofOfVeteranStatus />);
      expect(view.queryByText(/proof of veteran status/i)).to.exist;
    });
    it('should render description copy', () => {
      const view = render(<ProofOfVeteranStatus />);
      expect(view.queryByText(/You can download your military/i)).to.exist;
    });
    it('should render download button', () => {
      const view = render(<ProofOfVeteranStatus />);
      expect(view.queryByText(/Download and print your Veteran/i)).to.exist;
    });
    it('should render mobile app callout', () => {
      const view = render(<ProofOfVeteranStatus />);
      expect(view.queryByText(/status on your mobile device./i)).to.exist;
    });
  });
});
