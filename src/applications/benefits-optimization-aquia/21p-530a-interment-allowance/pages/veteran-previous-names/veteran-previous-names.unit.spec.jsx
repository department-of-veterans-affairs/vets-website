/**
 * @module tests/pages/veteran-previous-names.unit.spec
 * @description Unit tests for VeteranPreviousNamesPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranPreviousNamesPage } from './veteran-previous-names';

describe('VeteranPreviousNamesPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranPreviousNamesPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Previous names');
    });

    it('should render array field with at least one item', () => {
      const { container } = render(
        <VeteranPreviousNamesPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const arrayItems = container.querySelectorAll('.array-field-item');
      expect(arrayItems).to.have.lengthOf.at.least(1);
    });

    it('should render name fields', () => {
      const { container } = render(
        <VeteranPreviousNamesPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input[label="First name"]')).to
        .exist;
      expect(container.querySelector('va-text-input[label="Middle name"]')).to
        .exist;
      expect(container.querySelector('va-text-input[label="Last name"]')).to
        .exist;
    });

    it('should show instruction text', () => {
      const { container } = render(
        <VeteranPreviousNamesPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        'Please list all names the Veteran served under',
      );
    });
  });

  describe('Data Handling', () => {
    it('should render with existing previous names', () => {
      const existingData = {
        previousNames: [
          {
            firstName: 'Darth',
            middleName: '',
            lastName: 'Vader',
          },
        ],
      };

      const { container } = render(
        <VeteranPreviousNamesPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      const arrayItems = container.querySelectorAll('.array-field-item');
      expect(arrayItems).to.have.lengthOf.at.least(1);
    });

    it('should handle multiple previous names', () => {
      const existingData = {
        previousNames: [
          { firstName: 'Darth', middleName: '', lastName: 'Vader' },
          { firstName: 'Ani', middleName: '', lastName: 'Skywalker' },
        ],
      };

      const { container } = render(
        <VeteranPreviousNamesPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      const arrayItems = container.querySelectorAll('.array-field-item');
      expect(arrayItems.length).to.be.at.least(1);
    });
  });

  describe('ArrayField Functionality', () => {
    it('should render add button', () => {
      const { container } = render(
        <VeteranPreviousNamesPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const addButton = container.querySelector(
        'va-button[text="Add another previous name"]',
      );
      expect(addButton).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <VeteranPreviousNamesPage
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
        <VeteranPreviousNamesPage
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

  describe('Review Mode', () => {
    it('should render save button instead of continue in review mode', () => {
      const { container } = render(
        <VeteranPreviousNamesPage
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
