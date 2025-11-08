/**
 * @module tests/pages/mailing-address.unit.spec
 * @description Unit tests for MailingAddressPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MailingAddressPage } from './mailing-address';

describe('MailingAddressPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <MailingAddressPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Burial organization');
      expect(container.textContent).to.include('mailing address');
    });

    it('should render address fields', () => {
      const { container } = render(
        <MailingAddressPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input[label="Street address"]'))
        .to.exist;
      expect(
        container.querySelector('va-text-input[label="Street address line 2"]'),
      ).to.exist;
      expect(container.querySelector('va-text-input[label="City"]')).to.exist;
    });
  });

  describe('Data Handling', () => {
    it('should render with existing address data', () => {
      const existingData = {
        recipientAddress: {
          street: '1138 Temple Way',
          street2: 'High Council Chambers',
          city: 'Coruscant City',
          state: 'DC',
          country: 'USA',
          postalCode: '20001',
          isMilitary: false,
        },
      };

      const { container } = render(
        <MailingAddressPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <MailingAddressPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <MailingAddressPage
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
        <MailingAddressPage
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
        <MailingAddressPage
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

  describe('Data Validation', () => {
    it('should handle null data prop', () => {
      const { container } = render(
        <MailingAddressPage
          goForward={mockGoForward}
          data={null}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle undefined data prop', () => {
      const { container } = render(
        <MailingAddressPage
          goForward={mockGoForward}
          data={undefined}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle array data prop', () => {
      const { container } = render(
        <MailingAddressPage
          goForward={mockGoForward}
          data={[]}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle function data prop', () => {
      const { container } = render(
        <MailingAddressPage
          goForward={mockGoForward}
          data={() => {}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });
  });

  describe('Military Address', () => {
    it('should render with military address data', () => {
      const militaryData = {
        recipientAddress: {
          street: 'Death Star Command',
          street2: 'Level 1138',
          street3: 'Section B',
          city: 'APO',
          state: 'AE',
          country: 'USA',
          postalCode: '09012',
          isMilitary: true,
        },
      };

      const { container } = render(
        <MailingAddressPage
          goForward={mockGoForward}
          data={militaryData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });
  });

  describe('Default Data', () => {
    it('should use default data when no data provided', () => {
      const { container } = render(
        <MailingAddressPage
          goForward={mockGoForward}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });
  });

  describe('Address Components', () => {
    it('should handle address with street3', () => {
      const addressWithStreet3 = {
        recipientAddress: {
          street: 'Jedi Temple',
          street2: 'Council Chamber',
          street3: 'Upper Level',
          city: 'Coruscant',
          state: 'DC',
          country: 'USA',
          postalCode: '20001',
          isMilitary: false,
        },
      };

      const { container } = render(
        <MailingAddressPage
          goForward={mockGoForward}
          data={addressWithStreet3}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle minimal address data', () => {
      const minimalAddress = {
        recipientAddress: {
          street: 'Tatooine',
          city: 'Mos Eisley',
          state: 'AZ',
          country: 'USA',
          postalCode: '85001',
        },
      };

      const { container } = render(
        <MailingAddressPage
          goForward={mockGoForward}
          data={minimalAddress}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });
  });
});
