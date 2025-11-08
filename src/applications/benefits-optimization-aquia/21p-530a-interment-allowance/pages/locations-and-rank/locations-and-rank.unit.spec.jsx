/**
 * @module tests/pages/locations-and-rank.unit.spec
 * @description Unit tests for LocationsAndRankPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { LocationsAndRankPage } from './locations-and-rank';

describe('LocationsAndRankPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockGoToPath = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <LocationsAndRankPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Service locations');
    });

    it('should render place of entry field', () => {
      const { container } = render(
        <LocationsAndRankPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(
        container.querySelector(
          'va-text-input[label="Place the Veteran entered active service"]',
        ),
      ).to.exist;
    });

    it('should render place of separation field', () => {
      const { container } = render(
        <LocationsAndRankPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(
        container.querySelector(
          'va-text-input[label="Place the Veteran separated from active service"]',
        ),
      ).to.exist;
    });

    it('should render rank field', () => {
      const { container } = render(
        <LocationsAndRankPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(
        container.querySelector(
          'va-text-input[label="Grade, rank, or rating"]',
        ),
      ).to.exist;
    });

    it('should render instruction text', () => {
      const { container } = render(
        <LocationsAndRankPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        'Please provide additional details about this service period',
      );
    });

    it('should render all required fields', () => {
      const { container } = render(
        <LocationsAndRankPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const placeOfEntry = container.querySelector(
        'va-text-input[label="Place the Veteran entered active service"]',
      );
      const placeOfSeparation = container.querySelector(
        'va-text-input[label="Place the Veteran separated from active service"]',
      );
      const rank = container.querySelector(
        'va-text-input[label="Grade, rank, or rating"]',
      );

      expect(placeOfEntry.getAttribute('required')).to.exist;
      expect(placeOfSeparation.getAttribute('required')).to.exist;
      expect(rank.getAttribute('required')).to.exist;
    });
  });

  describe('Data Handling', () => {
    it('should render with existing tempServicePeriod data', () => {
      const existingData = {
        tempServicePeriod: {
          placeOfEntry: 'Coruscant',
          placeOfSeparation: 'Mustafar',
          rank: 'General',
        },
      };

      const { container } = render(
        <LocationsAndRankPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <LocationsAndRankPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle null tempServicePeriod', () => {
      const dataWithNull = {
        tempServicePeriod: null,
      };

      const { container } = render(
        <LocationsAndRankPage
          goForward={mockGoForward}
          data={dataWithNull}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <LocationsAndRankPage
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
        <LocationsAndRankPage
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
        <LocationsAndRankPage
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
        <LocationsAndRankPage
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
        <LocationsAndRankPage
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
        <LocationsAndRankPage
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
