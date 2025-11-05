/**
 * @module tests/pages/benefits-details-review.unit.spec
 * @description Unit tests for Benefits Details review component
 */

import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { BenefitsDetailsReview } from './benefits-details-review';

describe('BenefitsDetailsReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Benefits details';

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const data = {
        benefitsDetails: {
          benefitDetails: 'Education benefits under Post-9/11 GI Bill',
        },
      };
      const { container } = render(
        <BenefitsDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should display title', () => {
      const data = {
        benefitsDetails: {},
      };
      const { container } = render(
        <BenefitsDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const heading = container.querySelector('h4');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal(mockTitle);
    });

    it('should display edit button', () => {
      const data = {
        benefitsDetails: {},
      };
      const { container } = render(
        <BenefitsDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
      expect(editButton.getAttribute('text')).to.equal('Edit');
    });
  });

  describe('Data Display', () => {
    it('should display benefit details', () => {
      const data = {
        benefitsDetails: {
          benefitDetails: 'Education benefits under Post-9/11 GI Bill',
        },
      };
      const { container } = render(
        <BenefitsDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Benefit details');
      expect(text).to.include('Education benefits under Post-9/11 GI Bill');
    });
  });

  describe('Missing Data Handling', () => {
    it('should display "Not provided" for missing benefit details', () => {
      const data = {
        benefitsDetails: {
          benefitDetails: '',
        },
      };
      const { container } = render(
        <BenefitsDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should handle undefined benefitsDetails', () => {
      const data = {};
      const { container } = render(
        <BenefitsDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should handle null data', () => {
      const data = {
        benefitsDetails: null,
      };
      const { container } = render(
        <BenefitsDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });
  });
});
