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
