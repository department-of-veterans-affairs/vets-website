import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { MedicaidFacilityPage } from '@bio-aquia/21-0779-nursing-home-information/pages/medicaid-facility/medicaid-facility';

describe('MedicaidFacilityPage', () => {
  const defaultProps = {
    data: {},
    setFormData: () => {},
    goForward: () => {},
    goBack: () => {},
  };

  describe('Component rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<MedicaidFacilityPage {...defaultProps} />);
      expect(container).to.exist;
    });

    it('should render with valid data', () => {
      const data = {
        medicaidFacility: {
          isMedicaidApproved: 'yes',
        },
      };
      const { container } = render(
        <MedicaidFacilityPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should handle undefined data gracefully', () => {
      const { container } = render(
        <MedicaidFacilityPage {...defaultProps} data={undefined} />,
      );
      expect(container).to.exist;
    });

    it('should handle null data gracefully', () => {
      const { container } = render(
        <MedicaidFacilityPage {...defaultProps} data={null} />,
      );
      expect(container).to.exist;
    });

    it('should handle array data gracefully', () => {
      const { container } = render(
        <MedicaidFacilityPage {...defaultProps} data={[]} />,
      );
      expect(container).to.exist;
    });

    it('should render with yes response', () => {
      const data = {
        medicaidFacility: {
          isMedicaidApproved: 'yes',
        },
      };
      const { container } = render(
        <MedicaidFacilityPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should render with no response', () => {
      const data = {
        medicaidFacility: {
          isMedicaidApproved: 'no',
        },
      };
      const { container } = render(
        <MedicaidFacilityPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });
  });
});
