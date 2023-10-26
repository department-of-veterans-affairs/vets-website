import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentInformation from '../../../../components/FormPages/DependentInformation';

describe('ezr DependentInformation', () => {
  const defaultProps = {
    data: { dependents: [] },
    goToPath: () => {},
    setFormData: () => {},
  };

  context('when the component renders', () => {
    it('should render form object with the correct title', () => {
      const { container } = render(<DependentInformation {...defaultProps} />);
      const selector = container.querySelector('.rjsf');
      expect(selector).to.exist;
    });

    it('should render cancel button to trigger confirmation modal', () => {
      const { container } = render(<DependentInformation {...defaultProps} />);
      const selector = container.querySelector('#ezr-modal-cancel');
      expect(selector).to.exist;
    });

    it('should render form navigation buttons', () => {
      const { container } = render(<DependentInformation {...defaultProps} />);
      const selectors = {
        backBtn: container.querySelector('.usa-button-secondary'),
        continueBtn: container.querySelector('.usa-button-primary'),
      };
      expect(selectors.backBtn).to.exist;
      expect(selectors.continueBtn).to.exist;
    });
  });
});
