/**
 * @module tests/pages/benefit-type.unit.spec
 * @description Unit tests for BenefitTypePage component
 */

import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { BenefitTypePage } from './benefit-type';

describe('Benefit Type Selection Form', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Form Initialization', () => {
    it('should render without errors', () => {
      const { container } = render(
        <BenefitTypePage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should render page title', () => {
      const { container } = render(
        <BenefitTypePage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include('Choose your benefit type');
    });

    it('should render benefit type radio buttons', () => {
      const { container } = render(
        <BenefitTypePage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should display selected benefit type', () => {
      const data = {
        benefitType: {
          benefitType: 'smc',
        },
      };

      const { container } = render(
        <BenefitTypePage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup).to.exist;
      expect(radioGroup.getAttribute('value')).to.equal('smc');
    });

    it('should handle empty data', () => {
      const { container } = render(
        <BenefitTypePage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null data prop', () => {
      const { container } = render(
        <BenefitTypePage
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-radio')).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode', () => {
      const data = {
        benefitType: {
          benefitType: 'smp',
        },
      };

      const { container } = render(
        <BenefitTypePage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      expect(container).to.exist;
    });
  });
});
