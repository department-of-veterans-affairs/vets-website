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
              dateFrom: '2010-01-01',
              dateTo: '2014-12-31',
              placeOfEntry: 'Fort Benning, GA',
              placeOfSeparation: 'Fort Hood, TX',
              rank: 'Sergeant',
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
      expect(container.textContent).to.include('Fort Benning, GA');
      expect(container.textContent).to.include('Sergeant');
    });

    it('should display multiple service periods', () => {
      const data = {
        servicePeriods: {
          servicePeriods: [
            {
              branchOfService: 'army',
              dateFrom: '2010-01-01',
              dateTo: '2014-12-31',
            },
            {
              branchOfService: 'navy',
              dateFrom: '2015-01-01',
              dateTo: '2019-12-31',
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
