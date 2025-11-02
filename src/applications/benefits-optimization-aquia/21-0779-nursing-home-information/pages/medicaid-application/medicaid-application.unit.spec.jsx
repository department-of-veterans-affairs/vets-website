/**
 * Unit tests for MedicaidApplicationPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MedicaidApplicationPage } from './medicaid-application';

describe('MedicaidApplicationPage', () => {
  const defaultProps = {
    data: {},
    setFormData: () => {},
    goForward: () => {},
    goBack: () => {},
  };

  describe('Component rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <MedicaidApplicationPage {...defaultProps} />,
      );
      expect(container).to.exist;
    });

    it('should render with valid data', () => {
      const data = {
        medicaidApplication: {
          hasAppliedForMedicaid: 'yes',
        },
      };
      const { container } = render(
        <MedicaidApplicationPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should handle undefined data gracefully', () => {
      const { container } = render(
        <MedicaidApplicationPage {...defaultProps} data={undefined} />,
      );
      expect(container).to.exist;
    });

    it('should handle null data gracefully', () => {
      const { container } = render(
        <MedicaidApplicationPage {...defaultProps} data={null} />,
      );
      expect(container).to.exist;
    });

    it('should handle array data gracefully', () => {
      const { container } = render(
        <MedicaidApplicationPage {...defaultProps} data={[]} />,
      );
      expect(container).to.exist;
    });

    it('should render with yes response', () => {
      const data = {
        medicaidApplication: {
          hasAppliedForMedicaid: 'yes',
        },
      };
      const { container } = render(
        <MedicaidApplicationPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should render with no response', () => {
      const data = {
        medicaidApplication: {
          hasAppliedForMedicaid: 'no',
        },
      };
      const { container } = render(
        <MedicaidApplicationPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });
  });
});
