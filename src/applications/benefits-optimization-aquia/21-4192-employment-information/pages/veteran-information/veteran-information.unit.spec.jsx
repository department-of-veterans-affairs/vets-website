/**
 * @module tests/pages/veteran-information.unit.spec
 * @description Unit tests for VeteranInformationPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
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
            first: 'James',
            middle: 'Tiberius',
            last: 'Kirk',
          },
          dateOfBirth: '2233-03-22',
          ssn: '123-45-6789',
          vaFileNumber: '12345678',
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
      expect(firstNameInput.getAttribute('value')).to.equal('James');

      const middleNameInput = container.querySelector(
        'va-text-input[label="Middle name"]',
      );
      expect(middleNameInput).to.exist;
      expect(middleNameInput.getAttribute('value')).to.equal('Tiberius');

      const lastNameInput = container.querySelector(
        'va-text-input[label="Last name"]',
      );
      expect(lastNameInput).to.exist;
      expect(lastNameInput.getAttribute('value')).to.equal('Kirk');
    });

    it('should display date of birth', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'James', middle: 'Tiberius', last: 'Kirk' },
          dateOfBirth: '2233-03-22',
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
      expect(dobField.getAttribute('value')).to.equal('2233-03-22');
    });

    it('should display SSN', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'James', last: 'Kirk' },
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
          fullName: { first: 'James', last: 'Kirk' },
          vaFileNumber: '12345678',
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
      expect(vaFileNumberField.getAttribute('value')).to.equal('12345678');
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
            first: 'James',
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
      expect(firstNameInput.getAttribute('value')).to.equal('James');
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode', () => {
      const data = {
        veteranInformation: {
          fullName: { first: 'James', last: 'Kirk' },
          dateOfBirth: '2233-03-22',
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
          fullName: { first: 'James', last: 'Kirk' },
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
          fullName: { first: 'James', last: 'Kirk' },
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
        dateOfBirth: new Date('2233-03-22'),
        fullName: { first: 'James', last: 'Kirk' },
      };

      const result = ensureDateStrings(formData);

      expect(result.dateOfBirth).to.be.a('string');
      expect(result.dateOfBirth).to.include('2233-03-22');
    });

    it('should preserve string dates', () => {
      const formData = {
        dateOfBirth: '2233-03-22',
        fullName: { first: 'James', last: 'Kirk' },
      };

      const result = ensureDateStrings(formData);

      expect(result.dateOfBirth).to.equal('2233-03-22');
    });

    it('should preserve other fields unchanged', () => {
      const formData = {
        dateOfBirth: '2233-03-22',
        fullName: { first: 'James', middle: 'Tiberius', last: 'Kirk' },
        ssn: '123-45-6789',
        vaFileNumber: '12345678',
      };

      const result = ensureDateStrings(formData);

      expect(result.fullName).to.deep.equal({
        first: 'James',
        middle: 'Tiberius',
        last: 'Kirk',
      });
      expect(result.ssn).to.equal('123-45-6789');
      expect(result.vaFileNumber).to.equal('12345678');
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
        fullName: { first: 'James', last: 'Kirk' },
      };

      const result = ensureDateStrings(formData);

      expect(result).to.deep.equal({
        fullName: { first: 'James', last: 'Kirk' },
      });
    });

    it('should handle empty dateOfBirth string', () => {
      const formData = {
        dateOfBirth: '',
        fullName: { first: 'James', last: 'Kirk' },
      };

      const result = ensureDateStrings(formData);

      expect(result.dateOfBirth).to.equal('');
    });

    it('should handle invalid date object', () => {
      const formData = {
        dateOfBirth: new Date('invalid'),
        fullName: { first: 'James', last: 'Kirk' },
      };

      const result = ensureDateStrings(formData);

      expect(result.dateOfBirth).to.be.a('string');
    });
  });

  describe('Multiple Date Fields', () => {
    it('should only transform dateOfBirth field', () => {
      const formData = {
        dateOfBirth: new Date('2233-03-22'),
        otherDate: new Date('2250-01-01'),
        fullName: { first: 'James', last: 'Kirk' },
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
        dateOfBirth: '2233-03-22',
        fullName: { first: 'James', last: 'Kirk' },
      };

      const result = ensureDateStrings(formData);

      expect(result).to.not.equal(formData);
    });

    it('should return object with same structure', () => {
      const formData = {
        dateOfBirth: '2233-03-22',
        fullName: { first: 'James', last: 'Kirk' },
        ssn: '123-45-6789',
      };

      const result = ensureDateStrings(formData);

      expect(Object.keys(result)).to.have.members(Object.keys(formData));
    });
  });
});
