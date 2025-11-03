import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { VeteranIdentificationInfoPage } from '@bio-aquia/21-0779-nursing-home-information/pages/veteran-identification-info/veteran-identification-info';

describe('VeteranIdentificationInfoPage', () => {
  const defaultProps = {
    data: {},
    setFormData: () => {},
    goForward: () => {},
    goBack: () => {},
  };

  describe('Component rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <VeteranIdentificationInfoPage {...defaultProps} />,
      );
      expect(container).to.exist;
    });

    it('should render with valid data', () => {
      const data = {
        veteranIdentificationInfo: {
          ssn: '123456789',
          vaFileNumber: '987654321',
        },
      };
      const { container } = render(
        <VeteranIdentificationInfoPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should handle undefined data gracefully', () => {
      const { container } = render(
        <VeteranIdentificationInfoPage {...defaultProps} data={undefined} />,
      );
      expect(container).to.exist;
    });

    it('should handle null data gracefully', () => {
      const { container } = render(
        <VeteranIdentificationInfoPage {...defaultProps} data={null} />,
      );
      expect(container).to.exist;
    });

    it('should handle array data gracefully', () => {
      const { container } = render(
        <VeteranIdentificationInfoPage {...defaultProps} data={[]} />,
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
        <VeteranIdentificationInfoPage {...defaultProps} data={data} />,
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
        <VeteranIdentificationInfoPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });
  });
});
