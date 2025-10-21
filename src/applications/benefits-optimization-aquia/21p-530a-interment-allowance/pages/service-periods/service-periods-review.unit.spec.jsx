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

  describe('Multiple Service Periods Display', () => {
    it('should display period numbers for multiple periods', () => {
      const data = {
        servicePeriods: {
          servicePeriods: [
            {
              branchOfService: 'army',
              dateFrom: '1941-05-04',
              dateTo: '1945-05-08',
              placeOfEntry: 'Tatooine',
              placeOfSeparation: 'Coruscant',
              rank: 'Padawan',
            },
            {
              branchOfService: 'navy',
              dateFrom: '1945-05-09',
              dateTo: '1960-12-31',
              placeOfEntry: 'Coruscant Jedi Temple',
              placeOfSeparation: 'Mustafar',
              rank: 'Jedi Knight',
            },
            {
              branchOfService: 'space force',
              dateFrom: '1965-05-20',
              dateTo: '1984-05-04',
              placeOfEntry: 'Death Star I',
              placeOfSeparation: 'Death Star II',
              rank: 'Supreme Commander',
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
      expect(container.textContent).to.include('space force');

      expect(container.textContent).to.include('Branch of service 1');
      expect(container.textContent).to.include('Branch of service 2');
      expect(container.textContent).to.include('Branch of service 3');
    });

    it('should not display period number for single period', () => {
      const data = {
        servicePeriods: {
          servicePeriods: [
            {
              branchOfService: 'army',
              dateFrom: '1962-01-01',
              dateTo: '1965-05-19',
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

      expect(container.textContent).to.not.include('Branch of service 1');
      expect(container.textContent).to.include('Branch of service');
    });

    it('should render dividers between periods', () => {
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

      const dividers = container.querySelectorAll(
        '.vads-u-border-top--1px.vads-u-border-color--gray-light',
      );
      expect(dividers.length).to.be.at.least(1);
    });
  });

  describe('Field Display with Different Data', () => {
    it('should display all fields when all data provided', () => {
      const data = {
        servicePeriods: {
          servicePeriods: [
            {
              branchOfService: 'navy',
              dateFrom: '1977-05-25',
              dateTo: '1983-05-25',
              placeOfEntry: 'Alderaan',
              placeOfSeparation: 'Endor',
              rank: 'Princess / General',
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

      expect(container.textContent).to.include('Branch of service');
      expect(container.textContent).to.include('Service start date');
      expect(container.textContent).to.include('Service end date');
      expect(container.textContent).to.include('Place of entry');
      expect(container.textContent).to.include('Place of separation');
      expect(container.textContent).to.include('Grade, rank, or rating');

      expect(container.textContent).to.include('navy');
      expect(container.textContent).to.include('Alderaan');
      expect(container.textContent).to.include('Endor');
      expect(container.textContent).to.include('Princess / General');
    });

    it('should hide empty fields with hideWhenEmpty', () => {
      const data = {
        servicePeriods: {
          servicePeriods: [
            {
              branchOfService: 'army',
              dateFrom: '1962-01-01',
              dateTo: '1965-05-19',
              placeOfEntry: '',
              placeOfSeparation: '',
              rank: '',
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
      expect(container.textContent).to.include('Branch of service');
    });

    it('should handle periods with only required fields', () => {
      const data = {
        servicePeriods: {
          servicePeriods: [
            {
              branchOfService: 'coast guard',
              dateFrom: '2000-01-01',
              dateTo: '2004-12-31',
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

      expect(container.textContent).to.include('coast guard');
    });

    it('should handle undefined optional fields', () => {
      const data = {
        servicePeriods: {
          servicePeriods: [
            {
              branchOfService: 'marine corps',
              dateFrom: '1995-01-01',
              dateTo: '1999-12-31',
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

      expect(container.textContent).to.include('marine corps');
    });
  });

  describe('Data Structure Variations', () => {
    it('should handle empty servicePeriods array', () => {
      const data = {
        servicePeriods: {
          servicePeriods: [],
        },
      };

      const { container } = render(
        <ServicePeriodsReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should handle missing servicePeriods array', () => {
      const data = {
        servicePeriods: {},
      };

      const { container } = render(
        <ServicePeriodsReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should handle null servicePeriods', () => {
      const data = {
        servicePeriods: null,
      };

      const { container } = render(
        <ServicePeriodsReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });

    it('should handle undefined data.servicePeriods', () => {
      const data = {};

      const { container } = render(
        <ServicePeriodsReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });
  });

  describe('Date Field Display', () => {
    it('should display formatted dates', () => {
      const data = {
        servicePeriods: {
          servicePeriods: [
            {
              branchOfService: 'army',
              dateFrom: '1941-05-04',
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

      expect(container.textContent).to.include('Service start date');
      expect(container.textContent).to.include('Service end date');
    });

    it('should handle missing dates', () => {
      const data = {
        servicePeriods: {
          servicePeriods: [
            {
              branchOfService: 'navy',
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

      expect(container.textContent).to.include('navy');
    });
  });

  describe('Different Branch Types', () => {
    it('should display all supported branch types', () => {
      const branches = [
        'air force',
        'army',
        'coast guard',
        'marine corps',
        'navy',
        'space force',
      ];

      branches.forEach(branch => {
        const data = {
          servicePeriods: {
            servicePeriods: [
              {
                branchOfService: branch,
                dateFrom: '2000-01-01',
                dateTo: '2004-12-31',
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

        expect(container.textContent).to.include(branch);
      });
    });
  });
});
