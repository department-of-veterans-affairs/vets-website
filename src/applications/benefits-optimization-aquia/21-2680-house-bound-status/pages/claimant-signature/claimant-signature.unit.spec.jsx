/**
 * @module tests/pages/claimant-signature.unit.spec
 * @description Unit tests for ClaimantSignaturePage component
 */

import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { ClaimantSignaturePage } from './claimant-signature';

describe('ClaimantSignaturePage', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ClaimantSignaturePage
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
        <ClaimantSignaturePage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'Claimant certification and signature',
      );
    });

    it('should render certification text', () => {
      const { container } = render(
        <ClaimantSignaturePage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'I certify that the statements made in this claim are true and complete',
      );
    });

    it('should render important notice alert', () => {
      const { container } = render(
        <ClaimantSignaturePage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const alerts = container.querySelectorAll('va-alert');
      expect(alerts.length).to.be.greaterThan(0);
    });

    it('should render next steps alert', () => {
      const { container } = render(
        <ClaimantSignaturePage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include('Next steps');
    });
  });

  describe('Data Display', () => {
    it('should handle empty data', () => {
      const { container } = render(
        <ClaimantSignaturePage
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
        <ClaimantSignaturePage
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode', () => {
      const data = {
        claimantSignature: {
          claimantSignature: 'John Doe',
          claimantSignatureDate: '2024-01-01',
        },
      };

      const { container } = render(
        <ClaimantSignaturePage
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
