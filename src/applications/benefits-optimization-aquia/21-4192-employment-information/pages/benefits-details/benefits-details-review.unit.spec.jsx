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
    it('should display all benefit details fields', () => {
      const data = {
        benefitsDetails: {
          benefitType: 'Education benefits under Post-9/11 GI Bill',
          grossMonthlyAmount: '2000',
          startReceivingDate: '2023-01-15',
          firstPaymentDate: '2023-02-01',
          stopReceivingDate: '2027-12-31',
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
      expect(text).to.include('Type of benefit');
      expect(text).to.include('Education benefits under Post-9/11 GI Bill');
      expect(text).to.include('Gross monthly amount of benefit');
      expect(text).to.include('2000');
      expect(text).to.include('start receiving this benefit');
      expect(text).to.include('January 15, 2023');
      expect(text).to.include('first payment for this benefit');
      expect(text).to.include('February 1, 2023');
      expect(text).to.include('no longer receive this benefit');
      expect(text).to.include('December 31, 2027');
    });

    it('should use dynamic veteran name in labels', () => {
      const data = {
        veteranInformation: {
          firstName: 'John',
          lastName: 'Doe',
        },
        benefitsDetails: {
          startReceivingDate: '2023-01-15',
          firstPaymentDate: '2023-02-01',
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
      expect(text).to.include('When did John Doe start receiving');
      expect(text).to.include('When did John Doe receive their first payment');
      expect(text).to.include('When will John Doe no longer receive');
    });

    it('should use "the Veteran" when name is missing', () => {
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
      const text = container.textContent;
      expect(text).to.include('When did the Veteran start receiving');
      expect(text).to.include(
        'When did the Veteran receive their first payment',
      );
      expect(text).to.include('When will the Veteran no longer receive');
    });

    it('should format dates correctly', () => {
      const data = {
        benefitsDetails: {
          startReceivingDate: '2023-06-15',
          firstPaymentDate: '2023-07-01',
          stopReceivingDate: '2025-12-31',
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
      expect(text).to.include('June 15, 2023');
      expect(text).to.include('July 1, 2023');
      expect(text).to.include('December 31, 2025');
    });
  });

  describe('Missing Data Handling', () => {
    it('should display "Not provided" for missing benefit type', () => {
      const data = {
        benefitsDetails: {
          benefitType: '',
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

    it('should display "Not provided" for missing dates', () => {
      const data = {
        benefitsDetails: {
          startReceivingDate: '',
          firstPaymentDate: '',
          stopReceivingDate: '',
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
      // Check that "Not provided" appears multiple times for missing dates
      const notProvidedCount = (text.match(/Not provided/g) || []).length;
      expect(notProvidedCount).to.be.at.least(3);
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
