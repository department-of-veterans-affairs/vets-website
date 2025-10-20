/**
 * @module tests/pages/benefits-information.unit.spec
 * @description Unit tests for BenefitsInformationPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { BenefitsInformationPage } from './benefits-information';

describe('BenefitsInformationPage', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <BenefitsInformationPage
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
        <BenefitsInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include('Benefits information');
    });

    it('should render heading', () => {
      const { container } = render(
        <BenefitsInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include('Benefit entitlement');
    });

    it('should render radio field', () => {
      const { container } = render(
        <BenefitsInformationPage
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
    it('should display Yes selection for Guild benefits', () => {
      const data = {
        benefitsInformation: {
          benefitEntitlement: 'yes',
        },
      };

      const { container } = render(
        <BenefitsInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup.getAttribute('value')).to.equal('yes');
    });

    it('should display No selection', () => {
      const data = {
        benefitsInformation: {
          benefitEntitlement: 'no',
        },
      };

      const { container } = render(
        <BenefitsInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector('va-radio');
      expect(radioGroup.getAttribute('value')).to.equal('no');
    });
  });

  describe('Data Handling Edge Cases', () => {
    it('should handle null data prop', () => {
      const { container } = render(
        <BenefitsInformationPage
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-radio')).to.exist;
    });

    it('should handle undefined data prop', () => {
      const { container } = render(
        <BenefitsInformationPage
          data={undefined}
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
        benefitsInformation: {
          benefitEntitlement: 'yes',
        },
      };

      const { container } = render(
        <BenefitsInformationPage
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
