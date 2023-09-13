import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import DependentsReviewPage from '../../../components/FormReview/DependentsReviewPage';

describe('hca DependentsReviewPage', () => {
  const defaultProps = { data: { dependents: [] }, editPage: sinon.spy() };

  describe('when the component renders', () => {
    it('should render the form element', () => {
      const { container } = render(<DependentsReviewPage {...defaultProps} />);
      const selector = container.querySelector('.rjsf');
      expect(selector).to.not.be.empty;
    });
  });

  describe('when no dependents are declared', () => {
    it('should not render edit button', () => {
      const { container } = render(<DependentsReviewPage {...defaultProps} />);
      const selector = container.querySelector('.edit-btn');
      expect(selector).to.not.exist;
    });

    it('should render dependents declaration question', () => {
      const { container } = render(<DependentsReviewPage {...defaultProps} />);
      const selector = container.querySelectorAll('.review-row');
      expect(selector).to.have.lengthOf(1);
      expect(container.querySelector('.review-row')).to.contain.text(
        'Do you have any dependents to report?',
      );
    });
  });

  describe('when dependents are declared', () => {
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

  describe('when the user clicks on the edit button', () => {
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
