/**
 * @module tests/pages/service-branch.unit.spec
 * @description Unit tests for ServiceBranchPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ServiceBranchPage } from './service-branch';

describe('ServiceBranchPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockGoToPath = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ServiceBranchPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Service periods');
    });

    it('should render branch of service select field', () => {
      const { container } = render(
        <ServiceBranchPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select[label="Branch of service"]')).to
        .exist;
    });

    it('should render required branch field', () => {
      const { container } = render(
        <ServiceBranchPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const select = container.querySelector(
        'va-select[label="Branch of service"]',
      );
      expect(select.getAttribute('required')).to.exist;
    });
  });

  describe('Data Handling', () => {
    it('should render with existing tempServicePeriod data', () => {
      const existingData = {
        tempServicePeriod: {
          branchOfService: 'army',
        },
      };

      const { container } = render(
        <ServiceBranchPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <ServiceBranchPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });

    it('should handle null tempServicePeriod', () => {
      const dataWithNull = {
        tempServicePeriod: null,
      };

      const { container } = render(
        <ServiceBranchPage
          goForward={mockGoForward}
          data={dataWithNull}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-select')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <ServiceBranchPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );
      expect(continueButton).to.exist;
    });

    it('should render back button when goBack is provided', () => {
      const { container } = render(
        <ServiceBranchPage
          goForward={mockGoForward}
          goBack={mockGoBack}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const backButton = container.querySelector('va-button[text="Back"]');
      expect(backButton).to.exist;
    });

    it('should show cancel button when editing existing service period', () => {
      const editingData = {
        servicePeriods: [{ branchOfService: 'army' }],
        editingServicePeriodIndex: 0,
        tempServicePeriod: { branchOfService: 'navy' },
      };

      const { container } = render(
        <ServiceBranchPage
          goForward={mockGoForward}
          goBack={mockGoBack}
          goToPath={mockGoToPath}
          data={editingData}
          setFormData={mockSetFormData}
        />,
      );

      const cancelButton = container.querySelector('va-button[text="Cancel"]');
      expect(cancelButton).to.exist;
    });

    it('should show cancel button when adding another service period', () => {
      const addingData = {
        servicePeriods: [{ branchOfService: 'army' }],
        tempServicePeriod: { branchOfService: '' },
      };

      const { container } = render(
        <ServiceBranchPage
          goForward={mockGoForward}
          goBack={mockGoBack}
          goToPath={mockGoToPath}
          data={addingData}
          setFormData={mockSetFormData}
        />,
      );

      const cancelButton = container.querySelector('va-button[text="Cancel"]');
      expect(cancelButton).to.exist;
    });

    it('should show back button for first entry', () => {
      const firstEntryData = {
        servicePeriods: [],
        tempServicePeriod: { branchOfService: '' },
      };

      const { container } = render(
        <ServiceBranchPage
          goForward={mockGoForward}
          goBack={mockGoBack}
          data={firstEntryData}
          setFormData={mockSetFormData}
        />,
      );

      const backButton = container.querySelector('va-button[text="Back"]');
      expect(backButton).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render save button instead of continue in review mode', () => {
      const { container } = render(
        <ServiceBranchPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      const saveButton = container.querySelector('va-button[text="Save"]');
      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );

      expect(saveButton).to.exist;
      expect(continueButton).to.not.exist;
    });
  });
});
