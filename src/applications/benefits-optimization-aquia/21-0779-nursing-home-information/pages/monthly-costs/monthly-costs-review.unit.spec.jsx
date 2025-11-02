import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { MonthlyCostsReview } from '@bio-aquia/21-0779-nursing-home-information/pages/monthly-costs/monthly-costs-review';

describe('MonthlyCostsReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Monthly costs';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <MonthlyCostsReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <MonthlyCostsReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Monthly costs');
    });

    it('should render edit button', () => {
      const { container } = render(
        <MonthlyCostsReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should display monthly cost with currency formatting', () => {
      const data = {
        monthlyCosts: {
          monthlyOutOfPocket: '1500',
        },
      };

      const { container } = render(
        <MonthlyCostsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('$1,500.00');
    });

    it('should display formatted currency for string input', () => {
      const data = {
        monthlyCosts: {
          monthlyOutOfPocket: '$2,500.50',
        },
      };

      const { container } = render(
        <MonthlyCostsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('$2,500.50');
    });

    it('should display zero amount correctly', () => {
      const data = {
        monthlyCosts: {
          monthlyOutOfPocket: '0',
        },
      };

      const { container } = render(
        <MonthlyCostsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('$0.00');
    });

    it('should handle numeric input', () => {
      const data = {
        monthlyCosts: {
          monthlyOutOfPocket: 1500,
        },
      };

      const { container } = render(
        <MonthlyCostsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('$1,500.00');
    });

    it('should display "Not provided" for missing monthly cost', () => {
      const data = {
        monthlyCosts: {},
      };

      const { container } = render(
        <MonthlyCostsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <MonthlyCostsReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Not provided');
    });

    it('should handle missing monthlyCosts section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <MonthlyCostsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null monthly cost', () => {
      const data = {
        monthlyCosts: {
          monthlyOutOfPocket: null,
        },
      };

      const { container } = render(
        <MonthlyCostsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should handle undefined monthly cost', () => {
      const data = {
        monthlyCosts: {
          monthlyOutOfPocket: undefined,
        },
      };

      const { container } = render(
        <MonthlyCostsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should handle invalid string input', () => {
      const data = {
        monthlyCosts: {
          monthlyOutOfPocket: 'invalid',
        },
      };

      const { container } = render(
        <MonthlyCostsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should handle decimal amounts', () => {
      const data = {
        monthlyCosts: {
          monthlyOutOfPocket: '1234.56',
        },
      };

      const { container } = render(
        <MonthlyCostsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('$1,234.56');
    });

    it('should handle large amounts', () => {
      const data = {
        monthlyCosts: {
          monthlyOutOfPocket: '10000',
        },
      };

      const { container } = render(
        <MonthlyCostsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('$10,000.00');
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage prop correctly', () => {
      const customEditPage = () => {};
      const { container } = render(
        <MonthlyCostsReview
          data={{}}
          editPage={customEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });
});
