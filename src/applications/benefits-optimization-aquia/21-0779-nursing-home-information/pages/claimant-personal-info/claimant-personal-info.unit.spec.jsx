import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { ClaimantPersonalInfoPage } from '@bio-aquia/21-0779-nursing-home-information/pages/claimant-personal-info/claimant-personal-info';

describe('ClaimantPersonalInfoPage', () => {
  const defaultProps = {
    data: {},
    setFormData: () => {},
    goForward: () => {},
    goBack: () => {},
  };

  describe('Component rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(
        <ClaimantPersonalInfoPage {...defaultProps} />,
      );
      expect(container).to.exist;
    });

    it('should render with valid data', () => {
      const data = {
        claimantPersonalInfo: {
          claimantFullName: { first: 'Jane', middle: 'B', last: 'Smith' },
          claimantDateOfBirth: '1985-05-15',
        },
      };
      const { container } = render(
        <ClaimantPersonalInfoPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should handle undefined data gracefully', () => {
      const { container } = render(
        <ClaimantPersonalInfoPage {...defaultProps} data={undefined} />,
      );
      expect(container).to.exist;
    });

    it('should handle null data gracefully', () => {
      const { container } = render(
        <ClaimantPersonalInfoPage {...defaultProps} data={null} />,
      );
      expect(container).to.exist;
    });

    it('should handle array data gracefully', () => {
      const { container } = render(
        <ClaimantPersonalInfoPage {...defaultProps} data={[]} />,
      );
      expect(container).to.exist;
    });

    it('should render with empty claimant data', () => {
      const data = {
        claimantPersonalInfo: {
          claimantFullName: { first: '', middle: '', last: '' },
          claimantDateOfBirth: '',
        },
      };
      const { container } = render(
        <ClaimantPersonalInfoPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });
  });
});
