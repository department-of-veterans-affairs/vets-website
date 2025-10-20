/**
 * @module tests/pages/examiner-identification.unit.spec
 * @description Unit tests for ExaminerIdentificationPage component
 */

import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { ExaminerIdentificationPage } from './examiner-identification';

describe('Medical Examiner Identification Form', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Form Initialization', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ExaminerIdentificationPage
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
        <ExaminerIdentificationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include('Medical examiner information');
    });

    it('should render medical professional notice', () => {
      const { container } = render(
        <ExaminerIdentificationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'For medical professionals only',
      );
    });

    it('should render instruction text', () => {
      const { container } = render(
        <ExaminerIdentificationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include(
        'Please provide your professional information for this examination',
      );
    });
  });

  describe('Data Display', () => {
    it('should display examiner information', () => {
      const data = {
        examinerIdentification: {
          examinerName: 'Dr. Kalani',
          examinerTitle: 'md',
        },
      };

      const { container } = render(
        <ExaminerIdentificationPage
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
        <ExaminerIdentificationPage
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
        <ExaminerIdentificationPage
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle array data prop', () => {
      const { container } = render(
        <ExaminerIdentificationPage
          data={[]}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle function data prop', () => {
      const { container } = render(
        <ExaminerIdentificationPage
          data={() => {}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle string data prop', () => {
      const { container } = render(
        <ExaminerIdentificationPage
          data="invalid"
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle undefined data prop', () => {
      const { container } = render(
        <ExaminerIdentificationPage
          data={undefined}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle number data prop', () => {
      const { container } = render(
        <ExaminerIdentificationPage
          data={123}
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
        examinerIdentification: {
          examinerName: 'Dr. Kalani',
          examinerTitle: 'md',
          examinerNPI: '5019328476',
        },
      };

      const { container } = render(
        <ExaminerIdentificationPage
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

  describe('Field Rendering', () => {
    it('should render examiner name field', () => {
      const { container } = render(
        <ExaminerIdentificationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const nameInput = container.querySelector(
        'va-text-input[name="examinerName"]',
      );
      expect(nameInput).to.exist;
      expect(nameInput.getAttribute('label')).to.include(
        "Examiner's full name",
      );
      expect(nameInput.hasAttribute('required')).to.be.true;
    });

    it('should render examiner title select field', () => {
      const { container } = render(
        <ExaminerIdentificationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const titleSelect = container.querySelector(
        'va-select[name="examinerTitle"]',
      );
      expect(titleSelect).to.exist;
      expect(titleSelect.getAttribute('label')).to.include(
        'Professional title',
      );
      expect(titleSelect.hasAttribute('required')).to.be.true;
    });

    it('should render NPI input field', () => {
      const { container } = render(
        <ExaminerIdentificationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const npiInput = container.querySelector(
        'va-text-input[name="examinerNPI"]',
      );
      expect(npiInput).to.exist;
      expect(npiInput.getAttribute('label')).to.include('NPI');
      expect(npiInput.hasAttribute('required')).to.be.true;
    });

    it('should render phone number field', async () => {
      const { container } = render(
        <ExaminerIdentificationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(() => {
        const phoneInput = container.querySelector(
          'va-telephone-input[label="Office phone number"]',
        );
        expect(phoneInput).to.exist;
        expect(phoneInput.hasAttribute('required')).to.be.true;
      });
    });

    it('should render facility name field', () => {
      const { container } = render(
        <ExaminerIdentificationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const facilityInput = container.querySelector(
        'va-text-input[name="facilityPracticeName"]',
      );
      expect(facilityInput).to.exist;
      expect(facilityInput.getAttribute('label')).to.include(
        'Facility/Practice name',
      );
      expect(facilityInput.hasAttribute('required')).to.be.true;
    });

    it('should render all address fields', () => {
      const { container } = render(
        <ExaminerIdentificationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const streetInput = container.querySelector(
        'va-text-input[name="examinerAddress.street"]',
      );
      const unitInput = container.querySelector(
        'va-text-input[name="examinerAddress.street2"]',
      );
      const cityInput = container.querySelector(
        'va-text-input[name="examinerAddress.city"]',
      );
      const stateSelect = container.querySelector(
        'va-select[name="examinerAddress.state"]',
      );
      const zipInput = container.querySelector(
        'va-text-input[name="examinerAddress.postalCode"]',
      );

      expect(streetInput).to.exist;
      expect(unitInput).to.exist;
      expect(cityInput).to.exist;
      expect(stateSelect).to.exist;
      expect(zipInput).to.exist;
    });

    it('should render continue and back buttons', () => {
      const { container } = render(
        <ExaminerIdentificationPage
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

    it('should display examiner name value', () => {
      const data = {
        examinerIdentification: {
          examinerName: 'Dr. Nala Se Kalani',
        },
      };

      const { container } = render(
        <ExaminerIdentificationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const nameInput = container.querySelector(
        'va-text-input[name="examinerName"]',
      );
      expect(nameInput.getAttribute('value')).to.equal('Dr. Nala Se Kalani');
    });

    it('should display examiner title value', () => {
      const data = {
        examinerIdentification: {
          examinerTitle: 'do',
        },
      };

      const { container } = render(
        <ExaminerIdentificationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const titleSelect = container.querySelector(
        'va-select[name="examinerTitle"]',
      );
      expect(titleSelect.getAttribute('value')).to.equal('do');
    });

    it('should display NPI value', () => {
      const data = {
        examinerIdentification: {
          examinerNPI: '9876543210',
        },
      };

      const { container } = render(
        <ExaminerIdentificationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const npiInput = container.querySelector(
        'va-text-input[name="examinerNPI"]',
      );
      expect(npiInput.getAttribute('value')).to.equal('9876543210');
    });

    it('should display phone number value', () => {
      const data = {
        examinerIdentification: {
          examinerPhone: '415-555-0501',
        },
      };

      const { container } = render(
        <ExaminerIdentificationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const phoneInput = container.querySelector('va-telephone-input');
      expect(phoneInput.getAttribute('value')).to.equal('415-555-0501');
    });

    it('should display facility name value', () => {
      const data = {
        examinerIdentification: {
          facilityPracticeName: 'Kamino Medical Research Center',
        },
      };

      const { container } = render(
        <ExaminerIdentificationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const facilityInput = container.querySelector(
        'va-text-input[name="facilityPracticeName"]',
      );
      expect(facilityInput.getAttribute('value')).to.equal(
        'Kamino Medical Research Center',
      );
    });

    it('should display address field values', () => {
      const data = {
        examinerIdentification: {
          examinerStreetAddress: '1138 Clone Research Facility',
          examinerUnitNumber: 'Wing Delta',
          examinerCity: 'Tipoca City',
          examinerState: 'CA',
          examinerZip: '94111',
        },
      };

      const { container } = render(
        <ExaminerIdentificationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const streetInput = container.querySelector(
        'va-text-input[name="examinerAddress.street"]',
      );
      const unitInput = container.querySelector(
        'va-text-input[name="examinerAddress.street2"]',
      );
      const cityInput = container.querySelector(
        'va-text-input[name="examinerAddress.city"]',
      );
      const stateSelect = container.querySelector(
        'va-select[name="examinerAddress.state"]',
      );
      const zipInput = container.querySelector(
        'va-text-input[name="examinerAddress.postalCode"]',
      );

      expect(streetInput.getAttribute('value')).to.equal(
        '1138 Clone Research Facility',
      );
      expect(unitInput.getAttribute('value')).to.equal('Wing Delta');
      expect(cityInput.getAttribute('value')).to.equal('Tipoca City');
      expect(stateSelect.getAttribute('value')).to.equal('CA');
      expect(zipInput.getAttribute('value')).to.equal('94111');
    });

    it('should render with various professional titles', () => {
      const titles = ['md', 'do', 'pa', 'aprn', 'np', 'cns'];

      titles.forEach(title => {
        const data = {
          examinerIdentification: {
            examinerTitle: title,
          },
        };

        const { container } = render(
          <ExaminerIdentificationPage
            data={data}
            setFormData={mockSetFormData}
            goForward={mockGoForward}
            goBack={mockGoBack}
          />,
        );

        const titleSelect = container.querySelector(
          'va-select[name="examinerTitle"]',
        );
        expect(titleSelect.getAttribute('value')).to.equal(title);
      });
    });

    it('should render with complete examiner information', () => {
      const data = {
        examinerIdentification: {
          examinerName: 'Dr. Nala Se Kalani',
          examinerTitle: 'md',
          examinerNPI: '5019328476',
          examinerPhone: '415-555-0501',
          facilityPracticeName: 'Kamino Medical Research Center',
          examinerStreetAddress: '1138 Clone Research Facility',
          examinerUnitNumber: 'Wing Delta',
          examinerCity: 'Tipoca City',
          examinerState: 'CA',
          examinerZip: '94111',
        },
      };

      const { container } = render(
        <ExaminerIdentificationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
      const nameInput = container.querySelector(
        'va-text-input[name="examinerName"]',
      );
      const titleSelect = container.querySelector(
        'va-select[name="examinerTitle"]',
      );
      const npiInput = container.querySelector(
        'va-text-input[name="examinerNPI"]',
      );
      expect(nameInput.getAttribute('value')).to.equal('Dr. Nala Se Kalani');
      expect(titleSelect.getAttribute('value')).to.equal('md');
      expect(npiInput.getAttribute('value')).to.equal('5019328476');
    });
  });

  describe('Component Props', () => {
    it('should render without optional props', () => {
      const { container } = render(
        <ExaminerIdentificationPage goForward={mockGoForward} />,
      );

      expect(container).to.exist;
    });

    it('should render with all props', () => {
      const data = {
        examinerIdentification: {
          examinerName: 'Dr. Test',
          examinerTitle: 'md',
        },
      };

      const { container } = render(
        <ExaminerIdentificationPage
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
        <ExaminerIdentificationPage
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
});
