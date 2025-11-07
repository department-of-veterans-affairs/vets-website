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
          currentlyEmployed: false,
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
          currentlyEmployed: false,
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
      expect(text).to.include('start working');
      expect(text).to.include('2010');
    });

    it('should display formatted ending date when not currently employed', () => {
      const data = {
        employmentDates: {
          endingDate: '2015-12-31',
          currentlyEmployed: false,
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
      expect(text).to.include('stop working');
      expect(text).to.include('2015');
    });

    it('should display currently employed status', () => {
      const data = {
        employmentDates: {
          beginningDate: '2010-01-01',
          currentlyEmployed: true,
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
      expect(text).to.include('Currently employed');
      expect(text).to.include('Yes');
    });

    it('should not display ending date when currently employed', () => {
      const data = {
        employmentDates: {
          beginningDate: '2010-01-01',
          endingDate: '2015-12-31',
          currentlyEmployed: true,
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
      expect(text).to.include('Yes');
      expect(text).to.not.include('stop working');
    });

    it('should display all employment dates data', () => {
      const data = {
        employmentDates: {
          beginningDate: '1985-03-22',
          endingDate: '2020-12-31',
          currentlyEmployed: false,
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
      expect(text).to.include('1985');
      expect(text).to.include('2020');
    });

    it('should use veteran name in labels', () => {
      const data = {
        veteranInformation: {
          firstName: 'Boba',
          lastName: 'Fett',
        },
        employerInformation: {
          employerName: 'Bounty Hunters Guild',
        },
        employmentDates: {
          beginningDate: '2010-01-01',
          currentlyEmployed: false,
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
      expect(text).to.include('Boba Fett');
      expect(text).to.include('Bounty Hunters Guild');
    });
  });

  describe('Missing Data Handling', () => {
    it('should display "Not provided" for missing beginning date', () => {
      const data = {
        employmentDates: {
          beginningDate: '',
          currentlyEmployed: false,
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
          currentlyEmployed: false,
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

    it('should use fallback names when veteran info missing', () => {
      const data = {
        employmentDates: {
          beginningDate: '2010-01-01',
          currentlyEmployed: false,
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
      expect(text).to.include('Veteran');
      expect(text).to.include('this employer');
    });
  });

  describe('Date Formatting', () => {
    it('should format date in US locale', () => {
      const data = {
        employmentDates: {
          beginningDate: '2010-01-15',
          currentlyEmployed: false,
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
          currentlyEmployed: false,
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
          currentlyEmployed: false,
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
