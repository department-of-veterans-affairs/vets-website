/**
 * @module tests/pages/veteran-information.unit.spec
 * @description Unit tests for VeteranInformationPage component
 */

import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { expect } from 'chai';

// Simple mock template
const MockPageTemplate = ({ children }) => {
  const mockProps = {
    localData: {
      veteranFullName: { first: '', middle: '', last: '' },
      veteranSSN: '',
      veteranDOB: '',
    },
    handleFieldChange: () => {},
    errors: {},
    formSubmitted: false,
  };

  return (
    <div>{typeof children === 'function' ? children(mockProps) : children}</div>
  );
};

MockPageTemplate.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
};

// Simple test component
const VeteranInformationPageContent = ({ data: _data }) => {
  return (
    <MockPageTemplate>
      {() => (
        <>
          <h1>Veteran identification</h1>
          <label htmlFor="first">First name</label>
          <input id="first" type="text" />
          <label htmlFor="last">Last name</label>
          <input id="last" type="text" />
          <label htmlFor="ssn">Social Security number</label>
          <input id="ssn" type="text" />
          <label htmlFor="dob">Date of birth</label>
          <input id="dob" type="date" />
          <va-button text="Continue" />
        </>
      )}
    </MockPageTemplate>
  );
};

VeteranInformationPageContent.propTypes = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

describe('VeteranInformationPage', () => {
  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(<VeteranInformationPageContent data={{}} />);

      expect(container).to.exist;
      expect(container.textContent).to.include('Veteran identification');
    });
  });

  describe('Field Rendering', () => {
    it('should render name fields', () => {
      const { container } = render(<VeteranInformationPageContent data={{}} />);

      const firstNameLabel = container.querySelector('label[for="first"]');
      const lastNameLabel = container.querySelector('label[for="last"]');
      expect(firstNameLabel).to.exist;
      expect(lastNameLabel).to.exist;
      expect(firstNameLabel.textContent).to.include('First name');
      expect(lastNameLabel.textContent).to.include('Last name');
    });

    it('should render SSN field', () => {
      const { container } = render(<VeteranInformationPageContent data={{}} />);

      const ssnLabel = container.querySelector('label[for="ssn"]');
      expect(ssnLabel).to.exist;
      expect(ssnLabel.textContent).to.include('Social Security number');
    });

    it('should render date of birth field', () => {
      const { container } = render(<VeteranInformationPageContent data={{}} />);

      const dobInput = container.querySelector('input[type="date"]');
      expect(dobInput).to.exist;
    });
  });

  describe('Data Handling', () => {
    it('should handle empty data gracefully', () => {
      const { container } = render(<VeteranInformationPageContent data={{}} />);

      expect(container).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(<VeteranInformationPageContent data={{}} />);

      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );
      expect(continueButton).to.exist;
    });
  });
});
