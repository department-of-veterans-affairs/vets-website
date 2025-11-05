import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { MonthlyCostsPage } from '@bio-aquia/21-0779-nursing-home-information/pages/monthly-costs/monthly-costs';

describe('MonthlyCostsPage', () => {
  const defaultProps = {
    data: {},
    setFormData: () => {},
    goForward: () => {},
    goBack: () => {},
  };

  describe('Component rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<MonthlyCostsPage {...defaultProps} />);
      expect(container).to.exist;
    });

    it('should render with valid data', () => {
      const data = {
        monthlyCosts: {
          monthlyOutOfPocket: '1500',
        },
      };
      const { container } = render(
        <MonthlyCostsPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should handle undefined data gracefully', () => {
      const { container } = render(
        <MonthlyCostsPage {...defaultProps} data={undefined} />,
      );
      expect(container).to.exist;
    });

    it('should handle null data gracefully', () => {
      const { container } = render(
        <MonthlyCostsPage {...defaultProps} data={null} />,
      );
      expect(container).to.exist;
    });

    it('should handle array data gracefully', () => {
      const { container } = render(
        <MonthlyCostsPage {...defaultProps} data={[]} />,
      );
      expect(container).to.exist;
    });

    it('should render with zero cost', () => {
      const data = {
        monthlyCosts: {
          monthlyOutOfPocket: '0',
        },
      };
      const { container } = render(
        <MonthlyCostsPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });

    it('should render with large cost value', () => {
      const data = {
        monthlyCosts: {
          monthlyOutOfPocket: '5000',
        },
      };
      const { container } = render(
        <MonthlyCostsPage {...defaultProps} data={data} />,
      );
      expect(container).to.exist;
    });
  });
});
