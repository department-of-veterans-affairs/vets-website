/**
 * @module tests/config/submit-transform/transform.unit.spec
 * @description Unit tests for submission transform
 */

import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
import { transform } from './transform';

describe('Submit Transform', () => {
  let sentryStub;
  let withScopeStub;

  beforeEach(() => {
    sentryStub = sinon.stub(Sentry, 'captureMessage');
    withScopeStub = sinon.stub(Sentry, 'withScope').callsFake(callback => {
      const mockScope = {
        setExtra: sinon.stub(),
      };
      return callback(mockScope);
    });
  });

  afterEach(() => {
    sentryStub.restore();
    withScopeStub.restore();
  });

  describe('Basic Structure', () => {
    it('should export a transform function', () => {
      expect(transform).to.be.a('function');
    });

    it('should return a JSON string for valid data', () => {
      const minimalForm = {
        data: {
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: { fullName: {} },
          veteranBurialInformation: { cemeteryLocation: {} },
          servicePeriods: [],
          previousNames: [],
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = transform({}, minimalForm);

      expect(result).to.be.a('string');
      expect(() => JSON.parse(result)).to.not.throw();
    });

    it('should return parsed object with expected top-level keys', () => {
      const minimalForm = {
        data: {
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: { fullName: {} },
          veteranBurialInformation: { cemeteryLocation: {} },
          servicePeriods: [],
          previousNames: [],
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, minimalForm));

      expect(result).to.have.property('veteranInformation');
      expect(result).to.have.property('veteranServicePeriods');
      expect(result).to.have.property('burialInformation');
      expect(result).to.have.property('certification');
    });
  });

  describe('Date Padding (padDate)', () => {
    describe('Service Period Dates', () => {
      it('should pad single-digit day in service entry date', () => {
        const form = {
          data: {
            servicePeriods: [
              {
                branchOfService: 'Army',
                dateFrom: '2020-1-5',
                dateTo: '2022-12-15',
              },
            ],
            previousNames: [],
            organizationInformation: {},
            burialBenefitsRecipient: {},
            mailingAddress: { recipientAddress: {} },
            veteranIdentification: { fullName: {} },
            veteranBurialInformation: { cemeteryLocation: {} },
            additionalRemarks: {},
            certification: {},
          },
        };

        const result = JSON.parse(transform({}, form));

        expect(
          result.veteranServicePeriods.periods[0].dateEnteredService,
        ).to.equal('2020-01-05');
      });

      it('should pad single-digit month in service exit date', () => {
        const form = {
          data: {
            servicePeriods: [
              {
                branchOfService: 'Navy',
                dateFrom: '2020-01-05',
                dateTo: '2022-3-15',
              },
            ],
            previousNames: [],
            organizationInformation: {},
            burialBenefitsRecipient: {},
            mailingAddress: { recipientAddress: {} },
            veteranIdentification: { fullName: {} },
            veteranBurialInformation: { cemeteryLocation: {} },
            additionalRemarks: {},
            certification: {},
          },
        };

        const result = JSON.parse(transform({}, form));

        expect(
          result.veteranServicePeriods.periods[0].dateLeftService,
        ).to.equal('2022-03-15');
      });

      it('should pad both month and day when single digits', () => {
        const form = {
          data: {
            servicePeriods: [
              {
                branchOfService: 'Air Force',
                dateFrom: '2020-1-5',
                dateTo: '2022-3-8',
              },
            ],
            previousNames: [],
            organizationInformation: {},
            burialBenefitsRecipient: {},
            mailingAddress: { recipientAddress: {} },
            veteranIdentification: { fullName: {} },
            veteranBurialInformation: { cemeteryLocation: {} },
            additionalRemarks: {},
            certification: {},
          },
        };

        const result = JSON.parse(transform({}, form));

        expect(
          result.veteranServicePeriods.periods[0].dateEnteredService,
        ).to.equal('2020-01-05');
        expect(
          result.veteranServicePeriods.periods[0].dateLeftService,
        ).to.equal('2022-03-08');
      });

      it('should not modify already padded dates', () => {
        const form = {
          data: {
            servicePeriods: [
              {
                branchOfService: 'Marines',
                dateFrom: '2020-01-05',
                dateTo: '2022-12-15',
              },
            ],
            previousNames: [],
            organizationInformation: {},
            burialBenefitsRecipient: {},
            mailingAddress: { recipientAddress: {} },
            veteranIdentification: { fullName: {} },
            veteranBurialInformation: { cemeteryLocation: {} },
            additionalRemarks: {},
            certification: {},
          },
        };

        const result = JSON.parse(transform({}, form));

        expect(
          result.veteranServicePeriods.periods[0].dateEnteredService,
        ).to.equal('2020-01-05');
        expect(
          result.veteranServicePeriods.periods[0].dateLeftService,
        ).to.equal('2022-12-15');
      });
    });

    describe('Veteran Dates', () => {
      it('should pad single-digit day in date of birth', () => {
        const form = {
          data: {
            servicePeriods: [],
            previousNames: [],
            organizationInformation: {},
            burialBenefitsRecipient: {},
            mailingAddress: { recipientAddress: {} },
            veteranIdentification: {
              fullName: {},
              dateOfBirth: '1941-5-4',
            },
            veteranBurialInformation: {
              cemeteryLocation: {},
            },
            additionalRemarks: {},
            certification: {},
          },
        };

        const result = JSON.parse(transform({}, form));

        expect(result.veteranInformation.dateOfBirth).to.equal('1941-05-04');
      });

      it('should pad single-digit day in date of death', () => {
        const form = {
          data: {
            servicePeriods: [],
            previousNames: [],
            organizationInformation: {},
            burialBenefitsRecipient: {},
            mailingAddress: { recipientAddress: {} },
            veteranIdentification: {
              fullName: {},
            },
            veteranBurialInformation: {
              cemeteryLocation: {},
              dateOfDeath: '2023-7-9',
            },
            additionalRemarks: {},
            certification: {},
          },
        };

        const result = JSON.parse(transform({}, form));

        expect(result.veteranInformation.dateOfDeath).to.equal('2023-07-09');
      });

      it('should pad single-digit day in date of burial', () => {
        const form = {
          data: {
            servicePeriods: [],
            previousNames: [],
            organizationInformation: {},
            burialBenefitsRecipient: {},
            mailingAddress: { recipientAddress: {} },
            veteranIdentification: {
              fullName: {},
            },
            veteranBurialInformation: {
              cemeteryLocation: {},
              dateOfBurial: '2023-8-1',
            },
            additionalRemarks: {},
            certification: {},
          },
        };

        const result = JSON.parse(transform({}, form));

        expect(result.burialInformation.dateOfBurial).to.equal('2023-08-01');
      });
    });

    describe('Edge Cases for Date Padding', () => {
      it('should handle empty date strings', () => {
        const form = {
          data: {
            servicePeriods: [
              {
                branchOfService: 'Army',
                dateFrom: '',
                dateTo: '',
              },
            ],
            previousNames: [],
            organizationInformation: {},
            burialBenefitsRecipient: {},
            mailingAddress: { recipientAddress: {} },
            veteranIdentification: {
              fullName: {},
              dateOfBirth: '',
            },
            veteranBurialInformation: {
              cemeteryLocation: {},
              dateOfDeath: '',
              dateOfBurial: '',
            },
            additionalRemarks: {},
            certification: {},
          },
        };

        const result = JSON.parse(transform({}, form));

        expect(
          result.veteranServicePeriods.periods[0].dateEnteredService,
        ).to.equal('');
        expect(result.veteranInformation.dateOfBirth).to.equal('');
      });

      it('should handle undefined dates', () => {
        const form = {
          data: {
            servicePeriods: [
              {
                branchOfService: 'Navy',
              },
            ],
            previousNames: [],
            organizationInformation: {},
            burialBenefitsRecipient: {},
            mailingAddress: { recipientAddress: {} },
            veteranIdentification: {
              fullName: {},
            },
            veteranBurialInformation: {
              cemeteryLocation: {},
            },
            additionalRemarks: {},
            certification: {},
          },
        };

        const result = JSON.parse(transform({}, form));

        expect(
          result.veteranServicePeriods.periods[0].dateEnteredService,
        ).to.equal('');
      });

      it('should handle malformed date strings (not YYYY-MM-DD format)', () => {
        const form = {
          data: {
            servicePeriods: [],
            previousNames: [],
            organizationInformation: {},
            burialBenefitsRecipient: {},
            mailingAddress: { recipientAddress: {} },
            veteranIdentification: {
              fullName: {},
              dateOfBirth: 'invalid-date',
            },
            veteranBurialInformation: {
              cemeteryLocation: {},
            },
            additionalRemarks: {},
            certification: {},
          },
        };

        const result = JSON.parse(transform({}, form));

        // Should return the invalid date as-is
        expect(result.veteranInformation.dateOfBirth).to.equal('invalid-date');
      });
    });
  });

  describe('Veteran Information Transformation', () => {
    it('should transform full name correctly', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {
              first: 'Anakin',
              middle: 'Padmé',
              last: 'Skywalker',
            },
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.veteranInformation.fullName).to.deep.equal({
        first: 'Anakin',
        middle: 'P',
        last: 'Skywalker',
      });
    });

    it('should extract only first character of middle name', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {
              first: 'Luke',
              middle: 'Anakin',
              last: 'Skywalker',
            },
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.veteranInformation.fullName.middle).to.equal('A');
    });

    it('should handle missing middle name', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {
              first: 'Leia',
              last: 'Organa',
            },
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.veteranInformation.fullName.middle).to.be.undefined;
    });

    it('should strip dashes from SSN', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {},
            ssn: '501-66-7138',
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.veteranInformation.ssn).to.equal('501667138');
    });

    it('should include all veteran identification fields', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {
              first: 'Han',
              middle: 'Benjamin',
              last: 'Solo',
            },
            ssn: '212-77-4881',
            serviceNumber: 'SC-1138',
            vaFileNumber: '22387563',
            dateOfBirth: '1942-07-15',
            placeOfBirth: 'Corellia',
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
            dateOfDeath: '2023-12-25',
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.veteranInformation).to.deep.equal({
        fullName: {
          first: 'Han',
          middle: 'B',
          last: 'Solo',
        },
        ssn: '212774881',
        vaServiceNumber: 'SC-1138',
        vaFileNumber: '22387563',
        dateOfBirth: '1942-07-15',
        dateOfDeath: '2023-12-25',
        placeOfBirth: 'Corellia',
      });
    });
  });

  describe('Service Periods Transformation', () => {
    it('should transform single service period', () => {
      const form = {
        data: {
          servicePeriods: [
            {
              branchOfService: 'Army',
              dateFrom: '2010-01-15',
              dateTo: '2014-12-31',
              placeOfEntry: 'Fort Benning, GA',
              placeOfSeparation: 'Fort Hood, TX',
              rank: 'Captain',
            },
          ],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.periods).to.have.lengthOf(1);
      expect(result.veteranServicePeriods.periods[0]).to.deep.equal({
        serviceBranch: 'Army',
        dateEnteredService: '2010-01-15',
        placeEnteredService: 'Fort Benning, GA',
        rankAtSeparation: 'Captain',
        dateLeftService: '2014-12-31',
        placeLeftService: 'Fort Hood, TX',
      });
    });

    it('should transform multiple service periods', () => {
      const form = {
        data: {
          servicePeriods: [
            {
              branchOfService: 'Navy',
              dateFrom: '2005-03-01',
              dateTo: '2009-02-28',
              placeOfEntry: 'Naval Station Norfolk',
              placeOfSeparation: 'Naval Base San Diego',
              rank: 'Lieutenant',
            },
            {
              branchOfService: 'Air Force',
              dateFrom: '2010-06-15',
              dateTo: '2015-06-14',
              placeOfEntry: 'Lackland AFB, TX',
              placeOfSeparation: 'Peterson AFB, CO',
              rank: 'Major',
            },
          ],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.periods).to.have.lengthOf(2);
      expect(result.veteranServicePeriods.periods[1].serviceBranch).to.equal(
        'Air Force',
      );
    });

    it('should handle empty service periods array', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.periods).to.be.an('array').that.is
        .empty;
    });

    it('should handle null service period in array', () => {
      const form = {
        data: {
          servicePeriods: [
            {
              branchOfService: 'Marines',
              dateFrom: '2015-01-01',
              dateTo: '2019-12-31',
            },
            null,
          ],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.periods).to.have.lengthOf(2);
      expect(result.veteranServicePeriods.periods[1]).to.be.null;
    });
  });

  describe('Previous Names Transformation', () => {
    it('should format single previous name', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [
            {
              first: 'Anakin',
              last: 'Skywalker',
            },
          ],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        'Anakin Skywalker',
      );
    });

    it('should format previous name with all components', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [
            {
              first: 'Leia',
              middle: 'Amidala',
              last: 'Organa',
              suffix: 'Jr.',
            },
          ],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        'Leia Amidala Organa Jr.',
      );
    });

    it('should join multiple previous names with comma', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [
            {
              first: 'Anakin',
              last: 'Skywalker',
            },
            {
              first: 'Darth',
              last: 'Vader',
            },
          ],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        'Anakin Skywalker, Darth Vader',
      );
    });

    it('should handle empty previous names array', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        '',
      );
    });

    it('should filter out empty name components', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [
            {
              first: 'Ben',
              middle: '',
              last: 'Solo',
              suffix: '',
            },
          ],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        'Ben Solo',
      );
    });
  });

  describe('Burial Information Transformation', () => {
    it('should transform cemetery location', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [],
          organizationInformation: {
            organizationName: 'National Cemetery Administration',
          },
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryName: 'Arlington National Cemetery',
            cemeteryLocation: {
              city: 'Arlington',
              state: 'VA',
            },
            dateOfBurial: '2023-12-25',
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(
        result.burialInformation.nameOfStateCemeteryOrTribalOrganization,
      ).to.equal('National Cemetery Administration');
      expect(
        result.burialInformation.placeOfBurial
          .stateCemeteryOrTribalCemeteryName,
      ).to.equal('Arlington National Cemetery');
      expect(
        result.burialInformation.placeOfBurial
          .stateCemeteryOrTribalCemeteryLocation,
      ).to.equal('Arlington, VA');
    });

    it('should handle missing cemetery location components', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(
        result.burialInformation.placeOfBurial
          .stateCemeteryOrTribalCemeteryLocation,
      ).to.equal(', ');
    });
  });

  describe('Recipient Organization Address Transformation', () => {
    it('should transform complete recipient address', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {
            recipientOrganizationName: 'Memorial Services Inc',
            recipientPhone: '555-0138',
          },
          mailingAddress: {
            recipientAddress: {
              street: '1138 Temple Way',
              street2: 'Suite 100',
              city: 'Coruscant City',
              state: 'DC',
              country: 'USA',
              postalCode: '20001',
              postalCodeExtension: '1234',
            },
          },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.burialInformation.recipientOrganization).to.deep.equal({
        name: 'Memorial Services Inc',
        phoneNumber: '555-0138',
        address: {
          streetAndNumber: '1138 Temple Way',
          aptOrUnitNumber: 'Suite 100',
          city: 'Coruscant City',
          state: 'DC',
          country: 'DC', // State is 2 chars, so country = state
          postalCode: '20001',
          postalCodeExtension: '1234',
        },
      });
    });

    it('should handle minimal recipient address', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: {
            recipientAddress: {
              street: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              postalCode: '90210',
            },
          },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(
        result.burialInformation.recipientOrganization.address.streetAndNumber,
      ).to.equal('123 Main St');
      expect(
        result.burialInformation.recipientOrganization.address.city,
      ).to.equal('Anytown');
      expect(
        result.burialInformation.recipientOrganization.address.state,
      ).to.equal('CA');
      expect(
        result.burialInformation.recipientOrganization.address.country,
      ).to.equal('CA'); // State is 2 chars, so country = state
      expect(
        result.burialInformation.recipientOrganization.address.postalCode,
      ).to.equal('90210');
    });
  });

  describe('Additional Fields Transformation', () => {
    it('should include certification', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: {
            certifierName: 'John Doe',
            certifierTitle: 'Director',
          },
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.certification).to.deep.equal({
        certifierName: 'John Doe',
        certifierTitle: 'Director',
      });
    });

    it('should include additional remarks', () => {
      const form = {
        data: {
          servicePeriods: [],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {
            additionalRemarks: 'Veteran served with distinction and honor.',
          },
          certification: {},
        },
      };

      const result = JSON.parse(transform({}, form));

      expect(result.remarks).to.equal(
        'Veteran served with distinction and honor.',
      );
    });
  });

  describe('Complete Form Transformation', () => {
    it('should handle maximal form data correctly', () => {
      const maximalForm = {
        data: {
          organizationInformation: {
            organizationName: 'State Veterans Cemetery',
          },
          burialBenefitsRecipient: {
            recipientOrganizationName: 'Memorial Fund',
            recipientPhone: '555-1234',
          },
          mailingAddress: {
            recipientAddress: {
              street: '456 Cemetery Rd',
              street2: 'Building A',
              city: 'Springfield',
              state: 'IL',
              country: 'USA',
              postalCode: '62701',
              postalCodeExtension: '5678',
            },
          },
          veteranIdentification: {
            fullName: {
              first: 'John',
              middle: 'Robert',
              last: 'Smith',
            },
            ssn: '123-45-6789',
            serviceNumber: 'AB-12345',
            vaFileNumber: '987654321',
            dateOfBirth: '1950-3-15',
            placeOfBirth: 'New York, NY',
          },
          veteranBurialInformation: {
            cemeteryName: 'Springfield Veterans Cemetery',
            cemeteryLocation: {
              city: 'Springfield',
              state: 'IL',
            },
            dateOfDeath: '2023-11-1',
            dateOfBurial: '2023-11-5',
          },
          servicePeriods: [
            {
              branchOfService: 'Army',
              dateFrom: '1968-5-10',
              dateTo: '1972-5-9',
              placeOfEntry: 'Fort Dix, NJ',
              placeOfSeparation: 'Fort Hood, TX',
              rank: 'Sergeant',
            },
            {
              branchOfService: 'Army Reserve',
              dateFrom: '1972-5-10',
              dateTo: '1980-5-9',
              placeOfEntry: 'Springfield, IL',
              placeOfSeparation: 'Springfield, IL',
              rank: 'Staff Sergeant',
            },
          ],
          previousNames: [
            {
              first: 'John',
              middle: 'R',
              last: 'Smithson',
            },
          ],
          additionalRemarks: {
            additionalRemarks: 'Purple Heart recipient',
          },
          certification: {
            certifierName: 'Jane Administrator',
            certifierTitle: 'Cemetery Director',
            certifierDate: '2023-11-10',
          },
        },
      };

      const result = JSON.parse(transform({}, maximalForm));

      // Verify dates are padded
      expect(result.veteranInformation.dateOfBirth).to.equal('1950-03-15');
      expect(result.veteranInformation.dateOfDeath).to.equal('2023-11-01');
      expect(result.burialInformation.dateOfBurial).to.equal('2023-11-05');
      expect(
        result.veteranServicePeriods.periods[0].dateEnteredService,
      ).to.equal('1968-05-10');
      expect(result.veteranServicePeriods.periods[0].dateLeftService).to.equal(
        '1972-05-09',
      );
      expect(
        result.veteranServicePeriods.periods[1].dateEnteredService,
      ).to.equal('1972-05-10');

      // Verify SSN stripped
      expect(result.veteranInformation.ssn).to.equal('123456789');

      // Verify middle initial extracted
      expect(result.veteranInformation.fullName.middle).to.equal('R');

      // Verify previous names formatted
      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        'John R Smithson',
      );

      // Verify complete structure
      expect(result).to.have.all.keys(
        'veteranInformation',
        'veteranServicePeriods',
        'burialInformation',
        'certification',
        'remarks',
      );
    });
  });

  describe('Error Handling', () => {
    it('should catch errors in submission object creation and call Sentry', () => {
      // Create form data that will cause an error during JSON.stringify
      // by creating a circular reference
      const circularRef = { self: null };
      circularRef.self = circularRef;

      const malformedForm = {
        data: {
          servicePeriods: [],
          previousNames: [],
          organizationInformation: {},
          burialBenefitsRecipient: {},
          mailingAddress: { recipientAddress: {} },
          veteranIdentification: {
            fullName: {},
          },
          veteranBurialInformation: {
            cemeteryLocation: {},
          },
          additionalRemarks: {},
          certification: circularRef, // This will cause JSON.stringify to fail
        },
      };

      const result = transform({}, malformedForm);

      expect(sentryStub.called).to.be.true;
      expect(result).to.equal('Transform failed, see sentry for details');
    });
  });
});
