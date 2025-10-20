/**
 * @module tests/pages/employment-dates-details-review.unit.spec
 * @description Unit tests for Employment Dates and Details review component
 */

import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { EmploymentDatesDetailsReview } from './employment-dates-details-review';

describe('EmploymentDatesDetailsReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Employment dates and details';

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const data = {
        employmentDatesDetails: {
          beginningDate: '2250-01-01',
          endingDate: '2265-12-31',
          typeOfWork: 'Starship Command',
          amountEarned: '75000',
          timeLost: '30 days',
          dailyHours: '8',
          weeklyHours: '40',
        },
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should display title', () => {
      const data = {
        employmentDatesDetails: {},
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
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
        employmentDatesDetails: {},
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
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
    it('should display formatted beginning date', () => {
      const data = {
        employmentDatesDetails: {
          beginningDate: '2250-01-01',
        },
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Beginning date');
      expect(text).to.include('2250');
    });

    it('should display formatted ending date', () => {
      const data = {
        employmentDatesDetails: {
          endingDate: '2265-12-31',
        },
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Ending date');
      expect(text).to.include('2265');
    });

    it('should display type of work', () => {
      const data = {
        employmentDatesDetails: {
          typeOfWork: 'Commanding officer of USS Enterprise',
        },
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Type of work');
      expect(text).to.include('Commanding officer of USS Enterprise');
    });

    it('should display amount earned', () => {
      const data = {
        employmentDatesDetails: {
          amountEarned: '75000',
        },
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Amount earned');
      expect(text).to.include('75000');
    });

    it('should display time lost', () => {
      const data = {
        employmentDatesDetails: {
          timeLost: '30 days medical leave',
        },
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Time lost');
      expect(text).to.include('30 days medical leave');
    });

    it('should display daily hours', () => {
      const data = {
        employmentDatesDetails: {
          dailyHours: '8',
        },
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
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
        employmentDatesDetails: {
          weeklyHours: '40',
        },
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Weekly hours');
      expect(text).to.include('40');
    });

    it('should display all Star Trek themed employment data', () => {
      const data = {
        employmentDatesDetails: {
          beginningDate: '2233-03-22',
          endingDate: '2293-12-31',
          typeOfWork: 'Starfleet Command Operations',
          amountEarned: '125000',
          timeLost: '2 weeks sickbay recovery',
          dailyHours: '10',
          weeklyHours: '50',
        },
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Starfleet Command Operations');
      expect(text).to.include('125000');
      expect(text).to.include('2 weeks sickbay recovery');
      expect(text).to.include('10');
      expect(text).to.include('50');
    });
  });

  describe('Missing Data Handling', () => {
    it('should display "Not provided" for missing beginning date', () => {
      const data = {
        employmentDatesDetails: {
          beginningDate: '',
        },
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should display "Not provided" for missing type of work', () => {
      const data = {
        employmentDatesDetails: {
          typeOfWork: '',
        },
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should handle undefined employmentDatesDetails', () => {
      const data = {};
      const { container } = render(
        <EmploymentDatesDetailsReview
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
        employmentDatesDetails: null,
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle partial data', () => {
      const data = {
        employmentDatesDetails: {
          beginningDate: '2250-01-01',
        },
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('2250');
      expect(text).to.include('Not provided');
    });
  });

  describe('Date Formatting', () => {
    it('should format date in US locale', () => {
      const data = {
        employmentDatesDetails: {
          beginningDate: '2250-01-15',
        },
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('January');
      expect(text).to.include('15');
      expect(text).to.include('2250');
    });

    it('should handle Star Trek birth date formatting', () => {
      const data = {
        employmentDatesDetails: {
          beginningDate: '2233-03-22',
        },
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('March');
      expect(text).to.include('22');
      expect(text).to.include('2233');
    });

    it('should handle invalid date gracefully', () => {
      const data = {
        employmentDatesDetails: {
          beginningDate: 'invalid-date',
        },
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });
  });

  describe('Edit Functionality', () => {
    it('should accept editPage prop', () => {
      const data = {
        employmentDatesDetails: {},
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });

    it('should have secondary button styling', () => {
      const data = {
        employmentDatesDetails: {},
      };
      const { container } = render(
        <EmploymentDatesDetailsReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const editButton = container.querySelector('va-button');
      expect(editButton.hasAttribute('secondary')).to.be.true;
    });
  });
});
