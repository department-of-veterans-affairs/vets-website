/**
 * @module tests/pages/hospitalization.unit.spec
 * @description Unit tests for HospitalizationPage component
 */

import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { HospitalizationPage } from './hospitalization';

describe('HospitalizationPage', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Component Initialization', () => {
    it('should handle undefined data prop', () => {
      const { container } = render(
        <HospitalizationPage
          data={undefined}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle function as data prop', () => {
      const { container } = render(
        <HospitalizationPage
          data={() => ({})}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle string as data prop', () => {
      const { container } = render(
        <HospitalizationPage
          data="invalid"
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle number as data prop', () => {
      const { container } = render(
        <HospitalizationPage
          data={123}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle boolean as data prop', () => {
      const { container } = render(
        <HospitalizationPage
          data
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );
      expect(container).to.exist;
    });
  });

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <HospitalizationPage
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
        <HospitalizationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include('Hospitalization information');
    });

    it('should render instruction text', () => {
      const { container } = render(
        <HospitalizationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'Provide details about current hospitalization or nursing home care',
      );
    });

    it('should render hospitalization status radio buttons', () => {
      const { container } = render(
        <HospitalizationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector(
        'va-radio[name="isCurrentlyHospitalized"]',
      );
      expect(radioGroup).to.exist;
      expect(radioGroup.getAttribute('label')).to.include(
        'currently hospitalized',
      );
      expect(radioGroup.hasAttribute('required')).to.be.true;
    });

    it('should render radio options for hospitalization status', () => {
      const { container } = render(
        <HospitalizationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const yesOption = container.querySelector(
        'va-radio-option[label="Yes"][value="yes"]',
      );
      const noOption = container.querySelector(
        'va-radio-option[label="No"][value="no"]',
      );
      expect(yesOption).to.exist;
      expect(noOption).to.exist;
    });

    it('should render continue and back buttons', () => {
      const { container } = render(
        <HospitalizationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );
      const backButton = container.querySelector('va-button[text="Back"]');
      expect(continueButton).to.exist;
      expect(backButton).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should display hospitalization status as yes', () => {
      const data = {
        hospitalization: {
          isCurrentlyHospitalized: 'yes',
        },
      };

      const { container } = render(
        <HospitalizationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector(
        'va-radio[name="isCurrentlyHospitalized"]',
      );
      expect(radioGroup.getAttribute('value')).to.equal('yes');
    });

    it('should display hospitalization status as no', () => {
      const data = {
        hospitalization: {
          isCurrentlyHospitalized: 'no',
        },
      };

      const { container } = render(
        <HospitalizationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const radioGroup = container.querySelector(
        'va-radio[name="isCurrentlyHospitalized"]',
      );
      expect(radioGroup.getAttribute('value')).to.equal('no');
    });

    it('should display admission date', async () => {
      const data = {
        hospitalization: {
          isCurrentlyHospitalized: 'yes',
          admissionDate: '2024-01-15',
        },
      };

      const { container } = render(
        <HospitalizationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(() => {
        const dateField = container.querySelector(
          'va-memorable-date[name="admissionDate"]',
        );
        expect(dateField).to.exist;
        expect(dateField.getAttribute('value')).to.equal('2024-01-15');
      });
    });

    it('should display facility name', () => {
      const data = {
        hospitalization: {
          isCurrentlyHospitalized: 'yes',
          facilityName: 'VA Medical Center',
        },
      };

      const { container } = render(
        <HospitalizationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const facilityInput = container.querySelector(
        'va-text-input[name="facilityName"]',
      );
      expect(facilityInput).to.exist;
      expect(facilityInput.getAttribute('value')).to.equal('VA Medical Center');
    });

    it('should display facility address', () => {
      const data = {
        hospitalization: {
          isCurrentlyHospitalized: 'yes',
          facilityStreetAddress: '123 Main St',
          facilityCity: 'Washington',
          facilityState: 'DC',
          facilityZip: '20001',
        },
      };

      const { container } = render(
        <HospitalizationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const streetInput = container.querySelector(
        'va-text-input[label="Street address"]',
      );
      const cityInput = container.querySelector('va-text-input[label="City"]');
      const stateSelect = container.querySelector('va-select[label="State"]');
      const zipInput = container.querySelector(
        'va-text-input[label="ZIP code"]',
      );

      expect(streetInput).to.exist;
      expect(cityInput).to.exist;
      expect(stateSelect).to.exist;
      expect(zipInput).to.exist;
    });

    it('should handle empty data', () => {
      const { container } = render(
        <HospitalizationPage
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
        <HospitalizationPage
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-radio')).to.exist;
    });

    it('should handle undefined data prop', () => {
      const { container } = render(
        <HospitalizationPage
          data={undefined}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-radio')).to.exist;
    });

    it('should handle array data prop', () => {
      const { container } = render(
        <HospitalizationPage
          data={[]}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-radio')).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode', () => {
      const data = {
        hospitalization: {
          isCurrentlyHospitalized: 'no',
        },
      };

      const { container } = render(
        <HospitalizationPage
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

    it('should show save button instead of continue in review mode', () => {
      const { container } = render(
        <HospitalizationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
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

  describe('Conditional Fields', () => {
    it('should show facility fields when isCurrentlyHospitalized is yes', () => {
      const data = {
        hospitalization: {
          isCurrentlyHospitalized: 'yes',
        },
      };

      const { container } = render(
        <HospitalizationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const admissionDateField = container.querySelector(
        'va-memorable-date[name="admissionDate"]',
      );
      const facilityNameField = container.querySelector(
        'va-text-input[name="facilityName"]',
      );
      expect(admissionDateField).to.exist;
      expect(facilityNameField).to.exist;
      expect(admissionDateField.hasAttribute('required')).to.be.true;
      expect(facilityNameField.hasAttribute('required')).to.be.true;
    });

    it('should not show facility fields when isCurrentlyHospitalized is no', () => {
      const data = {
        hospitalization: {
          isCurrentlyHospitalized: 'no',
        },
      };

      const { container } = render(
        <HospitalizationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const admissionDateField = container.querySelector(
        'va-memorable-date[name="admissionDate"]',
      );
      const facilityNameField = container.querySelector(
        'va-text-input[name="facilityName"]',
      );
      expect(admissionDateField).to.not.exist;
      expect(facilityNameField).to.not.exist;
    });

    it('should not show facility fields when isCurrentlyHospitalized is empty', () => {
      const data = {
        hospitalization: {
          isCurrentlyHospitalized: '',
        },
      };

      const { container } = render(
        <HospitalizationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const admissionDateField = container.querySelector(
        'va-memorable-date[name="admissionDate"]',
      );
      const facilityNameField = container.querySelector(
        'va-text-input[name="facilityName"]',
      );
      expect(admissionDateField).to.not.exist;
      expect(facilityNameField).to.not.exist;
    });

    it('should show all address fields when hospitalized', () => {
      const data = {
        hospitalization: {
          isCurrentlyHospitalized: 'yes',
        },
      };

      const { container } = render(
        <HospitalizationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const streetInput = container.querySelector(
        'va-text-input[label="Street address"]',
      );
      const cityInput = container.querySelector('va-text-input[label="City"]');
      const stateSelect = container.querySelector('va-select[label="State"]');
      const zipInput = container.querySelector(
        'va-text-input[label="ZIP code"]',
      );

      expect(streetInput).to.exist;
      expect(cityInput).to.exist;
      expect(stateSelect).to.exist;
      expect(zipInput).to.exist;
    });

    it('should render with various field values populated', () => {
      const data = {
        hospitalization: {
          isCurrentlyHospitalized: 'yes',
          admissionDate: '2024-01-01',
          facilityName: 'General Hospital',
          facilityStreetAddress: '456 Hospital Way',
          facilityCity: 'Boston',
          facilityState: 'MA',
          facilityZip: '02101',
        },
      };

      const { container } = render(
        <HospitalizationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
      const facilityNameField = container.querySelector(
        'va-text-input[name="facilityName"]',
      );
      expect(facilityNameField.getAttribute('value')).to.equal(
        'General Hospital',
      );
    });
  });

  describe('Component Props', () => {
    it('should render without optional props', () => {
      const { container } = render(
        <HospitalizationPage goForward={mockGoForward} />,
      );

      expect(container).to.exist;
    });

    it('should render with all props', () => {
      const data = {
        hospitalization: {
          isCurrentlyHospitalized: 'yes',
          admissionDate: '2024-02-14',
          facilityName: 'VA Hospital',
          facilityStreetAddress: '789 VA Street',
          facilityCity: 'San Francisco',
          facilityState: 'CA',
          facilityZip: '94102',
        },
      };

      const { container } = render(
        <HospitalizationPage
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

  describe('Data Processing', () => {
    it('should handle full facility information', () => {
      const data = {
        hospitalization: {
          isCurrentlyHospitalized: 'yes',
          admissionDate: '2023-12-01',
          facilityName: 'Veterans Affairs Medical Center',
          facilityStreetAddress: '1234 VA Boulevard',
          facilityCity: 'Los Angeles',
          facilityState: 'CA',
          facilityZip: '90001',
        },
      };

      const { container } = render(
        <HospitalizationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const facilityNameField = container.querySelector(
        'va-text-input[name="facilityName"]',
      );
      expect(facilityNameField.getAttribute('value')).to.equal(
        'Veterans Affairs Medical Center',
      );

      const streetInput = container.querySelector(
        'va-text-input[label="Street address"]',
      );
      expect(streetInput.getAttribute('value')).to.equal('1234 VA Boulevard');
    });

    it('should handle partial facility information', () => {
      const data = {
        hospitalization: {
          isCurrentlyHospitalized: 'yes',
          facilityName: 'Community Hospital',
          facilityCity: 'Seattle',
        },
      };

      const { container } = render(
        <HospitalizationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const facilityNameField = container.querySelector(
        'va-text-input[name="facilityName"]',
      );
      expect(facilityNameField.getAttribute('value')).to.equal(
        'Community Hospital',
      );

      const cityInput = container.querySelector('va-text-input[label="City"]');
      expect(cityInput.getAttribute('value')).to.equal('Seattle');
    });

    it('should handle nursing home scenario', () => {
      const data = {
        hospitalization: {
          isCurrentlyHospitalized: 'yes',
          admissionDate: '2023-06-15',
          facilityName: 'Sunset Nursing Home',
          facilityStreetAddress: '999 Care Drive',
          facilityCity: 'Phoenix',
          facilityState: 'AZ',
          facilityZip: '85001',
        },
      };

      const { container } = render(
        <HospitalizationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const facilityNameField = container.querySelector(
        'va-text-input[name="facilityName"]',
      );
      expect(facilityNameField.getAttribute('value')).to.equal(
        'Sunset Nursing Home',
      );
    });
  });
});
