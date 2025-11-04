import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { ClaimantIdentificationInfoPage } from '@bio-aquia/21-0779-nursing-home-information/pages/claimant-identification-info/claimant-identification-info';

describe('ClaimantIdentificationInfoPage', () => {
  const defaultProps = {
    data: {},
    setFormData: () => {},
    goForward: () => {},
    goBack: () => {},
  };

  describe('Component rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <ClaimantIdentificationInfoPage {...defaultProps} />,
      );
      expect(container).to.exist;
    });

    it('should render with valid data', () => {
      const data = {
        claimantIdentificationInfo: {
          claimantSsn: '123456789',
          claimantVaFileNumber: '987654321',
        },
      };
      const { container } = render(
        <ClaimantIdentificationInfoPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should handle undefined data gracefully', () => {
      const { container } = render(
        <ClaimantIdentificationInfoPage {...defaultProps} data={undefined} />,
      );
      expect(container).to.exist;
    });

    it('should handle null data gracefully', () => {
      const { container } = render(
        <ClaimantIdentificationInfoPage {...defaultProps} data={null} />,
      );
      expect(container).to.exist;
    });

    it('should handle array data gracefully', () => {
      const { container } = render(
        <ClaimantIdentificationInfoPage {...defaultProps} data={[]} />,
      );
      expect(container).to.exist;
    });

    it('should render with empty claimant data', () => {
      const data = {
        claimantIdentificationInfo: {
          claimantSsn: '',
          claimantVaFileNumber: '',
        },
      };
      const { container } = render(
        <ClaimantIdentificationInfoPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });
  });
});
