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
    it('should display complete employer information', () => {
      const data = {
        employerInformation: {
          employerName: 'Bounty Hunters Guild',
          employerAddress: {
            street: 'Guild Headquarters',
            street2: 'Building One',
            city: 'Mos Eisley',
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

      expect(container.textContent).to.include('Bounty Hunters Guild');
      expect(container.textContent).to.include('Guild Headquarters');
      expect(container.textContent).to.include('Building One');
      expect(container.textContent).to.include('Mos Eisley');
      expect(container.textContent).to.include('CA 94102');
    });

    it('should display Slave I employer information', () => {
      const data = {
        employerInformation: {
          employerName: 'Slave I',
          employerAddress: {
            street: 'Nar Shaddaa Sector 11',
            city: 'Nar Shaddaa',
            state: 'CA',
            postalCode: '90210',
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

      expect(container.textContent).to.include('Slave I');
      expect(container.textContent).to.include('Nar Shaddaa Sector 11');
      expect(container.textContent).to.include('Nar Shaddaa');
    });

    it('should display address without street2', () => {
      const data = {
        employerInformation: {
          employerName: 'Mos Eisley Cantina',
          employerAddress: {
            street: 'Outer Rim Sector',
            city: 'Bajor',
            state: 'NY',
            postalCode: '10001',
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

      expect(container.textContent).to.include('Mos Eisley Cantina');
      expect(container.textContent).to.include('Outer Rim Sector');
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
      expect(container.textContent).to.include('Employer’s address');
    });
  });

  describe('Missing Data Handling', () => {
    it('should show not provided for missing employer name', () => {
      const data = {
        employerInformation: {
          employerAddress: {
            street: '123 Main St',
            city: 'Mos Eisley',
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
          employerName: 'Bounty Hunters Guild',
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

  describe('Address Formatting', () => {
    it('should format complete address with all fields', () => {
      const data = {
        employerInformation: {
          employerName: 'Bounty Hunters Guild',
          employerAddress: {
            street: 'Building 1',
            street2: 'Suite 100',
            city: 'Mos Eisley',
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
      expect(container.textContent).to.include('Mos Eisley');
      expect(container.textContent).to.include('CA 94102');
    });

    it('should format address without street2', () => {
      const data = {
        employerInformation: {
          employerAddress: {
            street: '123 Main St',
            city: 'Mos Eisley',
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
      expect(container.textContent).to.include('Mos Eisley');
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
            city: 'Mos Eisley',
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
      expect(container.textContent).to.include('Mos Eisley');
      expect(container.textContent).to.include('CA');
    });

    it('should handle address with postal code but no state', () => {
      const data = {
        employerInformation: {
          employerAddress: {
            street: '123 Main St',
            city: 'Mos Eisley',
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
      expect(container.textContent).to.include('Mos Eisley');
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
          employerName: 'Bounty Hunters Guild',
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
          employerName: 'Bounty Hunters Guild',
          employerAddress: {
            street: 'HQ',
            city: 'SF',
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
      expect(reviewRows).to.have.lengthOf(2);
    });

    it('should have dt and dd elements for each row', () => {
      const data = {
        employerInformation: {
          employerName: 'Bounty Hunters Guild',
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

  describe('Multiple Employer Scenarios', () => {
    it('should display Mandalorian Training Corps', () => {
      const data = {
        employerInformation: {
          employerName: 'Mandalorian Training Corps',
          employerAddress: {
            street: 'Mount Seleya',
            city: 'ShiKahr',
            state: 'CA',
            postalCode: '91234',
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

      expect(container.textContent).to.include('Mandalorian Training Corps');
      expect(container.textContent).to.include('Mount Seleya');
      expect(container.textContent).to.include('ShiKahr');
    });

    it('should display Hutt Cartel', () => {
      const data = {
        employerInformation: {
          employerName: 'Hutt Cartel',
          employerAddress: {
            street: 'First City',
            city: "Qo'noS",
            state: 'NY',
            postalCode: '10001',
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

      expect(container.textContent).to.include('Hutt Cartel');
      expect(container.textContent).to.include('First City');
      expect(container.textContent).to.include("Qo'noS");
    });

    it('should display Kamino Cloning Facility', () => {
      const data = {
        employerInformation: {
          employerName: 'Kamino Cloning Facility',
          employerAddress: {
            street: 'Academy Grounds',
            street2: 'Cadet Quarters',
            city: 'Mos Eisley',
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

      expect(container.textContent).to.include('Kamino Cloning Facility');
      expect(container.textContent).to.include('Academy Grounds');
      expect(container.textContent).to.include('Cadet Quarters');
    });
  });
});
