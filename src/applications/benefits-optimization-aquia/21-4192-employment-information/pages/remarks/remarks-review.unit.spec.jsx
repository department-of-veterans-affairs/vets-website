/**
 * @module tests/reviews/remarks-review.unit.spec
 * @description Unit tests for RemarksReview component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { RemarksReview } from './remarks-review';

describe('RemarksReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Remarks';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <RemarksReview data={{}} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <RemarksReview data={{}} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.textContent).to.include('Remarks');
    });

    it('should show not provided when no remarks', () => {
      const { container } = render(
        <RemarksReview data={{}} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.textContent).to.include('Not provided');
    });
  });

  describe('Data Display', () => {
    it('should display Star Trek mission remarks', () => {
      const data = {
        remarks: {
          remarks:
            'Captain Kirk was instrumental in the successful completion of the five-year mission to explore strange new worlds.',
        },
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.textContent).to.include('Captain Kirk');
      expect(container.textContent).to.include('five-year mission');
    });

    it('should display Prime Directive remark', () => {
      const data = {
        remarks: {
          remarks:
            'Adhered to Starfleet General Order 1 (Prime Directive) throughout the mission.',
        },
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.textContent).to.include('Prime Directive');
    });

    it('should display short remark', () => {
      const data = {
        remarks: {
          remarks: 'Make it so.',
        },
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.textContent).to.include('Make it so.');
    });

    it('should display multiline remarks', () => {
      const data = {
        remarks: {
          remarks:
            'Space: the final frontier.\nThese are the voyages of the starship Enterprise.',
        },
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.textContent).to.include('Space: the final frontier');
      expect(container.textContent).to.include('starship Enterprise');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <RemarksReview data={{}} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container).to.exist;
    });
  });

  describe('Edit Functionality', () => {
    it('should render edit button', () => {
      const { container } = render(
        <RemarksReview data={{}} editPage={mockEditPage} title={mockTitle} />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
      expect(editButton.getAttribute('text')).to.equal('Edit');
    });

    it('should have secondary button style', () => {
      const { container } = render(
        <RemarksReview data={{}} editPage={mockEditPage} title={mockTitle} />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton.hasAttribute('secondary')).to.be.true;
    });

    it('should use uswds style', () => {
      const { container } = render(
        <RemarksReview data={{}} editPage={mockEditPage} title={mockTitle} />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton.hasAttribute('uswds')).to.be.true;
    });
  });

  describe('Missing Data Handling', () => {
    it('should show not provided for empty remarks', () => {
      const data = {
        remarks: {
          remarks: '',
        },
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should show not provided for undefined remarks', () => {
      const data = {
        remarks: {},
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should show not provided for null remarks', () => {
      const data = {
        remarks: {
          remarks: null,
        },
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.textContent).to.include('Not provided');
    });
  });

  describe('Data Structure Variations', () => {
    it('should handle missing remarks object', () => {
      const data = {};

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container).to.exist;
    });

    it('should handle null remarks object', () => {
      const data = {
        remarks: null,
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container).to.exist;
    });

    it('should handle undefined data.remarks', () => {
      const data = {
        remarks: undefined,
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container).to.exist;
    });
  });

  describe('Review Row Structure', () => {
    it('should have one review row', () => {
      const data = {
        remarks: {
          remarks: 'Live long and prosper.',
        },
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      expect(reviewRows).to.have.lengthOf(1);
    });

    it('should have dt and dd elements', () => {
      const data = {
        remarks: {
          remarks: 'To boldly go.',
        },
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      const reviewRow = container.querySelector('.review-row');
      expect(reviewRow.querySelector('dt')).to.exist;
      expect(reviewRow.querySelector('dd')).to.exist;
    });
  });

  describe('CSS Classes', () => {
    it('should have correct container class', () => {
      const { container } = render(
        <RemarksReview data={{}} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.querySelector('.form-review-panel-page')).to.exist;
    });

    it('should have review class on dl element', () => {
      const { container } = render(
        <RemarksReview data={{}} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.querySelector('dl.review')).to.exist;
    });
  });

  describe('Long Remarks Display', () => {
    it('should display long remarks', () => {
      const longRemark =
        'Throughout the five-year mission aboard the USS Enterprise, Captain James T. Kirk demonstrated exemplary leadership qualities, successfully negotiating peace treaties with multiple alien species, averting galactic conflicts, and upholding Starfleet values of exploration and diplomacy.';
      const data = {
        remarks: {
          remarks: longRemark,
        },
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.textContent).to.include('five-year mission');
      expect(container.textContent).to.include('exemplary leadership');
    });

    it('should display maximum length remarks', () => {
      const maxRemark = 'A'.repeat(2000);
      const data = {
        remarks: {
          remarks: maxRemark,
        },
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.textContent).to.include('A'.repeat(100));
    });
  });

  describe('Star Trek Quotes', () => {
    it('should display Spock quote', () => {
      const data = {
        remarks: {
          remarks: 'The needs of the many outweigh the needs of the few.',
        },
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.textContent).to.include('needs of the many');
    });

    it('should display Kirk quote', () => {
      const data = {
        remarks: {
          remarks: 'Risk is our business.',
        },
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.textContent).to.include('Risk is our business');
    });

    it('should display McCoy quote', () => {
      const data = {
        remarks: {
          remarks: "I'm a doctor, not a bricklayer!",
        },
      };

      const { container } = render(
        <RemarksReview data={data} editPage={mockEditPage} title={mockTitle} />,
      );

      expect(container.textContent).to.include("I'm a doctor");
    });
  });
});
