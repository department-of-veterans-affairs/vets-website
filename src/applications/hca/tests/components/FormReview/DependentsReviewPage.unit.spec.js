import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import DependentsReviewPage from '../../../components/FormReview/DependentsReviewPage';

describe('hca DependentsReviewPage', () => {
  it('should render', () => {
    const props = { data: { dependents: [] }, editPage: sinon.spy() };
    const view = render(<DependentsReviewPage {...props} />);
    expect(view.container.querySelector('.form-review-panel-page')).to.exist;
  });

  describe('when no dependents are declared', () => {
    const props = { data: { dependents: [] }, editPage: sinon.spy() };

    it('should not render edit button', () => {
      const view = render(<DependentsReviewPage {...props} />);
      expect(view.container.querySelector('.edit-btn')).to.not.exist;
    });

    it('should render dependents declaration question', () => {
      const view = render(<DependentsReviewPage {...props} />);
      const selector = view.container.querySelectorAll('.review-row');
      expect(selector).to.have.lengthOf(1);
      expect(view.container.querySelector('.review-row')).to.contain.text(
        'Do you have any dependents to report?',
      );
    });
  });

  describe('when dependents are declared', () => {
    const props = {
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
      editPage: sinon.spy(),
    };

    it('should render edit button', () => {
      const view = render(<DependentsReviewPage {...props} />);
      expect(view.container.querySelector('.edit-btn')).to.exist;
    });

    it('should fire event on edit button click', () => {
      const view = render(<DependentsReviewPage {...props} />);
      fireEvent.click(view.container.querySelector('.edit-btn'));
      expect(props.editPage.called).to.be.true;
    });

    it('should render dependents list items', () => {
      const view = render(<DependentsReviewPage {...props} />);
      const selector = view.container.querySelectorAll('.review-row');
      expect(selector).to.have.lengthOf(2);
    });
  });
});
