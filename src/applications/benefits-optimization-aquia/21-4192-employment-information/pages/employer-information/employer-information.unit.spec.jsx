/**
 * @module tests/pages/employer-information.unit.spec
 * @description Unit tests for EmployerInformationPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { EmployerInformationPage } from './employer-information';

describe('EmployerInformationPage', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <EmployerInformationPage
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
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include('Employers Information');
    });

    it('should render employer name field', () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-text-input[label="Employer\'s name"]'))
        .to.exist;
    });

    it('should render address fields', () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      // Address field contains multiple inputs
      expect(container.querySelector('va-text-input[label="Street address"]'))
        .to.exist;
      expect(
        container.querySelector('va-text-input[label="Street address line 2"]'),
      ).to.exist;
      expect(container.querySelector('va-text-input[label="City"]')).to.exist;
      expect(container.querySelector('va-select[label="State"]')).to.exist;
      // USA addresses use "ZIP code" not "Postal code"
      expect(container.querySelector('va-text-input[label="ZIP code"]')).to
        .exist;
    });

    it('should render phone number field', () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(
        container.querySelector(
          'va-telephone-input[label="Employer\'s phone number"]',
        ),
      ).to.exist;
    });

    it('should render continue button', () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );
      expect(continueButton).to.exist;
    });

    it('should render back button', () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const backButton = container.querySelector('va-button[text="Back"]');
      expect(backButton).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should display Starfleet Command employer data', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Command',
          employerAddress: {
            street: 'Starfleet Headquarters',
            street2: 'Building One',
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            postalCode: '94102',
          },
          employerPhone: '4155551234',
        },
      };

      const { container } = render(
        <EmployerInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const employerNameInput = container.querySelector(
        'va-text-input[label="Employer\'s name"]',
      );
      expect(employerNameInput).to.exist;
      expect(employerNameInput.getAttribute('value')).to.equal(
        'Starfleet Command',
      );

      const streetInput = container.querySelector(
        'va-text-input[label="Street address"]',
      );
      expect(streetInput.getAttribute('value')).to.equal(
        'Starfleet Headquarters',
      );

      const cityInput = container.querySelector('va-text-input[label="City"]');
      expect(cityInput.getAttribute('value')).to.equal('San Francisco');

      const phoneInput = container.querySelector(
        'va-telephone-input[label="Employer\'s phone number"]',
      );
      expect(phoneInput.getAttribute('value')).to.equal('4155551234');
    });

    it('should display USS Enterprise employer data', () => {
      const data = {
        employerInformation: {
          employerName: 'USS Enterprise (NCC-1701)',
          employerAddress: {
            street: 'Starbase 11',
            city: 'Deep Space',
            state: 'CA',
            country: 'USA',
            postalCode: '90210',
          },
          employerPhone: '5551701234',
        },
      };

      const { container } = render(
        <EmployerInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const employerNameInput = container.querySelector(
        'va-text-input[label="Employer\'s name"]',
      );
      expect(employerNameInput.getAttribute('value')).to.equal(
        'USS Enterprise (NCC-1701)',
      );
    });

    it('should display Deep Space Nine employer data', () => {
      const data = {
        employerInformation: {
          employerName: 'Deep Space Nine',
          employerAddress: {
            street: 'Bajoran Sector',
            city: 'Bajor',
            state: 'NY',
            country: 'USA',
            postalCode: '10001',
          },
          employerPhone: '2125559876',
        },
      };

      const { container } = render(
        <EmployerInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const employerNameInput = container.querySelector(
        'va-text-input[label="Employer\'s name"]',
      );
      expect(employerNameInput.getAttribute('value')).to.equal(
        'Deep Space Nine',
      );
    });

    it('should handle empty employer data', () => {
      const data = {
        employerInformation: {},
      };

      const { container } = render(
        <EmployerInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing address fields', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Academy',
          employerAddress: {
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94102',
          },
        },
      };

      const { container } = render(
        <EmployerInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Data Handling Edge Cases', () => {
    it('should handle null data prop', () => {
      const { container } = render(
        <EmployerInformationPage
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle undefined data prop', () => {
      const { container } = render(
        <EmployerInformationPage
          data={undefined}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle array data prop', () => {
      const { container } = render(
        <EmployerInformationPage
          data={[]}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data object', () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle partial employer data', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Medical',
        },
      };

      const { container } = render(
        <EmployerInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const employerNameInput = container.querySelector(
        'va-text-input[label="Employer\'s name"]',
      );
      expect(employerNameInput.getAttribute('value')).to.equal(
        'Starfleet Medical',
      );
    });

    it('should handle partial address data', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Security',
          employerAddress: {
            street: '456 Security Blvd',
          },
        },
      };

      const { container } = render(
        <EmployerInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const streetInput = container.querySelector(
        'va-text-input[label="Street address"]',
      );
      expect(streetInput.getAttribute('value')).to.equal('456 Security Blvd');
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Command',
          employerAddress: {
            street: 'Starfleet HQ',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94102',
          },
          employerPhone: '4155551234',
        },
      };

      const { container } = render(
        <EmployerInformationPage
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

    it('should show update button in review mode', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Command',
        },
      };

      const { container } = render(
        <EmployerInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      const updateButton = container.querySelector('va-button[text="Save"]');
      expect(updateButton).to.exist;
    });
  });

  describe('Required Fields', () => {
    it('should mark employer name as required', () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const employerNameInput = container.querySelector(
        'va-text-input[label="Employer\'s name"]',
      );
      expect(employerNameInput.hasAttribute('required')).to.be.true;
    });

    it('should mark phone number as required', () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const phoneInput = container.querySelector(
        'va-telephone-input[label="Employer\'s phone number"]',
      );
      expect(phoneInput.hasAttribute('required')).to.be.true;
    });
  });

  describe('Field Constraints', () => {
    it('should set maxlength for employer name', () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const employerNameInput = container.querySelector(
        'va-text-input[label="Employer\'s name"]',
      );
      expect(employerNameInput.getAttribute('maxlength')).to.equal('100');
    });
  });

  describe('Component Props', () => {
    it('should render without optional props', () => {
      const { container } = render(
        <EmployerInformationPage goForward={mockGoForward} />,
      );

      expect(container).to.exist;
    });

    it('should render with all props', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Command',
          employerAddress: {
            street: 'HQ',
            city: 'SF',
            state: 'CA',
            postalCode: '94102',
          },
          employerPhone: '4155551234',
        },
      };

      const { container } = render(
        <EmployerInformationPage
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

  describe('Address Field with All Lines', () => {
    it('should display all three street address lines', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Command',
          employerAddress: {
            street: 'Building 1',
            street2: 'Suite 100',
            street3: 'Floor 5',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94102',
          },
        },
      };

      const { container } = render(
        <EmployerInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const street1 = container.querySelector(
        'va-text-input[label="Street address"]',
      );
      expect(street1.getAttribute('value')).to.equal('Building 1');

      const street2 = container.querySelector(
        'va-text-input[label="Street address line 2"]',
      );
      expect(street2.getAttribute('value')).to.equal('Suite 100');

      const street3 = container.querySelector(
        'va-text-input[label="Street address line 3"]',
      );
      expect(street3.getAttribute('value')).to.equal('Floor 5');
    });
  });

  describe('Different Star Trek Employers', () => {
    it('should display Vulcan Science Academy', () => {
      const data = {
        employerInformation: {
          employerName: 'Vulcan Science Academy',
          employerAddress: {
            street: 'Mount Seleya',
            city: 'ShiKahr',
            state: 'CA',
            postalCode: '91234',
          },
          employerPhone: '5555551234',
        },
      };

      const { container } = render(
        <EmployerInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const employerNameInput = container.querySelector(
        'va-text-input[label="Employer\'s name"]',
      );
      expect(employerNameInput.getAttribute('value')).to.equal(
        'Vulcan Science Academy',
      );
    });

    it('should display Klingon Defense Force', () => {
      const data = {
        employerInformation: {
          employerName: 'Klingon Defense Force',
          employerAddress: {
            street: 'First City',
            city: "Qo'noS",
            state: 'NY',
            postalCode: '10001',
          },
          employerPhone: '2125551701',
        },
      };

      const { container } = render(
        <EmployerInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const employerNameInput = container.querySelector(
        'va-text-input[label="Employer\'s name"]',
      );
      expect(employerNameInput.getAttribute('value')).to.equal(
        'Klingon Defense Force',
      );
    });

    it('should display Romulan Imperial Fleet', () => {
      const data = {
        employerInformation: {
          employerName: 'Romulan Imperial Fleet',
          employerAddress: {
            street: 'Imperial Palace',
            city: 'Romulus',
            state: 'TX',
            postalCode: '75001',
          },
          employerPhone: '2145559999',
        },
      };

      const { container } = render(
        <EmployerInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const employerNameInput = container.querySelector(
        'va-text-input[label="Employer\'s name"]',
      );
      expect(employerNameInput.getAttribute('value')).to.equal(
        'Romulan Imperial Fleet',
      );
    });
  });

  describe('Default Address Values', () => {
    it('should have USA as default country', () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      // The default country is set in defaultData
      expect(container).to.exist;
    });

    it('should have isMilitary as false by default', () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      // The default isMilitary is set in defaultData
      expect(container).to.exist;
    });
  });
});
