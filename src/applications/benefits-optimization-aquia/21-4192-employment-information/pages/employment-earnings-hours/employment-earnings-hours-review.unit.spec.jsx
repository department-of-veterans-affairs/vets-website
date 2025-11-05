/**
 * @module tests/pages/employment-earnings-hours-review.unit.spec
 * @description Unit tests for Employment Earnings and Hours review component
 */

import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { EmploymentEarningsHoursReview } from './employment-earnings-hours-review';

describe('EmploymentEarningsHoursReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Employment earnings and hours';

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const data = {
        employmentEarningsHours: {
          amountEarned: '50000',
          timeLost: '2 weeks',
          dailyHours: '8',
          weeklyHours: '40',
        },
      };
      const { container } = render(
        <EmploymentEarningsHoursReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should display title', () => {
      const data = {
        employmentEarningsHours: {},
      };
      const { container } = render(
        <EmploymentEarningsHoursReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const heading = container.querySelector('h4');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal(mockTitle);
    });

    it('should display edit button', () => {
      const data = {
        employmentEarningsHours: {},
      };
      const { container } = render(
        <EmploymentEarningsHoursReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
      expect(editButton.getAttribute('text')).to.equal('Edit');
    });
  });

  describe('Data Display', () => {
    it('should display amount earned', () => {
      const data = {
        employmentEarningsHours: {
          amountEarned: '50000',
        },
      };
      const { container } = render(
        <EmploymentEarningsHoursReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Amount earned');
      expect(text).to.include('50000');
    });

    it('should display time lost', () => {
      const data = {
        employmentEarningsHours: {
          timeLost: '2 weeks',
        },
      };
      const { container } = render(
        <EmploymentEarningsHoursReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Time lost');
      expect(text).to.include('2 weeks');
    });

    it('should display daily hours', () => {
      const data = {
        employmentEarningsHours: {
          dailyHours: '8',
        },
      };
      const { container } = render(
        <EmploymentEarningsHoursReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Daily hours');
      expect(text).to.include('8');
    });

    it('should display weekly hours', () => {
      const data = {
        employmentEarningsHours: {
          weeklyHours: '40',
        },
      };
      const { container } = render(
        <EmploymentEarningsHoursReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Weekly hours');
      expect(text).to.include('40');
    });
  });

  describe('Missing Data Handling', () => {
    it('should display "Not provided" for missing fields', () => {
      const data = {
        employmentEarningsHours: {
          amountEarned: '',
        },
      };
      const { container } = render(
        <EmploymentEarningsHoursReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should handle undefined employmentEarningsHours', () => {
      const data = {};
      const { container } = render(
        <EmploymentEarningsHoursReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should handle null data', () => {
      const data = {
        employmentEarningsHours: null,
      };
      const { container } = render(
        <EmploymentEarningsHoursReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });
  });
});
