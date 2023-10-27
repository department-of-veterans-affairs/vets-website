import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentSummary from '../../../../components/FormPages/DependentSummary';
import content from '../../../../locales/en/content.json';

describe('ezr DependentSummary', () => {
  const defaultProps = {
    data: {
      dependents: [
        {
          fullName: { first: 'John', last: 'Smith' },
          dependentRelation: 'son',
        },
      ],
    },
    onReviewPage: false,
  };

  context('when no dependents have been reported', () => {
    const props = { ...defaultProps, data: { dependents: [] } };

    it('should not render a title', () => {
      const { container } = render(<DependentSummary {...props} />);
      expect(container.querySelector('#root__title').textContent).to.be.empty;
    });

    it('should not render the dependents list field', () => {
      const { container } = render(<DependentSummary {...props} />);
      expect(
        container.querySelector('[data-testid="ezr-dependent-list-field"]'),
      ).to.not.exist;
    });
  });

  context('when dependents have been reported', () => {
    it('should render the specific form page title', () => {
      const { container } = render(<DependentSummary {...defaultProps} />);
      expect(container.querySelector('#root__title')).to.contain.text(
        content['household-dependent-summary-title'],
      );
    });

    it('should render the dependents list field', () => {
      const { container } = render(<DependentSummary {...defaultProps} />);
      expect(
        container.querySelector('[data-testid="ezr-dependent-list-field"]'),
      ).to.exist;
    });
  });

  context('when not rendered on the review page', () => {
    it('should render the dependent declaration field', () => {
      const { container } = render(<DependentSummary {...defaultProps} />);
      expect(
        container.querySelector(
          '[data-testid="ezr-dependent-declaration-field"]',
        ),
      ).to.exist;
    });

    it('should render the form progress buttons', () => {
      const { container } = render(<DependentSummary {...defaultProps} />);
      expect(container.querySelector('.form-progress-buttons')).to.exist;
    });

    it('should not render the `update page` button', () => {
      const { container } = render(<DependentSummary {...defaultProps} />);
      expect(container.querySelector('[data-testid="ezr-update-button"]')).to
        .not.exist;
    });
  });

  context('when rendered on the review page', () => {
    const props = { ...defaultProps, onReviewPage: true };

    it('should not render the dependent declaration field', () => {
      const { container } = render(<DependentSummary {...props} />);
      expect(
        container.querySelector(
          '[data-testid="ezr-dependent-declaration-field"]',
        ),
      ).to.not.exist;
    });

    it('should not render the form progress buttons', () => {
      const { container } = render(<DependentSummary {...props} />);
      expect(container.querySelector('.form-progress-buttons')).to.not.exist;
    });

    it('should render the `update page` button', () => {
      const { container } = render(<DependentSummary {...props} />);
      expect(container.querySelector('[data-testid="ezr-update-button"]')).to
        .exist;
    });
  });
});
