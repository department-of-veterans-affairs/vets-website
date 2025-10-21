/**
 * @module tests/pages/employment-termination-review.unit.spec
 * @description Unit tests for Employment Termination review component
 */

import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { EmploymentTerminationReview } from './employment-termination-review';

describe('EmploymentTerminationReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Employment termination';

  describe('Component Rendering', () => {
    it('should render the component', () => {
      const data = {
        employmentTermination: {
          terminationReason: 'Retired on disability',
          dateLastWorked: '2020-12-31',
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should display title', () => {
      const data = {
        employmentTermination: {},
      };
      const { container } = render(
        <EmploymentTerminationReview
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
        employmentTermination: {},
      };
      const { container } = render(
        <EmploymentTerminationReview
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
    it('should display termination reason', () => {
      const data = {
        employmentTermination: {
          terminationReason: 'Retired on disability',
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Reason for termination of employment');
      expect(text).to.include('Retired on disability');
    });

    it('should display formatted date last worked', () => {
      const data = {
        employmentTermination: {
          dateLastWorked: '2020-12-31',
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Date last worked');
      expect(text).to.include('2020');
    });

    it('should display themed termination reason', () => {
      const data = {
        employmentTermination: {
          terminationReason:
            'Medical discharge from Guild due to service-related injuries',
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Medical discharge from Guild');
    });

    it('should display all employment termination data', () => {
      const data = {
        employmentTermination: {
          terminationReason:
            'Honorable medical discharge from Bounty Hunters Guild',
          dateLastWorked: '2020-10-15',
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Honorable medical discharge');
      expect(text).to.include('2020');
    });
  });

  describe('Missing Data Handling', () => {
    it('should display "Not provided" for missing termination reason', () => {
      const data = {
        employmentTermination: {
          terminationReason: '',
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should display "Not provided" for missing date last worked', () => {
      const data = {
        employmentTermination: {
          dateLastWorked: '',
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Not provided');
    });

    it('should handle undefined employmentTermination', () => {
      const data = {};
      const { container } = render(
        <EmploymentTerminationReview
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
        employmentTermination: null,
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should handle partial data', () => {
      const data = {
        employmentTermination: {
          terminationReason: 'Retired',
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Retired');
      expect(text).to.include('Not provided');
    });
  });

  describe('Date Formatting', () => {
    it('should format date in US locale', () => {
      const data = {
        employmentTermination: {
          dateLastWorked: '2020-12-31',
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('December');
      expect(text).to.include('31');
      expect(text).to.include('2020');
    });

    it('should format recent date', () => {
      const data = {
        employmentTermination: {
          dateLastWorked: '2023-06-15',
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('June');
      expect(text).to.include('15');
      expect(text).to.include('2023');
    });

    it('should handle invalid date gracefully', () => {
      const data = {
        employmentTermination: {
          dateLastWorked: 'invalid-date',
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      expect(container).to.exist;
    });

    it('should format old date', () => {
      const data = {
        employmentTermination: {
          dateLastWorked: '1990-01-15',
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('January');
      expect(text).to.include('15');
      expect(text).to.include('1990');
    });
  });

  describe('Text Display', () => {
    it('should display long termination reason', () => {
      const data = {
        employmentTermination: {
          terminationReason: 'A'.repeat(1000),
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('A'.repeat(1000));
    });

    it('should preserve multi-line termination reason', () => {
      const data = {
        employmentTermination: {
          terminationReason: 'First line\nSecond line\nThird line',
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
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
        employmentTermination: {},
      };
      const { container } = render(
        <EmploymentTerminationReview
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
        employmentTermination: {},
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const editButton = container.querySelector('va-button');
      expect(editButton.hasAttribute('secondary')).to.be.true;
    });
  });

  describe('Additional Test Cases', () => {
    it('should display Guild medical retirement', () => {
      const data = {
        employmentTermination: {
          terminationReason:
            'Honorable medical discharge from Guild after sustaining injuries during diplomatic mission',
          dateLastWorked: '2020-11-30',
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('Guild');
      expect(text).to.include('November');
      expect(text).to.include('30');
      expect(text).to.include('2020');
    });

    it('should display retirement after long service', () => {
      const data = {
        employmentTermination: {
          terminationReason:
            'Retired after 30 years of service in Bounty Hunters Guild',
          dateLastWorked: '2020-12-31',
        },
      };
      const { container } = render(
        <EmploymentTerminationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );
      const text = container.textContent;
      expect(text).to.include('30 years');
      expect(text).to.include('Bounty Hunters Guild');
    });
  });
});
