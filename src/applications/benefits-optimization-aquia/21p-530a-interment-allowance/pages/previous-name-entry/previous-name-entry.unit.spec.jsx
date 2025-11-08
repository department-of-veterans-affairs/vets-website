/**
 * @module tests/pages/previous-name-entry.unit.spec
 * @description Unit tests for PreviousNameEntryPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { PreviousNameEntryPage } from './previous-name-entry';

describe('PreviousNameEntryPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockGoToPath = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <PreviousNameEntryPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Name the Veteran served under');
    });

    it('should render name fields', () => {
      const { container } = render(
        <PreviousNameEntryPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input[label="First name"]')).to
        .exist;
      expect(container.querySelector('va-text-input[label="Last name"]')).to
        .exist;
    });

    it('should render middle name field', () => {
      const { container } = render(
        <PreviousNameEntryPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input[label="Middle name"]')).to
        .exist;
    });
  });

  describe('Data Handling', () => {
    it('should render with existing tempPreviousName data', () => {
      const existingData = {
        tempPreviousName: {
          fullName: {
            first: 'Anakin',
            middle: '',
            last: 'Skywalker',
          },
        },
      };

      const { container } = render(
        <PreviousNameEntryPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <PreviousNameEntryPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle null tempPreviousName', () => {
      const dataWithNull = {
        tempPreviousName: null,
      };

      const { container } = render(
        <PreviousNameEntryPage
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
        <PreviousNameEntryPage
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
        <PreviousNameEntryPage
          goForward={mockGoForward}
          goBack={mockGoBack}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const backButton = container.querySelector('va-button[text="Back"]');
      expect(backButton).to.exist;
    });

    it('should show cancel button when editing existing previous name', () => {
      const editingData = {
        previousNames: [{ first: 'Anakin', last: 'Skywalker' }],
        editingPreviousNameIndex: 0,
        tempPreviousName: {
          fullName: { first: 'Darth', last: 'Vader' },
        },
      };

      const { container } = render(
        <PreviousNameEntryPage
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

    it('should show cancel button when adding another previous name', () => {
      const addingData = {
        previousNames: [{ first: 'Anakin', last: 'Skywalker' }],
        tempPreviousName: {
          fullName: { first: '', last: '' },
        },
      };

      const { container } = render(
        <PreviousNameEntryPage
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
        previousNames: [],
        tempPreviousName: {
          fullName: { first: '', last: '' },
        },
      };

      const { container } = render(
        <PreviousNameEntryPage
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
        <PreviousNameEntryPage
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
