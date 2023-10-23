import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import InsurancePolicyReviewPage from '../../../../components/FormReview/InsurancePolicyReviewPage';
import content from '../../../../locales/en/content.json';

describe('ezr InsurancePolicyReviewPage', () => {
  const defaultProps = { data: { providers: [] }, editPage: sinon.spy() };

  context('when the component renders', () => {
    it('should render the form element', () => {
      const { container } = render(
        <InsurancePolicyReviewPage {...defaultProps} />,
      );
      const selector = container.querySelector('.rjsf');
      expect(selector).to.not.be.empty;
    });
  });

  context('when no policies have been added', () => {
    it('should not render edit button', () => {
      const { container } = render(
        <InsurancePolicyReviewPage {...defaultProps} />,
      );
      const selector = container.querySelector('.edit-btn');
      expect(selector).to.not.exist;
    });

    it('should render `add policy` question', () => {
      const { container } = render(
        <InsurancePolicyReviewPage {...defaultProps} />,
      );
      const selector = container.querySelectorAll('.review-row');
      expect(selector).to.have.lengthOf(1);
      expect(container.querySelector('.review-row')).to.contain.text(
        content['insurance-coverage-question'],
      );
    });
  });

  context('when dependents are declared', () => {
    const props = {
      ...defaultProps,
      data: {
        providers: [
          {
            insuranceName: 'Cigna',
            insurancePolicyHolderName: 'John Smith',
            insurancePolicyNumber: '006655',
          },
        ],
      },
    };

    it('should render edit button', () => {
      const { container } = render(<InsurancePolicyReviewPage {...props} />);
      const selector = container.querySelector('.edit-btn');
      expect(selector).to.exist;
    });

    it('should render dependents list items', () => {
      const { container } = render(<InsurancePolicyReviewPage {...props} />);
      const selector = container.querySelectorAll('.review-row');
      expect(selector).to.have.lengthOf(props.data.providers.length);
    });
  });

  describe('when the user clicks on the edit button', () => {
    const props = {
      ...defaultProps,
      data: {
        providers: [
          {
            insuranceName: 'Cigna',
            insurancePolicyHolderName: 'John Smith',
            insurancePolicyNumber: '006655',
          },
        ],
      },
    };

    it('should fire event to trigger the edit flow', () => {
      const { container } = render(<InsurancePolicyReviewPage {...props} />);
      const selector = container.querySelector('.edit-btn');
      fireEvent.click(selector);
      expect(props.editPage.called).to.be.true;
    });
  });
});
