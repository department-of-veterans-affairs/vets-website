/**
 * @module tests/pages/adl-assessment.unit.spec
 * @description Unit tests for ADLAssessmentPage component
 */

import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { ADLAssessmentPage } from './adl-assessment';

describe('Activities of Daily Living Assessment Form', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Form Initialization', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ADLAssessmentPage
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
        <ADLAssessmentPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'Activities of Daily Living (ADL) assessment',
      );
    });

    it('should render instruction alert', () => {
      const { container } = render(
        <ADLAssessmentPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'indicate the level of assistance required',
      );
    });

    it('should render all 7 ADL items', () => {
      const { container } = render(
        <ADLAssessmentPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroups = container.querySelectorAll('va-radio');
      expect(radioGroups.length).to.equal(7);
    });

    it('should render qualification alert', () => {
      const { container } = render(
        <ADLAssessmentPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'needs assistance with 2 or more ADLs',
      );
    });
  });

  describe('Data Display', () => {
    it('should display ADL assessment values', () => {
      const data = {
        adlAssessment: {
          adlDressing: 'independent',
          adlBathing: 'needs_assistance',
        },
      };

      const { container } = render(
        <ADLAssessmentPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty data', () => {
      const { container } = render(
        <ADLAssessmentPage
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
        <ADLAssessmentPage
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroups = container.querySelectorAll('va-radio');
      expect(radioGroups.length).to.equal(7);
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode', () => {
      const data = {
        adlAssessment: {
          adlDressing: 'independent',
          adlBathing: 'independent',
          adlFeeding: 'independent',
          adlToileting: 'needs_assistance',
          adlGrooming: 'independent',
          adlTransferring: 'needs_assistance',
          adlWalking: 'unable',
        },
      };

      const { container } = render(
        <ADLAssessmentPage
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
