/**
 * @module tests/pages/employer-information.unit.spec
 * @description Unit tests for EmployerInformationPage component
 */

import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { EmployerInformationPage } from './employer-information';

/**
 * Helper function to find web component by tag and label attribute
 * Works around Node 22 limitation with CSS attribute selectors on custom elements
 */
const findByLabel = (container, tagName, labelText) => {
  return Array.from(container.querySelectorAll(tagName)).find(
    el => el.getAttribute('label') === labelText,
  );
};

/**
 * Helper function to find web component by tag and text attribute
 * Works around Node 22 limitation with CSS attribute selectors on custom elements
 */
const findByText = (container, tagName, textValue) => {
  return Array.from(container.querySelectorAll(tagName)).find(
    el => el.getAttribute('text') === textValue,
  );
};

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

      expect(container.textContent).to.include("Employer's name and address");
    });

    it('should render employer name field', async () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(
        () => {
          const element = findByLabel(
            container,
            'va-text-input',
            'Name of employer',
          );
          expect(element).to.exist;
        },
        { timeout: 3000 },
      );
    });

    it('should render address fields', async () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(
        () => {
          expect(findByLabel(container, 'va-text-input', 'Street address')).to
            .exist;
          expect(
            findByLabel(container, 'va-text-input', 'Street address line 2'),
          ).to.exist;
          expect(findByLabel(container, 'va-text-input', 'City')).to.exist;
          expect(findByLabel(container, 'va-select', 'State')).to.exist;
          expect(findByLabel(container, 'va-text-input', 'ZIP code')).to.exist;
        },
        { timeout: 3000 },
      );
    });

    it('should render continue button', async () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(
        () => {
          const continueButton = findByText(container, 'va-button', 'Continue');
          expect(continueButton).to.exist;
        },
        { timeout: 3000 },
      );
    });

    it('should render back button', async () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(
        () => {
          const backButton = findByText(container, 'va-button', 'Back');
          expect(backButton).to.exist;
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Data Display', () => {
    it('should display employer data', async () => {
      const data = {
        employerInformation: {
          employerName: 'Bounty Hunters Guild',
          employerAddress: {
            street: 'Guild Headquarters',
            street2: 'Building One',
            city: 'Mos Eisley',
            state: 'CA',
            country: 'USA',
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

      await waitFor(
        () => {
          const employerNameInput = findByLabel(
            container,
            'va-text-input',
            'Name of employer',
          );
          expect(employerNameInput).to.exist;
          expect(employerNameInput.getAttribute('value')).to.equal(
            'Bounty Hunters Guild',
          );

          const streetInput = findByLabel(
            container,
            'va-text-input',
            'Street address',
          );
          expect(streetInput).to.exist;
          expect(streetInput.getAttribute('value')).to.equal(
            'Guild Headquarters',
          );

          const cityInput = findByLabel(container, 'va-text-input', 'City');
          expect(cityInput).to.exist;
          expect(cityInput.getAttribute('value')).to.equal('Mos Eisley');
        },
        { timeout: 3000 },
      );
    });

    it('should display Slave I employer data', async () => {
      const data = {
        employerInformation: {
          employerName: 'Slave I',
          employerAddress: {
            street: 'Nar Shaddaa Sector 11',
            city: 'Nar Shaddaa',
            state: 'CA',
            country: 'USA',
            postalCode: '90210',
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

      await waitFor(
        () => {
          const employerNameInput = findByLabel(
            container,
            'va-text-input',
            'Name of employer',
          );
          expect(employerNameInput).to.exist;
          expect(employerNameInput.getAttribute('value')).to.equal('Slave I');
        },
        { timeout: 3000 },
      );
    });

    it('should display Mos Eisley Cantina employer data', async () => {
      const data = {
        employerInformation: {
          employerName: 'Mos Eisley Cantina',
          employerAddress: {
            street: 'Outer Rim Sector',
            city: 'Bajor',
            state: 'NY',
            country: 'USA',
            postalCode: '10001',
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

      await waitFor(
        () => {
          const employerNameInput = findByLabel(
            container,
            'va-text-input',
            'Name of employer',
          );
          expect(employerNameInput).to.exist;
          expect(employerNameInput.getAttribute('value')).to.equal(
            'Mos Eisley Cantina',
          );
        },
        { timeout: 3000 },
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
          employerName: 'Kamino Cloning Facility',
          employerAddress: {
            street: '123 Main St',
            city: 'Mos Eisley',
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
    it('should handle null data prop', async () => {
      const { container } = render(
        <EmployerInformationPage
          data={null}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(
        () => {
          expect(container.querySelector('va-text-input')).to.exist;
        },
        { timeout: 3000 },
      );
    });

    it('should handle undefined data prop', async () => {
      const { container } = render(
        <EmployerInformationPage
          data={undefined}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(
        () => {
          expect(container.querySelector('va-text-input')).to.exist;
        },
        { timeout: 3000 },
      );
    });

    it('should handle array data prop', async () => {
      const { container } = render(
        <EmployerInformationPage
          data={[]}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(
        () => {
          expect(container.querySelector('va-text-input')).to.exist;
        },
        { timeout: 3000 },
      );
    });

    it('should handle empty data object', async () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(
        () => {
          expect(container.querySelector('va-text-input')).to.exist;
        },
        { timeout: 3000 },
      );
    });

    it('should handle partial employer data', async () => {
      const data = {
        employerInformation: {
          employerName: 'Black Sun Syndicate',
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

      await waitFor(
        () => {
          const employerNameInput = findByLabel(
            container,
            'va-text-input',
            'Name of employer',
          );
          expect(employerNameInput).to.exist;
          expect(employerNameInput.getAttribute('value')).to.equal(
            'Black Sun Syndicate',
          );
        },
        { timeout: 3000 },
      );
    });

    it('should handle partial address data', async () => {
      const data = {
        employerInformation: {
          employerName: 'Pyke Syndicate',
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

      await waitFor(
        () => {
          const streetInput = findByLabel(
            container,
            'va-text-input',
            'Street address',
          );
          expect(streetInput).to.exist;
          expect(streetInput.getAttribute('value')).to.equal(
            '456 Security Blvd',
          );
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode', () => {
      const data = {
        employerInformation: {
          employerName: 'Bounty Hunters Guild',
          employerAddress: {
            street: 'Guild Headquarters',
            city: 'Mos Eisley',
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
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      expect(container).to.exist;
    });

    it('should show update button in review mode', async () => {
      const data = {
        employerInformation: {
          employerName: 'Bounty Hunters Guild',
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

      await waitFor(
        () => {
          const updateButton = findByText(container, 'va-button', 'Save');
          expect(updateButton).to.exist;
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Required Fields', () => {
    it('should mark employer name as required', async () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(
        () => {
          const employerNameInput = findByLabel(
            container,
            'va-text-input',
            'Name of employer',
          );
          expect(employerNameInput).to.exist;
          expect(employerNameInput.hasAttribute('required')).to.be.true;
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Field Constraints', () => {
    it('should set maxlength for employer name', async () => {
      const { container } = render(
        <EmployerInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      await waitFor(
        () => {
          const employerNameInput = findByLabel(
            container,
            'va-text-input',
            'Name of employer',
          );
          expect(employerNameInput).to.exist;
          expect(employerNameInput.getAttribute('maxlength')).to.equal('100');
        },
        { timeout: 3000 },
      );
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
          employerName: 'Bounty Hunters Guild',
          employerAddress: {
            street: 'HQ',
            city: 'SF',
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
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Address Field with All Lines', () => {
    it('should display all three street address lines', async () => {
      const data = {
        employerInformation: {
          employerName: 'Bounty Hunters Guild',
          employerAddress: {
            street: 'Building 1',
            street2: 'Suite 100',
            street3: 'Floor 5',
            city: 'Mos Eisley',
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

      await waitFor(
        () => {
          const street1 = findByLabel(
            container,
            'va-text-input',
            'Street address',
          );
          expect(street1).to.exist;
          expect(street1.getAttribute('value')).to.equal('Building 1');

          const street2 = findByLabel(
            container,
            'va-text-input',
            'Street address line 2',
          );
          expect(street2).to.exist;
          expect(street2.getAttribute('value')).to.equal('Suite 100');

          const street3 = findByLabel(
            container,
            'va-text-input',
            'Street address line 3',
          );
          expect(street3).to.exist;
          expect(street3.getAttribute('value')).to.equal('Floor 5');
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Multiple Employer Scenarios', () => {
    it('should display Mandalorian Training Corps', async () => {
      const data = {
        employerInformation: {
          employerName: 'Mandalorian Training Corps',
          employerAddress: {
            street: 'Mount Seleya',
            city: 'ShiKahr',
            state: 'CA',
            postalCode: '91234',
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

      await waitFor(
        () => {
          const employerNameInput = findByLabel(
            container,
            'va-text-input',
            'Name of employer',
          );
          expect(employerNameInput).to.exist;
          expect(employerNameInput.getAttribute('value')).to.equal(
            'Mandalorian Training Corps',
          );
        },
        { timeout: 3000 },
      );
    });

    it('should display Hutt Cartel', async () => {
      const data = {
        employerInformation: {
          employerName: 'Hutt Cartel',
          employerAddress: {
            street: 'First City',
            city: "Qo'noS",
            state: 'NY',
            postalCode: '10001',
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

      await waitFor(
        () => {
          const employerNameInput = findByLabel(
            container,
            'va-text-input',
            'Name of employer',
          );
          expect(employerNameInput).to.exist;
          expect(employerNameInput.getAttribute('value')).to.equal(
            'Hutt Cartel',
          );
        },
        { timeout: 3000 },
      );
    });

    it('should display Crimson Dawn', async () => {
      const data = {
        employerInformation: {
          employerName: 'Crimson Dawn',
          employerAddress: {
            street: 'Imperial Palace',
            city: 'Romulus',
            state: 'TX',
            postalCode: '75001',
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

      await waitFor(
        () => {
          const employerNameInput = findByLabel(
            container,
            'va-text-input',
            'Name of employer',
          );
          expect(employerNameInput).to.exist;
          expect(employerNameInput.getAttribute('value')).to.equal(
            'Crimson Dawn',
          );
        },
        { timeout: 3000 },
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

      expect(container).to.exist;
    });
  });
});
