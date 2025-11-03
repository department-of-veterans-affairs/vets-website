import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { MedicaidStatusPage } from '@bio-aquia/21-0779-nursing-home-information/pages/medicaid-status/medicaid-status';

describe('MedicaidStatusPage', () => {
  const defaultProps = {
    data: {},
    setFormData: () => {},
    goForward: () => {},
    goBack: () => {},
  };

  describe('Component rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<MedicaidStatusPage {...defaultProps} />);
      expect(container).to.exist;
    });

    it('should render with valid data', () => {
      const data = {
        medicaidStatus: {
          currentlyCoveredByMedicaid: 'yes',
        },
      };
      const { container } = render(
        <MedicaidStatusPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should handle undefined data gracefully', () => {
      const { container } = render(
        <MedicaidStatusPage {...defaultProps} data={undefined} />,
      );
      expect(container).to.exist;
    });

    it('should handle null data gracefully', () => {
      const { container } = render(
        <MedicaidStatusPage {...defaultProps} data={null} />,
      );
      expect(container).to.exist;
    });

    it('should handle array data gracefully', () => {
      const { container } = render(
        <MedicaidStatusPage {...defaultProps} data={[]} />,
      );
      expect(container).to.exist;
    });

    it('should render with yes response', () => {
      const data = {
        medicaidStatus: {
          currentlyCoveredByMedicaid: 'yes',
        },
      };
      const { container } = render(
        <MedicaidStatusPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should render with no response', () => {
      const data = {
        medicaidStatus: {
          currentlyCoveredByMedicaid: 'no',
        },
      };
      const { container } = render(
        <MedicaidStatusPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });
  });
});
