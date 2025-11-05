import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { VeteranPersonalInfoPage } from '@bio-aquia/21-0779-nursing-home-information/pages/veteran-personal-info/veteran-personal-info';

describe('VeteranPersonalInfoPage', () => {
  const defaultProps = {
    data: {},
    setFormData: () => {},
    goForward: () => {},
    goBack: () => {},
  };

  describe('Component rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <VeteranPersonalInfoPage {...defaultProps} />,
      );
      expect(container).to.exist;
    });

    it('should render with valid data', () => {
      const data = {
        veteranPersonalInfo: {
          fullName: { first: 'John', middle: 'A', last: 'Doe' },
          dateOfBirth: '1990-01-01',
        },
      };
      const { container } = render(
        <VeteranPersonalInfoPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should handle undefined data gracefully', () => {
      const { container } = render(
        <VeteranPersonalInfoPage {...defaultProps} data={undefined} />,
      );
      expect(container).to.exist;
    });

    it('should handle null data gracefully', () => {
      const { container } = render(
        <VeteranPersonalInfoPage {...defaultProps} data={null} />,
      );
      expect(container).to.exist;
    });

    it('should handle array data gracefully', () => {
      const { container } = render(
        <VeteranPersonalInfoPage {...defaultProps} data={[]} />,
      );
      expect(container).to.exist;
    });

    it('should render with veteran as patient type', () => {
      const data = {
        claimantQuestion: {
          patientType: 'veteran',
        },
      };
      const { container } = render(
        <VeteranPersonalInfoPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should render with spouse or parent as patient type', () => {
      const data = {
        claimantQuestion: {
          patientType: 'spouseOrParent',
        },
      };
      const { container } = render(
        <VeteranPersonalInfoPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });
  });
});
