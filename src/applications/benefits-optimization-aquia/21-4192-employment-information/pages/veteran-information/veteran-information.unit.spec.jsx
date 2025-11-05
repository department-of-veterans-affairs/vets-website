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

      expect(container.textContent).to.include(
        'Who is the Veteran you are providing information for',
      );
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

      expect(container.querySelector('va-text-input[name="firstName"]')).to
        .exist;
      expect(container.querySelector('va-text-input[name="lastName"]')).to
        .exist;

      expect(container.querySelector('va-memorable-date[name="dateOfBirth"]'))
        .to.exist;
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
          firstName: 'Boba',
          lastName: 'Fett',
          dateOfBirth: '1985-03-22',
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
        'va-text-input[name="firstName"]',
      );
      expect(firstNameInput).to.exist;
      expect(firstNameInput.getAttribute('value')).to.equal('Boba');

      const lastNameInput = container.querySelector(
        'va-text-input[name="lastName"]',
      );
      expect(lastNameInput).to.exist;
      expect(lastNameInput.getAttribute('value')).to.equal('Fett');
    });

    it('should display date of birth', () => {
      const data = {
        veteranInformation: {
          firstName: 'Jango',
          lastName: 'Fett',
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
        'va-memorable-date[name="dateOfBirth"]',
      );
      expect(dobField).to.exist;
      expect(dobField.getAttribute('value')).to.equal('1958-01-06');
    });

    it('should handle empty veteran information', () => {
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

    it('should handle missing veteranInformation', () => {
      const data = {};

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
          firstName: 'Greedo',
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
        'va-text-input[name="firstName"]',
      );
      expect(firstNameInput).to.exist;
      expect(firstNameInput.getAttribute('value')).to.equal('Greedo');
    });
  });

  describe('Review Mode', () => {
    it('should render in review mode', () => {
      const data = {
        veteranInformation: {
          firstName: 'Zam',
          lastName: 'Wesell',
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
          firstName: 'Aurra',
          lastName: 'Sing',
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
    it('should mark firstName and lastName as required', () => {
      const { container } = render(
        <VeteranInformationPage
          data={{}}
          setFormData={mockSetFormData}
          goForward={mockGoForward}
          goBack={mockGoBack}
        />,
      );

      const firstNameInput = container.querySelector(
        'va-text-input[name="firstName"]',
      );
      expect(firstNameInput).to.exist;
      expect(firstNameInput.hasAttribute('required')).to.be.true;

      const lastNameInput = container.querySelector(
        'va-text-input[name="lastName"]',
      );
      expect(lastNameInput).to.exist;
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
        'va-memorable-date[name="dateOfBirth"]',
      );
      expect(dobField).to.exist;
      expect(dobField.hasAttribute('required')).to.be.true;
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
          firstName: 'Embo',
          lastName: '',
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
        firstName: 'Boba',
        lastName: 'Fett',
      };

      const result = ensureDateStrings(formData);

      expect(result.dateOfBirth).to.be.a('string');
      expect(result.dateOfBirth).to.include('1985-03-22');
    });

    it('should preserve string dates', () => {
      const formData = {
        dateOfBirth: '1958-01-06',
        firstName: 'Jango',
        lastName: 'Fett',
      };

      const result = ensureDateStrings(formData);

      expect(result.dateOfBirth).to.equal('1958-01-06');
    });

    it('should preserve other fields unchanged', () => {
      const formData = {
        dateOfBirth: '1962-07-13',
        firstName: 'Cad',
        lastName: 'Bane',
      };

      const result = ensureDateStrings(formData);

      expect(result.firstName).to.equal('Cad');
      expect(result.lastName).to.equal('Bane');
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
        firstName: 'IG-88',
        lastName: '',
      };

      const result = ensureDateStrings(formData);

      expect(result).to.deep.equal({
        firstName: 'IG-88',
        lastName: '',
      });
    });

    it('should handle empty dateOfBirth string', () => {
      const formData = {
        dateOfBirth: '',
        firstName: 'Dengar',
        lastName: '',
      };

      const result = ensureDateStrings(formData);

      expect(result.dateOfBirth).to.equal('');
    });

    it('should handle invalid date object', () => {
      const formData = {
        dateOfBirth: new Date('invalid'),
        firstName: '4-LOM',
        lastName: '',
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
        firstName: 'Boba',
        lastName: 'Fett',
      };

      const result = ensureDateStrings(formData);

      expect(result.dateOfBirth).to.be.a('string');
      expect(result.otherDate).to.be.instanceof(Date);
    });
  });

  describe('Return Value', () => {
    it('should return a new object', () => {
      const formData = {
        dateOfBirth: '1971-05-02',
        firstName: 'Bossk',
        lastName: 'Trandoshan',
      };

      const result = ensureDateStrings(formData);

      expect(result).to.not.equal(formData);
    });

    it('should return object with same structure', () => {
      const formData = {
        dateOfBirth: '1983-11-29',
        firstName: 'Sugi',
        lastName: '',
      };

      const result = ensureDateStrings(formData);

      expect(Object.keys(result)).to.have.members(Object.keys(formData));
    });
  });
});
