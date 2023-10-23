import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import InsuranceSummary from '../../../../components/FormPages/InsuranceSummary';
import content from '../../../../locales/en/content.json';

describe('ezr InsuranceSummary', () => {
  const defaultProps = {
    data: {
      providers: [
        {
          insuranceName: 'Cigna',
          insurancePolicyHolderName: 'John Smith',
          insurancePolicyNumber: '006655',
        },
      ],
    },
    onReviewPage: false,
  };

  context('when no policies have been added', () => {
    const props = { ...defaultProps, data: { providers: [] } };

    it('should not render a title', () => {
      const { container } = render(<InsuranceSummary {...props} />);
      expect(container.querySelector('#root__title').textContent).to.be.empty;
    });

    it('should not render the policy list field', () => {
      const { container } = render(<InsuranceSummary {...props} />);
      expect(container.querySelector('[data-testid="ezr-policy-list-field"]'))
        .to.not.exist;
    });
  });

  context('when policies have been added', () => {
    it('should render the specific form page title', () => {
      const { container } = render(<InsuranceSummary {...defaultProps} />);
      expect(container.querySelector('#root__title')).to.contain.text(
        content['insurance-summary-title'],
      );
    });

    it('should render the policy list field', () => {
      const { container } = render(<InsuranceSummary {...defaultProps} />);
      expect(container.querySelector('[data-testid="ezr-policy-list-field"]'))
        .to.exist;
    });
  });

  context('when not rendered on the review page', () => {
    it('should render the policy declaration field', () => {
      const { container } = render(<InsuranceSummary {...defaultProps} />);
      expect(
        container.querySelector('[data-testid="ezr-policy-declaration-field"]'),
      ).to.exist;
    });

    it('should render the form progress buttons', () => {
      const { container } = render(<InsuranceSummary {...defaultProps} />);
      expect(container.querySelector('.form-progress-buttons')).to.exist;
    });

    it('should not render the `update page` button', () => {
      const { container } = render(<InsuranceSummary {...defaultProps} />);
      expect(container.querySelector('[data-testid="ezr-update-button"]')).to
        .not.exist;
    });
  });

  context('when rendered on the review page', () => {
    const props = { ...defaultProps, onReviewPage: true };

    it('should not render the policy declaration field', () => {
      const { container } = render(<InsuranceSummary {...props} />);
      expect(
        container.querySelector('[data-testid="ezr-policy-declaration-field"]'),
      ).to.not.exist;
    });

    it('should not render the form progress buttons', () => {
      const { container } = render(<InsuranceSummary {...props} />);
      expect(container.querySelector('.form-progress-buttons')).to.not.exist;
    });

    it('should render the `update page` button', () => {
      const { container } = render(<InsuranceSummary {...props} />);
      expect(container.querySelector('[data-testid="ezr-update-button"]')).to
        .exist;
    });
  });
});
