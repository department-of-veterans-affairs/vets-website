/**
 * @module tests/pages/veteran-information.unit.spec
 * @description Unit tests for VeteranInformationPage component
 */

import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import {
  VeteranInformationPage,
  ensureDateStrings,
} from './veteran-information';

describe('VeteranInformationPage', () => {
  const mockSetFormData = () => {};
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranInformationPage
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
        <VeteranInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.textContent).to.include("Veteran's information");
    });

    it('should render all form fields', () => {
      const { container } = render(
        <VeteranInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      // Check for fullname fields
      expect(container.querySelector('va-text-input[label="First name"]')).to
        .exist;
      expect(container.querySelector('va-text-input[label="Middle name"]')).to
        .exist;
      expect(container.querySelector('va-text-input[label="Last name"]')).to
        .exist;

      // Check for date of birth
      expect(
        container.querySelector('va-memorable-date[label="Date of birth"]'),
      ).to.exist;

      // Check for SSN
      expect(
        container.querySelector(
          'va-text-input[label="Social security number"]',
        ),
      ).to.exist;

      // Check for VA file number (renders as va-text-input with inputmode="numeric")
      expect(
        container.querySelector(
          'va-text-input[label="VA file number (if applicable)"]',
        ),
      ).to.exist;
    });

    it('should render continue button', () => {
      const { container } = render(
        <VeteranInformationPage
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
        <VeteranInformationPage
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
    it('should display veteran name data', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Boba',
            middle: '',
            last: 'Fett',
          },
          dateOfBirth: '1985-03-22',
          ssn: '123-45-6789',
          vaFileNumber: '22113800',
        },
      };

      const { container } = render(
        <VeteranInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      expect(firstNameInput).to.exist;
      expect(firstNameInput.getAttribute('value')).to.equal('Boba');

      const middleNameInput = container.querySelector(
        'va-text-input[label="Middle name"]',
      );
      expect(middleNameInput).to.exist;
      expect(middleNameInput.getAttribute('value')).to.equal('');

      const lastNameInput = container.querySelector(
        'va-text-input[label="Last name"]',
      );
      expect(lastNameInput).to.exist;
      expect(lastNameInput.getAttribute('value')).to.equal('Fett');
    });

    it('should display date of birth', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'Jango', middle: '', last: 'Fett' },
          dateOfBirth: '1958-01-06',
        },
      };

      const { container } = render(
        <VeteranInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const dobField = container.querySelector(
        'va-memorable-date[label="Date of birth"]',
      );
      expect(dobField).to.exist;
      expect(dobField.getAttribute('value')).to.equal('1958-01-06');
    });

    it('should display SSN', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'Cad', last: 'Bane' },
          ssn: '123-45-6789',
        },
      };

      const { container } = render(
        <VeteranInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const ssnField = container.querySelector(
        'va-text-input[label="Social security number"]',
      );
      expect(ssnField).to.exist;
      expect(ssnField.getAttribute('value')).to.equal('123-45-6789');
    });

    it('should display VA file number', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'Bossk', last: 'Trandoshan' },
          vaFileNumber: '77992000',
        },
      };

      const { container } = render(
        <VeteranInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const vaFileNumberField = container.querySelector(
        'va-text-input[label="VA file number (if applicable)"]',
      );
      expect(vaFileNumberField).to.exist;
      expect(vaFileNumberField.getAttribute('value')).to.equal('77992000');
    });

    it('should handle empty fullName object', () => {
      const data = {
        veteranInformation: {
          fullName: {},
        },
      };

      const { container } = render(
        <VeteranInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing fullName', () => {
      const data = {
        veteranInformation: {},
      };

      const { container } = render(
        <VeteranInformationPage
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
        <VeteranInformationPage
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
        <VeteranInformationPage
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
        <VeteranInformationPage
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
        <VeteranInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle partial data', () => {
      const data = {
        veteranInformation: {
          fullName: {
            first: 'Greedo',
          },
        },
      };

      const { container } = render(
        <VeteranInformationPage
          data={data}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      expect(firstNameInput.getAttribute('value')).to.equal('Greedo');
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'Zam', last: 'Wesell' },
          dateOfBirth: '1979-04-18',
        },
      };

      const { container } = render(
        <VeteranInformationPage
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
        veteranInformation: {
          fullName: { first: 'Aurra', last: 'Sing' },
        },
      };

      const { container } = render(
        <VeteranInformationPage
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
    it('should mark fullName as required', () => {
      const { container } = render(
        <VeteranInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const firstNameInput = container.querySelector(
        'va-text-input[label="First name"]',
      );
      expect(firstNameInput.hasAttribute('required')).to.be.true;

      const lastNameInput = container.querySelector(
        'va-text-input[label="Last name"]',
      );
      expect(lastNameInput.hasAttribute('required')).to.be.true;
    });

    it('should mark dateOfBirth as required', () => {
      const { container } = render(
        <VeteranInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const dobField = container.querySelector(
        'va-memorable-date[label="Date of birth"]',
      );
      expect(dobField.hasAttribute('required')).to.be.true;
    });

    it('should mark ssn as required', () => {
      const { container } = render(
        <VeteranInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const ssnField = container.querySelector(
        'va-text-input[label="Social security number"]',
      );
      expect(ssnField.hasAttribute('required')).to.be.true;
    });

    it('should not mark vaFileNumber as required', () => {
      const { container } = render(
        <VeteranInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const vaFileNumberField = container.querySelector(
        'va-text-input[label="VA file number (if applicable)"]',
      );
      expect(vaFileNumberField.hasAttribute('required')).to.be.false;
    });
  });

  describe('Field Hints', () => {
    it('should display hint for VA file number', () => {
      const { container } = render(
        <VeteranInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const vaFileNumberField = container.querySelector(
        'va-text-input[label="VA file number (if applicable)"]',
      );
      expect(vaFileNumberField.getAttribute('hint')).to.equal(
        'VA file number must be 8 or 9 digits',
      );
    });
  });

  describe('Component Props', () => {
    it('should render without optional props', () => {
      const { container } = render(
        <VeteranInformationPage goForward={mockGoForward} />,
      );

      expect(container).to.exist;
    });

    it('should render with all props', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'Embo', last: '' },
        },
      };

      const { container } = render(
        <VeteranInformationPage
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
});

describe('ensureDateStrings', () => {
  describe('Date Transformation', () => {
    it('should transform Date object to ISO string for dateOfBirth', () => {
      const formData = {
        dateOfBirth: new Date('1985-03-22'),
        fullName: { first: 'Boba', last: 'Fett' },
      };

      const result = ensureDateStrings(formData);

      expect(result.dateOfBirth).to.be.a('string');
      expect(result.dateOfBirth).to.include('1985-03-22');
    });

    it('should preserve string dates', () => {
      const formData = {
        dateOfBirth: '1958-01-06',
        fullName: { first: 'Jango', last: 'Fett' },
      };

      const result = ensureDateStrings(formData);

      expect(result.dateOfBirth).to.equal('1958-01-06');
    });

    it('should preserve other fields unchanged', () => {
      const formData = {
        dateOfBirth: '1962-07-13',
        fullName: { first: 'Cad', middle: '', last: 'Bane' },
        ssn: '123-45-6789',
        vaFileNumber: '33771100',
      };

      const result = ensureDateStrings(formData);

      expect(result.fullName).to.deep.equal({
        first: 'Cad',
        middle: '',
        last: 'Bane',
      });
      expect(result.ssn).to.equal('123-45-6789');
      expect(result.vaFileNumber).to.equal('33771100');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null formData', () => {
      const result = ensureDateStrings(null);
      expect(result).to.be.null;
    });

    it('should handle undefined formData', () => {
      const result = ensureDateStrings(undefined);
      expect(result).to.be.undefined;
    });

    it('should handle empty object', () => {
      const result = ensureDateStrings({});
      expect(result).to.deep.equal({});
    });

    it('should handle formData without dateOfBirth', () => {
      const formData = {
        fullName: { first: 'IG-88', last: '' },
      };

      const result = ensureDateStrings(formData);

      expect(result).to.deep.equal({
        fullName: { first: 'IG-88', last: '' },
      });
    });

    it('should handle empty dateOfBirth string', () => {
      const formData = {
        dateOfBirth: '',
        fullName: { first: 'Dengar', last: '' },
      };

      const result = ensureDateStrings(formData);

      expect(result.dateOfBirth).to.equal('');
    });

    it('should handle invalid date object', () => {
      const formData = {
        dateOfBirth: new Date('invalid'),
        fullName: { first: '4-LOM', last: '' },
      };

      const result = ensureDateStrings(formData);

      expect(result.dateOfBirth).to.be.a('string');
    });
  });

  describe('Multiple Date Fields', () => {
    it('should only transform dateOfBirth field', () => {
      const formData = {
        dateOfBirth: new Date('1985-03-22'),
        otherDate: new Date('2024-01-01'),
        fullName: { first: 'Boba', last: 'Fett' },
      };

      const result = ensureDateStrings(formData);

      expect(result.dateOfBirth).to.be.a('string');
      // otherDate should remain a Date object since only dateOfBirth is transformed
      expect(result.otherDate).to.be.instanceof(Date);
    });
  });

  describe('Return Value', () => {
    it('should return a new object', () => {
      const formData = {
        dateOfBirth: '1971-05-02',
        fullName: { first: 'Bossk', last: 'Trandoshan' },
      };

      const result = ensureDateStrings(formData);

      expect(result).to.not.equal(formData);
    });

    it('should return object with same structure', () => {
      const formData = {
        dateOfBirth: '1983-11-29',
        fullName: { first: 'Sugi', last: '' },
        ssn: '123-45-6789',
      };

      const result = ensureDateStrings(formData);

      expect(Object.keys(result)).to.have.members(Object.keys(formData));
    });
  });
});
