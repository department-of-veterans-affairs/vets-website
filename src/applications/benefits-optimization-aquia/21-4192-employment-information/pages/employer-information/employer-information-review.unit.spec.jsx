/**
 * @module tests/reviews/employer-information-review.unit.spec
 * @description Unit tests for EmployerInformationReview component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { EmployerInformationReview } from './employer-information-review';

describe('EmployerInformationReview', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Employer information';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <EmployerInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <EmployerInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Employer information');
    });

    it('should show not provided when no employer information', () => {
      const { container } = render(
        <EmployerInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Not provided');
    });
  });

  describe('Data Display', () => {
    it('should display Starfleet Command employer information', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Command',
          employerAddress: {
            street: 'Starfleet Headquarters',
            street2: 'Building One',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94102',
          },
          phoneNumber: '415-555-1234',
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Starfleet Command');
      expect(container.textContent).to.include('Starfleet Headquarters');
      expect(container.textContent).to.include('Building One');
      expect(container.textContent).to.include('San Francisco');
      expect(container.textContent).to.include('CA 94102');
      expect(container.textContent).to.include('415-555-1234');
    });

    it('should display USS Enterprise employer information', () => {
      const data = {
        employerInformation: {
          employerName: 'USS Enterprise (NCC-1701)',
          employerAddress: {
            street: 'Starbase 11',
            city: 'Deep Space',
            state: 'CA',
            postalCode: '90210',
          },
          phoneNumber: '555-170-1234',
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('USS Enterprise (NCC-1701)');
      expect(container.textContent).to.include('Starbase 11');
      expect(container.textContent).to.include('Deep Space');
      expect(container.textContent).to.include('555-170-1234');
    });

    it('should display address without street2', () => {
      const data = {
        employerInformation: {
          employerName: 'Deep Space Nine',
          employerAddress: {
            street: 'Bajoran Sector',
            city: 'Bajor',
            state: 'NY',
            postalCode: '10001',
          },
          phoneNumber: '212-555-9876',
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Deep Space Nine');
      expect(container.textContent).to.include('Bajoran Sector');
      expect(container.textContent).to.include('Bajor');
      expect(container.textContent).to.include('NY 10001');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <EmployerInformationReview
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
        <EmployerInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
      expect(editButton.getAttribute('text')).to.equal('Edit');
    });

    it('should have secondary button style', () => {
      const { container } = render(
        <EmployerInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton.hasAttribute('secondary')).to.be.true;
    });

    it('should use uswds style', () => {
      const { container } = render(
        <EmployerInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton.hasAttribute('uswds')).to.be.true;
    });
  });

  describe('Field Labels', () => {
    it('should display all field labels', () => {
      const { container } = render(
        <EmployerInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Name of employer');
      expect(container.textContent).to.include('Employer address');
      expect(container.textContent).to.include('Phone number');
    });
  });

  describe('Missing Data Handling', () => {
    it('should show not provided for missing employer name', () => {
      const data = {
        employerInformation: {
          employerAddress: {
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94102',
          },
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      const nameRow = reviewRows[0];
      expect(nameRow.textContent).to.include('Not provided');
    });

    it('should show not provided for missing address', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Command',
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      const addressRow = reviewRows[1];
      expect(addressRow.textContent).to.include('Not provided');
    });

    it('should show not provided for missing phone number', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Command',
          employerAddress: {
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94102',
          },
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      const phoneRow = reviewRows[2];
      expect(phoneRow.textContent).to.include('Not provided');
    });
  });

  describe('Address Formatting', () => {
    it('should format complete address with all fields', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Command',
          employerAddress: {
            street: 'Building 1',
            street2: 'Suite 100',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94102',
          },
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Building 1');
      expect(container.textContent).to.include('Suite 100');
      expect(container.textContent).to.include('San Francisco');
      expect(container.textContent).to.include('CA 94102');
    });

    it('should format address without street2', () => {
      const data = {
        employerInformation: {
          employerAddress: {
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94102',
          },
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('123 Main St');
      expect(container.textContent).to.include('San Francisco');
      expect(container.textContent).to.include('CA 94102');
    });

    it('should handle address with only street', () => {
      const data = {
        employerInformation: {
          employerAddress: {
            street: '456 Security Blvd',
          },
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('456 Security Blvd');
    });

    it('should handle address with state but no postal code', () => {
      const data = {
        employerInformation: {
          employerAddress: {
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
          },
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('123 Main St');
      expect(container.textContent).to.include('San Francisco');
      expect(container.textContent).to.include('CA');
    });

    it('should handle address with postal code but no state', () => {
      const data = {
        employerInformation: {
          employerAddress: {
            street: '123 Main St',
            city: 'San Francisco',
            postalCode: '94102',
          },
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('123 Main St');
      expect(container.textContent).to.include('San Francisco');
      expect(container.textContent).to.include('94102');
    });

    it('should handle empty address object', () => {
      const data = {
        employerInformation: {
          employerAddress: {},
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      const addressRow = reviewRows[1];
      expect(addressRow.textContent).to.include('Not provided');
    });
  });

  describe('Data Structure Variations', () => {
    it('should handle missing employerInformation object', () => {
      const data = {};

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null employerInformation', () => {
      const data = {
        employerInformation: null,
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle undefined data.employerInformation', () => {
      const data = {
        employerInformation: undefined,
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle null employerAddress', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Command',
          employerAddress: null,
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Review Row Structure', () => {
    it('should have correct number of review rows', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Command',
          employerAddress: {
            street: 'HQ',
            city: 'SF',
            state: 'CA',
            postalCode: '94102',
          },
          phoneNumber: '4155551234',
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      expect(reviewRows).to.have.lengthOf(3);
    });

    it('should have dt and dd elements for each row', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Command',
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const reviewRows = container.querySelectorAll('.review-row');
      reviewRows.forEach(row => {
        expect(row.querySelector('dt')).to.exist;
        expect(row.querySelector('dd')).to.exist;
      });
    });
  });

  describe('CSS Classes', () => {
    it('should have correct container class', () => {
      const { container } = render(
        <EmployerInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.querySelector('.form-review-panel-page')).to.exist;
    });

    it('should have review class on dl element', () => {
      const { container } = render(
        <EmployerInformationReview
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.querySelector('dl.review')).to.exist;
    });
  });

  describe('Different Star Trek Employers', () => {
    it('should display Vulcan Science Academy', () => {
      const data = {
        employerInformation: {
          employerName: 'Vulcan Science Academy',
          employerAddress: {
            street: 'Mount Seleya',
            city: 'ShiKahr',
            state: 'CA',
            postalCode: '91234',
          },
          phoneNumber: '555-555-1234',
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Vulcan Science Academy');
      expect(container.textContent).to.include('Mount Seleya');
      expect(container.textContent).to.include('ShiKahr');
    });

    it('should display Klingon Defense Force', () => {
      const data = {
        employerInformation: {
          employerName: 'Klingon Defense Force',
          employerAddress: {
            street: 'First City',
            city: "Qo'noS",
            state: 'NY',
            postalCode: '10001',
          },
          phoneNumber: '212-555-1701',
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Klingon Defense Force');
      expect(container.textContent).to.include('First City');
      expect(container.textContent).to.include("Qo'noS");
    });

    it('should display Starfleet Academy', () => {
      const data = {
        employerInformation: {
          employerName: 'Starfleet Academy',
          employerAddress: {
            street: 'Academy Grounds',
            street2: 'Cadet Quarters',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94102',
          },
          phoneNumber: '415-555-ACAD',
        },
      };

      const { container } = render(
        <EmployerInformationReview
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Starfleet Academy');
      expect(container.textContent).to.include('Academy Grounds');
      expect(container.textContent).to.include('Cadet Quarters');
    });
  });
});
