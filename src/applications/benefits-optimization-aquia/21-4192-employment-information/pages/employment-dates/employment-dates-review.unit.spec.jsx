/**
 * @module tests/pages/employment-dates-review.unit.spec
 * @description Unit tests for Employment Dates review component
 */

import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { EmploymentDatesReview } from './employment-dates-review';

describe('EmploymentDatesReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Employment dates';

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const data = {
        employmentDates: {
          beginningDate: '2010-01-01',
          endingDate: '2015-12-31',
          typeOfWork: 'Starship Command',
        },
      };
      const { container } = render(
        <EmploymentDatesReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should display title', () => {
      const data = {
        employmentDates: {},
      };
      const { container } = render(
        <EmploymentDatesReview
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
        employmentDates: {},
      };
      const { container } = render(
        <EmploymentDatesReview
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
        employmentDates: {
          beginningDate: '2010-01-01',
        },
      };
      const { container } = render(
        <EmploymentDatesReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Beginning date');
      expect(text).to.include('2010');
    });

    it('should display formatted ending date', () => {
      const data = {
        employmentDates: {
          endingDate: '2015-12-31',
        },
      };
      const { container } = render(
        <EmploymentDatesReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Ending date');
      expect(text).to.include('2015');
    });

    it('should display type of work', () => {
      const data = {
        employmentDates: {
          typeOfWork: 'Commanding officer of Slave I',
        },
      };
      const { container } = render(
        <EmploymentDatesReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Type of work');
      expect(text).to.include('Commanding officer of Slave I');
    });

    it('should display all employment dates data', () => {
      const data = {
        employmentDates: {
          beginningDate: '1985-03-22',
          endingDate: '2020-12-31',
          typeOfWork: 'Bounty Hunters Guild Operations',
        },
      };
      const { container } = render(
        <EmploymentDatesReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Bounty Hunters Guild Operations');
    });
  });

  describe('Missing Data Handling', () => {
    it('should display "Not provided" for missing beginning date', () => {
      const data = {
        employmentDates: {
          beginningDate: '',
        },
      };
      const { container } = render(
        <EmploymentDatesReview
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
        employmentDates: {
          typeOfWork: '',
        },
      };
      const { container } = render(
        <EmploymentDatesReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should handle undefined employmentDates', () => {
      const data = {};
      const { container } = render(
        <EmploymentDatesReview
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
        employmentDates: null,
      };
      const { container } = render(
        <EmploymentDatesReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle partial data', () => {
      const data = {
        employmentDates: {
          beginningDate: '2010-01-01',
        },
      };
      const { container } = render(
        <EmploymentDatesReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('2010');
      expect(text).to.include('Not provided');
    });
  });

  describe('Date Formatting', () => {
    it('should format date in US locale', () => {
      const data = {
        employmentDates: {
          beginningDate: '2010-01-15',
        },
      };
      const { container } = render(
        <EmploymentDatesReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('January');
      expect(text).to.include('15');
      expect(text).to.include('2010');
    });

    it('should handle birth date formatting', () => {
      const data = {
        employmentDates: {
          beginningDate: '1985-03-22',
        },
      };
      const { container } = render(
        <EmploymentDatesReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('March');
      expect(text).to.include('22');
      expect(text).to.include('1985');
    });

    it('should handle invalid date gracefully', () => {
      const data = {
        employmentDates: {
          beginningDate: 'invalid-date',
        },
      };
      const { container } = render(
        <EmploymentDatesReview
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
        employmentDates: {},
      };
      const { container } = render(
        <EmploymentDatesReview
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
        employmentDates: {},
      };
      const { container } = render(
        <EmploymentDatesReview
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
