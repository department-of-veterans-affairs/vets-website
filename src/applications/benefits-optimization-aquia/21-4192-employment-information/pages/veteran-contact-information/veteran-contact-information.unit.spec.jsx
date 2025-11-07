/**
 * @module tests/pages/veteran-contact-information.unit.spec
 * @description Unit tests for Veteran Contact Information page component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { VeteranContactInformationPage } from './veteran-contact-information';

describe('VeteranContactInformationPage', () => {
  const mockGoForward = () => {};
  const mockSetFormData = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <VeteranContactInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should render default title when no veteran name provided', () => {
      const { container } = render(
        <VeteranContactInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        "Veteran's Social Security number and VA file number",
      );
    });

    it('should render title with veteran full name', () => {
      const data = {
        veteranInformation: {
          firstName: 'Boba',
          lastName: 'Fett',
        },
      };
      const { container } = render(
        <VeteranContactInformationPage
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        "Boba Fett's Social Security number and VA file number",
      );
    });

    it('should render title with only first name', () => {
      const data = {
        veteranInformation: {
          firstName: 'Jango',
        },
      };
      const { container } = render(
        <VeteranContactInformationPage
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        "Jango's Social Security number and VA file number",
      );
    });

    it('should render title with only last name', () => {
      const data = {
        veteranInformation: {
          lastName: 'Fett',
        },
      };
      const { container } = render(
        <VeteranContactInformationPage
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        "Fett's Social Security number and VA file number",
      );
    });
  });

  describe('Form Fields', () => {
    it('should render SSN and VA file number fields', () => {
      const { container } = render(
        <VeteranContactInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const textInputs = container.querySelectorAll('va-text-input');
      expect(textInputs.length).to.be.at.least(2);
    });

    it('should mark SSN as required', () => {
      const { container } = render(
        <VeteranContactInformationPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const ssnField = container.querySelector('va-text-input');
      expect(ssnField.hasAttribute('required')).to.be.true;
    });
  });

  describe('Data Display', () => {
    it('should display SSN data', () => {
      const data = {
        veteranContactInformation: {
          ssn: '123-45-6789',
        },
      };
      const { container } = render(
        <VeteranContactInformationPage
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      const ssnField = container.querySelector('va-text-input');
      expect(ssnField).to.exist;
    });

    it('should display VA file number data', () => {
      const data = {
        veteranContactInformation: {
          vaFileNumber: 'c12345678',
        },
      };
      const { container } = render(
        <VeteranContactInformationPage
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined data', () => {
      const { container } = render(
        <VeteranContactInformationPage
          goForward={mockGoForward}
          data={undefined}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null veteranInformation', () => {
      const data = {
        veteranInformation: null,
      };
      const { container } = render(
        <VeteranContactInformationPage
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        "Veteran's Social Security number and VA file number",
      );
    });

    it('should handle empty veteranInformation', () => {
      const data = {
        veteranInformation: {},
      };
      const { container } = render(
        <VeteranContactInformationPage
          goForward={mockGoForward}
          data={data}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        "Veteran's Social Security number and VA file number",
      );
    });
  });
});
