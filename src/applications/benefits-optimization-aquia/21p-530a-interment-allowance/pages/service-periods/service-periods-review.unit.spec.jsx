/**
 * @module tests/pages/service-periods-review.unit.spec
 * @description Unit tests for ServicePeriodsReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ServicePeriodsReviewPage } from './service-periods-review';

describe('ServicePeriodsReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Service periods';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ServicePeriodsReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <ServicePeriodsReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Service periods');
    });

    it('should show not provided when no service periods', () => {
      const { container } = render(
        <ServicePeriodsReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });
  });

  describe('Data Display', () => {
    it('should display single service period', () => {
      const data = {
        servicePeriods: {
          servicePeriods: [
            {
              branchOfService: 'army',
              dateFrom: '1962-01-01',
              dateTo: '1965-05-19',
              placeOfEntry: 'Coruscant Jedi Temple',
              placeOfSeparation: 'Mustafar',
              rank: 'Jedi Knight / General',
            },
          ],
        },
      };

      const { container } = render(
        <ServicePeriodsReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('army');
      expect(container.textContent).to.include('Coruscant Jedi Temple');
      expect(container.textContent).to.include('Jedi Knight / General');
    });

    it('should display multiple service periods', () => {
      const data = {
        servicePeriods: {
          servicePeriods: [
            {
              branchOfService: 'army',
              dateFrom: '1962-01-01',
              dateTo: '1965-05-19',
            },
            {
              branchOfService: 'navy',
              dateFrom: '1965-05-20',
              dateTo: '1984-05-04',
            },
          ],
        },
      };

      const { container } = render(
        <ServicePeriodsReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('army');
      expect(container.textContent).to.include('navy');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <ServicePeriodsReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Edit Functionality', () => {
    it('should render edit button', () => {
      const { container } = render(
        <ServicePeriodsReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });
});
