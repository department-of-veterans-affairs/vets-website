/**
 * @module tests/pages/veteran-service.unit.spec
 * @description Unit tests for VeteranServicePage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranServicePage } from './veteran-service';

describe('VeteranServicePage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranServicePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include("Veteran's active duty service");
    });

    it('should render all required fields', () => {
      const { container } = render(
        <VeteranServicePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-radio[label="Branch of service"]')).to
        .exist;

      expect(
        container.querySelector(
          'va-memorable-date[label="Date entered active service"]',
        ),
      ).to.exist;
      expect(
        container.querySelector(
          'va-memorable-date[label="Date left active service"]',
        ),
      ).to.exist;

      expect(
        container.querySelector(
          'va-text-input[label="Place entered active service"]',
        ),
      ).to.exist;
      expect(
        container.querySelector(
          'va-text-input[label="Place left active service"]',
        ),
      ).to.exist;
      expect(
        container.querySelector(
          'va-text-input[label="Grade, rank or rating when separated from service"]',
        ),
      ).to.exist;
    });

    it('should show alternate name question', () => {
      const { container } = render(
        <VeteranServicePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include('Service under another name');
    });
  });

  describe('Conditional Fields', () => {
    it('should not show alternate name fields when hasAlternateName is not yes', () => {
      const { container } = render(
        <VeteranServicePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(
        container.querySelector(
          'va-text-input[label="Name veteran served under"]',
        ),
      ).to.not.exist;
    });

    it('should render alternate name radio field', () => {
      const { container } = render(
        <VeteranServicePage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const radioFields = container.querySelectorAll('va-radio');
      expect(radioFields.length).to.be.at.least(2);
    });
  });

  describe('Data Handling', () => {
    it('should render with existing data', () => {
      const existingData = {
        branchOfService: 'army',
        dateEnteredService: '1962-01-01',
        dateSeparated: '1965-05-19',
        placeEnteredService: 'Coruscant Jedi Temple',
        placeSeparated: 'Mustafar',
        rankAtSeparation: 'Jedi Knight / General',
      };

      const { container } = render(
        <VeteranServicePage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-radio')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <VeteranServicePage
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
        <VeteranServicePage
          goForward={mockGoForward}
          goBack={mockGoBack}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const backButton = container.querySelector('va-button[text="Back"]');
      expect(backButton).to.exist;
    });
  });
});
