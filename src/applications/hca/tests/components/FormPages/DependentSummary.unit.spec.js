import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentSummary from '../../../components/FormPages/DependentSummary';

describe('hca DependentSummary', () => {
  describe('when no dependents have been declared', () => {
    const props = {
      data: {
        dependents: [],
      },
      onReviewPage: false,
    };

    it('should not render a title', () => {
      const view = render(<DependentSummary {...props} />);
      expect(view.container.querySelector('#root__title').textContent).to.be
        .empty;
    });

    it('should not render the dependents list field', () => {
      const view = render(<DependentSummary {...props} />);
      expect(
        view.container.querySelector(
          '[data-testid="hca-dependent-list-field"]',
        ),
      ).to.not.exist;
    });
  });

  describe('when dependents have been declared', () => {
    const props = {
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

    it('should render the specific form page title', () => {
      const view = render(<DependentSummary {...props} />);
      expect(view.container.querySelector('#root__title').textContent).to.match(
        /^review your dependents/i,
      );
    });

    it('should render the dependents list field', () => {
      const view = render(<DependentSummary {...props} />);
      expect(
        view.container.querySelector(
          '[data-testid="hca-dependent-list-field"]',
        ),
      ).to.exist;
    });
  });

  describe('when not rendered on the review page', () => {
    const props = {
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

    it('should render the dependent declaration field', () => {
      const view = render(<DependentSummary {...props} />);
      expect(
        view.container.querySelector(
          '[data-testid="hca-dependent-declaration-field"]',
        ),
      ).to.exist;
    });

    it('should render the form progress buttons', () => {
      const view = render(<DependentSummary {...props} />);
      expect(view.container.querySelector('.form-progress-buttons')).to.exist;
    });

    it('should not render the `update page` button', () => {
      const view = render(<DependentSummary {...props} />);
      expect(view.container.querySelector('[data-testid="hca-update-button"]'))
        .to.not.exist;
    });
  });

  describe('when rendered on the review page', () => {
    const props = {
      data: {
        dependents: [
          {
            fullName: { first: 'John', last: 'Smith' },
            dependentRelation: 'son',
          },
        ],
      },
      onReviewPage: true,
    };

    it('should not render the dependent declaration field', () => {
      const view = render(<DependentSummary {...props} />);
      expect(
        view.container.querySelector(
          '[data-testid="hca-dependent-declaration-field"]',
        ),
      ).to.not.exist;
    });

    it('should not render the form progress buttons', () => {
      const view = render(<DependentSummary {...props} />);
      expect(view.container.querySelector('.form-progress-buttons')).to.not
        .exist;
    });

    it('should render the `update page` button', () => {
      const view = render(<DependentSummary {...props} />);
      expect(view.container.querySelector('[data-testid="hca-update-button"]'))
        .to.exist;
    });
  });
});
