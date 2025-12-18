import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ConfirmationVeteranInformation from '../../../components/confirmationFields/ConfirmationVeteranInformation';

const mockFormData = {
  veteran: {
    email: 'test@example.com',
    fullName: {
      first: 'John',
      middle: 'Michael',
      last: 'Doe',
      suffix: 'Jr',
    },
    ssn: '1234',
    dateOfBirth: '1980-01-15',
    mobilePhone: {
      phoneNumber: '5551234',
      countryCode: '+1',
      areaCode: '555',
      extension: '123',
    },
    mailingAddress: {
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      addressLine3: 'Building A',
      city: 'Anytown',
      countryName: 'United States',
      zipCode: '12345',
      stateCode: 'NY',
    },
  },
};

describe('ConfirmationVeteranInformation', () => {
  it('should render all veteran personal information when provided', () => {
    const { getByText, container } = render(
      <ConfirmationVeteranInformation formData={mockFormData} />,
    );

    // Check section headers exist in container
    const headings = container.querySelectorAll('h4');
    expect(headings).to.have.length(4);

    // Check personal information
    getByText('First name');
    getByText('John');
    getByText('Middle name');
    getByText('Michael');
    getByText('Last name');
    getByText('Doe');
    getByText('Suffix');
    getByText('Jr');
    getByText('Date of birth');
    getByText('January 15, 1980');

    // Check identification information
    getByText('Social Security number');
    getByText('●●●–●●–1234');

    // Check mailing address
    getByText('Country');
    getByText('United States');
    getByText('Street address');
    getByText('123 Main St');
    getByText('Street address line 2');
    getByText('Apt 4B');
    getByText('Street address line 3');
    getByText('Building A');
    getByText('City');
    getByText('Anytown');
    getByText('State');
    getByText('NY');
    getByText('Postal code');
    getByText('12345');

    // Check contact information
    getByText('Phone number');
    getByText('+1 555 5551234 ext. 123');
    getByText('Email address');
    getByText('test@example.com');
  });

  it('should render minimal information when only required fields are provided', () => {
    const minimalFormData = {
      veteran: {
        email: 'test@example.com',
        fullName: {
          first: 'Jane',
          last: 'Smith',
        },
        ssn: '1234',
        dateOfBirth: '1980-01-15',
        mobilePhone: {
          phoneNumber: '5551234',
          areaCode: '555',
        },
        mailingAddress: {
          addressLine1: '123 Main St',
          city: 'Anytown',
          countryName: 'United States',
          zipCode: '12345',
          stateCode: 'NY',
        },
      },
    };

    const { getByText, queryByText, container } = render(
      <ConfirmationVeteranInformation formData={minimalFormData} />,
    );

    // Should render section headers
    const headings = container.querySelectorAll('h4');
    expect(headings).to.have.length(4);

    // Should render provided fields
    getByText('First name');
    getByText('Jane');
    getByText('Last name');
    getByText('Smith');

    getByText('Email address');
    getByText('test@example.com');

    getByText('Phone number');
    getByText('555 5551234');

    getByText('Country');
    getByText('United States');
    getByText('Street address');
    getByText('123 Main St');
    getByText('City');
    getByText('Anytown');
    getByText('State');
    getByText('NY');
    getByText('Postal code');
    getByText('12345');

    // Should not render missing fields
    expect(queryByText('Middle name')).to.be.null;
    expect(queryByText('Suffix')).to.be.null;

    expect(queryByText('Street address line 2')).to.be.null;
    expect(queryByText('Street address line 3')).to.be.null;
  });

  it('should handle empty veteran data gracefully', () => {
    const emptyFormData = {
      veteran: {
        fullName: {},
        mobilePhone: {},
        mailingAddress: {},
      },
    };

    const { queryByText, container } = render(
      <ConfirmationVeteranInformation formData={emptyFormData} />,
    );

    // Should still render section headers
    const headings = container.querySelectorAll('h4');
    expect(headings).to.have.length(4);

    // Should not render any specific data fields
    expect(queryByText('First name')).to.be.null;
    expect(queryByText('Last name')).to.be.null;
    expect(queryByText('Email address')).to.be.null;
  });

  it('should handle missing veteran object', () => {
    const noVeteranData = {
      veteran: {
        fullName: {},
        mobilePhone: {},
        mailingAddress: {},
      },
    };

    const { queryByText, container } = render(
      <ConfirmationVeteranInformation formData={noVeteranData} />,
    );

    // Should still render section headers
    const headings = container.querySelectorAll('h4');
    expect(headings).to.have.length(4);

    // Should not render any data fields
    expect(queryByText('First name')).to.be.null;
  });
});
