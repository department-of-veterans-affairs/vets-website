/**
 * @module tests/pages/benefit-type-review.unit.spec
 * @description Unit tests for BenefitTypeReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { BenefitTypeReviewPage } from './benefit-type-review';

describe('BenefitTypeReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Benefit type';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <BenefitTypeReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <BenefitTypeReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Benefit type');
    });

    it('should render edit button', () => {
      const { container } = render(
        <BenefitTypeReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should display SMC benefit type with full label', () => {
      const data = {
        benefitType: {
          benefitType: 'smc',
        },
      };

      const { container } = render(
        <BenefitTypeReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include(
        'Special Monthly Compensation (SMC)',
      );
    });

    it('should display SMP benefit type with full label', () => {
      const data = {
        benefitType: {
          benefitType: 'smp',
        },
      };

      const { container } = render(
        <BenefitTypeReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Special Monthly Pension (SMP)');
    });

    it('should display raw value when label not found', () => {
      const data = {
        benefitType: {
          benefitType: 'unknown',
        },
      };

      const { container } = render(
        <BenefitTypeReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('unknown');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <BenefitTypeReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing benefitType section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <BenefitTypeReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage prop correctly', () => {
      const customEditPage = () => {};
      const { container } = render(
        <BenefitTypeReviewPage
          data={{}}
          editPage={customEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });
});
