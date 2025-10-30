/**
 * @module tests/pages/relationship-to-veteran.unit.spec
 * @description Unit tests for RelationshipToVeteranPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { RelationshipToVeteranPage } from './relationship-to-veteran';

describe('RelationshipToVeteranPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <RelationshipToVeteranPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Relationship to the Veteran');
    });

    it('should render radio field', () => {
      const { container } = render(
        <RelationshipToVeteranPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const radioField = container.querySelector('va-radio');
      expect(radioField).to.exist;
    });

    it('should render radio field with label attribute', () => {
      const { container } = render(
        <RelationshipToVeteranPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const radioField = container.querySelector(
        'va-radio[label="What is your relationship to the Veteran?"]',
      );
      expect(radioField).to.exist;
    });

    it('should render radio field with required attribute', () => {
      const { container } = render(
        <RelationshipToVeteranPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const radioField = container.querySelector('va-radio[required]');
      expect(radioField).to.exist;
    });
  });

  describe('Data Handling', () => {
    it('should render with state cemetery selection', () => {
      const existingData = {
        relationshipToVeteran: 'state_cemetery',
      };

      const { container } = render(
        <RelationshipToVeteranPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      const radioField = container.querySelector('va-radio');
      expect(radioField).to.exist;
    });

    it('should render with tribal organization selection', () => {
      const existingData = {
        relationshipToVeteran: 'tribal_organization',
      };

      const { container } = render(
        <RelationshipToVeteranPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      const radioField = container.querySelector('va-radio');
      expect(radioField).to.exist;
    });

    it('should render with empty data', () => {
      const { container } = render(
        <RelationshipToVeteranPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const radioField = container.querySelector('va-radio');
      expect(radioField).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <RelationshipToVeteranPage
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
        <RelationshipToVeteranPage
          goForward={mockGoForward}
          goBack={mockGoBack}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const backButton = container.querySelector('va-button[text="Back"]');
      expect(backButton).to.exist;
    });

    it('should not render back button when goBack is not provided', () => {
      const { container } = render(
        <RelationshipToVeteranPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const backButton = container.querySelector('va-button[text="Back"]');
      expect(backButton).to.not.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render save button instead of continue in review mode', () => {
      const { container } = render(
        <RelationshipToVeteranPage
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

  describe('Radio Options', () => {
    it('should render radio field with options', () => {
      const { container } = render(
        <RelationshipToVeteranPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const radioField = container.querySelector('va-radio');
      expect(radioField).to.exist;
    });

    it('should have correct question label', () => {
      const { container } = render(
        <RelationshipToVeteranPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const radioField = container.querySelector(
        'va-radio[label="What is your relationship to the Veteran?"]',
      );
      expect(radioField).to.exist;
    });
  });
});
