import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CompensationTypeReviewPage from '../../../../components/FormReview/CompensationTypeReviewPage';

describe('hca CompensationTypeReviewPage', () => {
  const getData = ({ vaCompensationType = 'none' }) => ({
    props: {
      data: { vaCompensationType },
    },
  });

  context('when the component renders', () => {
    it('should render form with title and navigation', () => {
      const { props } = getData({});
      const { container } = render(<CompensationTypeReviewPage {...props} />);
      const selectors = {
        form: container.querySelector('.rjsf'),
        title: container.querySelector('.form-review-panel-page-header'),
        link: container.querySelector('[data-testid="hca-nav-link"]'),
      };
      expect(selectors.form).to.not.be.empty;
      expect(selectors.title).to.contain.text('Current compensation from VA');
      expect(selectors.link).to.contain.text(
        'Go back to edit compensation information',
      );
    });
  });

  context('when user does not receive disability compensation', () => {
    it('should render correct compensation type', () => {
      const { props } = getData({});
      const { container } = render(<CompensationTypeReviewPage {...props} />);
      const selector = container.querySelector('dd', '.review-row');
      expect(selector).to.contain.text('No');
    });
  });

  context('when user receives compensation for low disability rating', () => {
    it('should render correct compensation type', () => {
      const { props } = getData({ vaCompensationType: 'lowDisability' });
      const { container } = render(<CompensationTypeReviewPage {...props} />);
      const selector = container.querySelector('dd', '.review-row');
      expect(selector).to.contain.text('Yes (40% or lower rating)');
    });
  });

  context('when user receives compensation for high disability rating', () => {
    it('should render correct compensation type', () => {
      const { props } = getData({ vaCompensationType: 'highDisability' });
      const { container } = render(<CompensationTypeReviewPage {...props} />);
      const selector = container.querySelector('dd', '.review-row');
      expect(selector).to.contain.text('Yes (50% or higher rating)');
    });
  });
});
