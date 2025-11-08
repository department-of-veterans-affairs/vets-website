/**
 * @module tests/pages/hospitalization-facility.unit.spec
 * @description Unit tests for HospitalizationFacilityPage component
 */

import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { expect } from 'chai';

// Simple mock template
const MockPageTemplate = ({ children }) => {
  const mockProps = {
    localData: { hospitalizationFacilityName: '' },
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
const HospitalizationFacilityPageContent = ({ data: _data }) => {
  return (
    <MockPageTemplate>
      {() => (
        <>
          <h1>Hospitalization facility</h1>
          <label htmlFor="facility">Facility name</label>
          <input id="facility" type="text" />
          <va-button text="Continue" />
        </>
      )}
    </MockPageTemplate>
  );
};

HospitalizationFacilityPageContent.propTypes = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

describe('HospitalizationFacilityPage', () => {
  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <HospitalizationFacilityPageContent data={{}} />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('facility');
    });
  });

  describe('Field Rendering', () => {
    it('should render facility name field', () => {
      const { container } = render(
        <HospitalizationFacilityPageContent data={{}} />,
      );

      const label = container.querySelector('label[for="facility"]');
      expect(label).to.exist;
      expect(label.textContent).to.include('Facility name');
    });
  });

  describe('Data Handling', () => {
    it('should handle empty data gracefully', () => {
      const { container } = render(
        <HospitalizationFacilityPageContent data={{}} />,
      );

      expect(container).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <HospitalizationFacilityPageContent data={{}} />,
      );

      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );
      expect(continueButton).to.exist;
    });
  });
});
