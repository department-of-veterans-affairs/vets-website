/**
 * @module tests/pages/examiner-signature.unit.spec
 * @description Unit tests for ExaminerSignaturePage component
 */

import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { ExaminerSignaturePage } from './examiner-signature';

describe('Medical Examiner Certification Form', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Form Initialization', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ExaminerSignaturePage
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
        <ExaminerSignaturePage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include('Examination certification');
    });

    it('should render certification text', () => {
      const { container } = render(
        <ExaminerSignaturePage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'I certify that I have examined the above-named patient',
      );
    });

    it('should render medical examiner certification alert', () => {
      const { container } = render(
        <ExaminerSignaturePage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'Medical Examiner Certification',
      );
    });

    it('should render examination complete alert', () => {
      const { container } = render(
        <ExaminerSignaturePage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include('Examination complete');
    });

    it('should render what happens next additional info', () => {
      const { container } = render(
        <ExaminerSignaturePage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const additionalInfo = container.querySelector('va-additional-info');
      expect(additionalInfo).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should handle empty data', () => {
      const { container } = render(
        <ExaminerSignaturePage
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
        <ExaminerSignaturePage
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
        examinerSignature: {
          examinationDate: '2024-01-01',
          examinerSignature: 'Dr. Smith',
          examinerSignatureDate: '2024-01-01',
        },
      };

      const { container } = render(
        <ExaminerSignaturePage
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
