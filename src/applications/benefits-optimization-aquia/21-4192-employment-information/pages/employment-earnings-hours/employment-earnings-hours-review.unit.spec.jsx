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
    it('should display type of work', () => {
      const data = {
        employmentEarningsHours: {
          typeOfWork: 'Software Engineer',
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
      expect(text).to.include('What type of work');
      expect(text).to.include('Software Engineer');
    });

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
      expect(text).to.include('How much');
      expect(text).to.include('earn');
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
      expect(text).to.include('How much time');
      expect(text).to.include('disability');
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
      expect(text).to.include('How many hours');
      expect(text).to.include('each day');
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
      expect(text).to.include('How many hours');
      expect(text).to.include('each week');
      expect(text).to.include('40');
    });

    it('should use correct tense for currently employed', () => {
      const data = {
        employmentDates: {
          currentlyEmployed: true,
        },
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
      expect(text).to.include('does');
      expect(text).to.include('last 12 months');
    });

    it('should use correct tense for not currently employed', () => {
      const data = {
        employmentDates: {
          currentlyEmployed: false,
        },
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
      expect(text).to.include('did');
      expect(text).to.include('12 months before their last date of employment');
    });

    it('should use veteran name in labels', () => {
      const data = {
        veteranInformation: {
          firstName: 'Boba',
          lastName: 'Fett',
        },
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
      expect(text).to.include('Boba Fett');
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
