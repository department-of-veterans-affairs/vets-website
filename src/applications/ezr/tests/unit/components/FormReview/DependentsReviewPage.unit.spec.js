import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import DependentsReviewPage from '../../../../components/FormReview/DependentsReviewPage';
import content from '../../../../locales/en/content.json';

describe('ezr DependentsReviewPage', () => {
  const defaultProps = { data: { dependents: [] }, editPage: sinon.spy() };

  context('when the component renders', () => {
    it('should render the form element', () => {
      const { container } = render(<DependentsReviewPage {...defaultProps} />);
      const selector = container.querySelector('.rjsf');
      expect(selector).to.not.be.empty;
    });
  });

  context('when no dependents are reported', () => {
    it('should not render edit button', () => {
      const { container } = render(<DependentsReviewPage {...defaultProps} />);
      const selector = container.querySelector('.edit-btn');
      expect(selector).to.not.exist;
    });

    it('should render `dependents to report` question', () => {
      const { container } = render(<DependentsReviewPage {...defaultProps} />);
      const selector = container.querySelectorAll('.review-row');
      expect(selector).to.have.lengthOf(1);
      expect(container.querySelector('.review-row')).to.contain.text(
        content['household-dependent-report-question'],
      );
    });
  });

  context('when dependents are reported', () => {
    const props = {
      ...defaultProps,
      data: {
        dependents: [
          {
            fullName: { first: 'John', last: 'Smith' },
            dependentRelation: 'Son',
          },
          {
            fullName: { first: 'Mary', last: 'Smith' },
            dependentRelation: 'Daughter',
          },
        ],
      },
    };

    it('should render edit button', () => {
      const { container } = render(<DependentsReviewPage {...props} />);
      const selector = container.querySelector('.edit-btn');
      expect(selector).to.exist;
    });

    it('should render dependents list items', () => {
      const { container } = render(<DependentsReviewPage {...props} />);
      const selector = container.querySelectorAll('.review-row');
      expect(selector).to.have.lengthOf(2);
    });
  });

  context('when the user clicks on the edit button', () => {
    const props = {
      ...defaultProps,
      data: {
        dependents: [
          {
            fullName: { first: 'John', last: 'Smith' },
            dependentRelation: 'Son',
          },
          {
            fullName: { first: 'Mary', last: 'Smith' },
            dependentRelation: 'Daughter',
          },
        ],
      },
    };

    it('should fire event to trigger the edit flow', () => {
      const { container } = render(<DependentsReviewPage {...props} />);
      const selector = container.querySelector('.edit-btn');
      fireEvent.click(selector);
      expect(props.editPage.called).to.be.true;
    });
  });
});
