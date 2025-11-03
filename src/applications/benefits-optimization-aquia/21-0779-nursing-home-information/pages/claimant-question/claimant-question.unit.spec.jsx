import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { ClaimantQuestionPage } from '@bio-aquia/21-0779-nursing-home-information/pages/claimant-question/claimant-question';

describe('ClaimantQuestionPage', () => {
  const defaultProps = {
    data: {},
    setFormData: () => {},
    goForward: () => {},
    goBack: () => {},
  };

  describe('Component rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<ClaimantQuestionPage {...defaultProps} />);
      expect(container).to.exist;
    });

    it('should render with valid data', () => {
      const data = {
        claimantQuestion: {
          patientType: 'veteran',
        },
      };
      const { container } = render(
        <ClaimantQuestionPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should handle undefined data gracefully', () => {
      const { container } = render(
        <ClaimantQuestionPage {...defaultProps} data={undefined} />,
      );
      expect(container).to.exist;
    });

    it('should handle null data gracefully', () => {
      const { container } = render(
        <ClaimantQuestionPage {...defaultProps} data={null} />,
      );
      expect(container).to.exist;
    });

    it('should handle array data gracefully', () => {
      const { container } = render(
        <ClaimantQuestionPage {...defaultProps} data={[]} />,
      );
      expect(container).to.exist;
    });

    it('should render with veteran patient type', () => {
      const data = {
        claimantQuestion: {
          patientType: 'veteran',
        },
      };
      const { container } = render(
        <ClaimantQuestionPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should render with spouse or parent patient type', () => {
      const data = {
        claimantQuestion: {
          patientType: 'spouseOrParent',
        },
      };
      const { container } = render(
        <ClaimantQuestionPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });
  });
});
