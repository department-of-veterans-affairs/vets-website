/**
 * @module tests/config/submit-transform/transform.unit.spec
 * @description Unit tests for submission transform
 */

import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
import { transform } from './transform';

/**
 * Helper to create minimal valid form data
 */
const createFormData = (overrides = {}) => {
  const defaults = {
    veteranInformation: {},
    burialInformation: {
      placeOfBurial: {
        cemeteryLocation: {},
      },
      recipientOrganization: {
        address: {},
      },
    },
    periods: [],
    previousNames: [],
    certification: {},
    remarks: '',
  };

  // Deep merge for burialInformation to preserve nested defaults
  const data = { ...defaults, ...overrides };
  if (overrides.burialInformation) {
    data.burialInformation = {
      placeOfBurial: {
        cemeteryLocation: {},
        ...(overrides.burialInformation.placeOfBurial || {}),
      },
      recipientOrganization: {
        address: {},
        ...(overrides.burialInformation.recipientOrganization || {}),
      },
      ...overrides.burialInformation,
    };
  }

  return { data };
};

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

  describe('Basic Functionality', () => {
    it('should export a function', () => {
      expect(transform).to.be.a('function');
    });

    it('should return a JSON string for valid data', () => {
      const form = createFormData();
      const result = transform({}, form);

      expect(result).to.be.a('string');
      expect(() => JSON.parse(result)).to.not.throw();
    });

    it('should return parsed object with expected top-level keys', () => {
      const form = createFormData({
        veteranInformation: { fullName: { first: 'Test' } },
        burialInformation: { dateOfBurial: '2023-01-01' },
        certification: { titleOfStateOrTribalOfficial: 'Director' },
      });
      const result = JSON.parse(transform({}, form));

      expect(result).to.have.property('veteranInformation');
      expect(result).to.have.property('burialInformation');
      expect(result).to.have.property('veteranServicePeriods');
      expect(result).to.have.property('certification');
      expect(result).to.have.property('remarks');
    });
  });

  describe('Veteran Information', () => {
    it('should pass through veteran information unchanged', () => {
      const form = createFormData({
        veteranInformation: {
          fullName: {
            first: 'John',
            middle: 'M',
            last: 'Doe',
          },
          dateOfBirth: '1950-01-15',
          dateOfDeath: '2023-12-25',
          ssn: '123456789',
          vaFileNumber: '987654321',
        },
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranInformation).to.deep.equal({
        fullName: {
          first: 'John',
          middle: 'M',
          last: 'Doe',
        },
        dateOfBirth: '1950-01-15',
        dateOfDeath: '2023-12-25',
        ssn: '123456789',
        vaFileNumber: '987654321',
      });
    });

    it('should handle minimal veteran information', () => {
      const form = createFormData({
        veteranInformation: {
          fullName: {
            first: 'Jane',
            last: 'Smith',
          },
        },
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranInformation.fullName).to.deep.equal({
        first: 'Jane',
        last: 'Smith',
      });
    });
  });

  describe('Burial Information', () => {
    it('should restructure burial information correctly', () => {
      const form = createFormData({
        burialInformation: {
          nameOfStateCemeteryOrTribalOrganization: 'Virginia State Cemetery',
          dateOfBurial: '2023-12-28',
          placeOfBurial: {
            stateCemeteryOrTribalCemeteryName: 'Arlington National Cemetery',
            cemeteryLocation: {
              city: 'Arlington',
              state: 'VA',
            },
          },
          recipientOrganization: {
            name: 'State Veterans Affairs',
            phoneNumber: '555-0100',
            address: {
              street: '123 Main St',
              street2: 'Suite 200',
              city: 'Springfield',
              state: 'IL',
              country: 'US',
              postalCode: '62701',
            },
          },
        },
      });

      const result = JSON.parse(transform({}, form));

      expect(result.burialInformation).to.deep.equal({
        nameOfStateCemeteryOrTribalOrganization: 'Virginia State Cemetery',
        dateOfBurial: '2023-12-28',
        placeOfBurial: {
          stateCemeteryOrTribalCemeteryName: 'Arlington National Cemetery',
          stateCemeteryOrTribalCemeteryLocation: 'Arlington, VA',
        },
        recipientOrganization: {
          name: 'State Veterans Affairs',
          phoneNumber: '555-0100',
          address: {
            streetAndNumber: '123 Main St',
            aptOrUnitNumber: 'Suite 200',
            city: 'Springfield',
            state: 'IL',
            country: 'US',
            postalCode: '62701',
          },
        },
      });
    });

    it('should format cemetery location string from city and state', () => {
      const form = createFormData({
        burialInformation: {
          placeOfBurial: {
            stateCemeteryOrTribalCemeteryName: 'Test Cemetery',
            cemeteryLocation: {
              city: 'Boston',
              state: 'MA',
            },
          },
          recipientOrganization: {
            address: {},
          },
        },
      });

      const result = JSON.parse(transform({}, form));

      expect(
        result.burialInformation.placeOfBurial
          .stateCemeteryOrTribalCemeteryLocation,
      ).to.equal('Boston, MA');
    });

    it('should transform address street to streetAndNumber', () => {
      const form = createFormData({
        burialInformation: {
          placeOfBurial: {
            cemeteryLocation: {},
          },
          recipientOrganization: {
            address: {
              street: '456 Oak Avenue',
              city: 'Denver',
              state: 'CO',
            },
          },
        },
      });

      const result = JSON.parse(transform({}, form));

      expect(
        result.burialInformation.recipientOrganization.address.streetAndNumber,
      ).to.equal('456 Oak Avenue');
    });

    it('should transform address street2 to aptOrUnitNumber', () => {
      const form = createFormData({
        burialInformation: {
          placeOfBurial: {
            cemeteryLocation: {},
          },
          recipientOrganization: {
            address: {
              street: '789 Main St',
              street2: 'Apt 4B',
              city: 'Phoenix',
              state: 'AZ',
            },
          },
        },
      });

      const result = JSON.parse(transform({}, form));

      expect(
        result.burialInformation.recipientOrganization.address.aptOrUnitNumber,
      ).to.equal('Apt 4B');
    });

    it('should handle burial information with minimal fields', () => {
      const form = createFormData({
        burialInformation: {
          placeOfBurial: {
            cemeteryLocation: {},
          },
          recipientOrganization: {
            address: {},
          },
        },
      });

      const result = JSON.parse(transform({}, form));

      expect(result.burialInformation).to.have.property('placeOfBurial');
      expect(result.burialInformation).to.have.property(
        'recipientOrganization',
      );
    });
  });

  describe('Service Periods', () => {
    it('should wrap periods array in veteranServicePeriods', () => {
      const form = createFormData({
        periods: [
          {
            serviceBranch: 'ARMY',
            dateEnteredService: '2010-01-15',
            dateLeftService: '2014-12-31',
            placeEnteredService: 'Fort Benning, GA',
            placeLeftService: 'Fort Hood, TX',
            rankAtSeparation: 'Captain',
          },
        ],
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods).to.have.property('periods');
      expect(result.veteranServicePeriods.periods).to.have.lengthOf(1);
      expect(result.veteranServicePeriods.periods[0]).to.deep.equal({
        serviceBranch: 'Army',
        dateEnteredService: '2010-01-15',
        dateLeftService: '2014-12-31',
        placeEnteredService: 'Fort Benning, GA',
        placeLeftService: 'Fort Hood, TX',
        rankAtSeparation: 'Captain',
      });
    });

    it('should handle multiple service periods', () => {
      const form = createFormData({
        periods: [
          {
            serviceBranch: 'NAVY',
            dateEnteredService: '2005-03-01',
            dateLeftService: '2009-02-28',
          },
          {
            serviceBranch: 'AF',
            dateEnteredService: '2010-06-15',
            dateLeftService: '2015-06-14',
          },
        ],
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.periods).to.have.lengthOf(2);
      expect(result.veteranServicePeriods.periods[0].serviceBranch).to.equal(
        'Navy',
      );
      expect(result.veteranServicePeriods.periods[1].serviceBranch).to.equal(
        'Air Force',
      );
    });

    it('should handle empty periods array', () => {
      const form = createFormData({
        periods: [],
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.periods).to.be.an('array').that.is
        .empty;
    });

    it('should handle undefined periods (optional service history)', () => {
      const form = createFormData({
        periods: undefined,
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.periods).to.be.an('array').that.is
        .empty;
    });
  });

  describe('Previous Names Transformation', () => {
    it('should capitalize and format single previous name', () => {
      const form = createFormData({
        previousNames: [
          {
            previousName: {
              first: 'anakin',
              last: 'skywalker',
            },
          },
        ],
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        'Anakin Skywalker',
      );
    });

    it('should format previous name with middle name', () => {
      const form = createFormData({
        previousNames: [
          {
            previousName: {
              first: 'leia',
              middle: 'amidala',
              last: 'organa',
            },
          },
        ],
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        'Leia Amidala Organa',
      );
    });

    it('should join multiple previous names with semicolon', () => {
      const form = createFormData({
        previousNames: [
          {
            previousName: {
              first: 'anakin',
              last: 'skywalker',
            },
          },
          {
            previousName: {
              first: 'darth',
              last: 'vader',
            },
          },
        ],
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        'Anakin Skywalker; Darth Vader',
      );
    });

    it('should handle empty previous names array', () => {
      const form = createFormData({
        previousNames: [],
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        '',
      );
    });

    it('should filter out empty name components', () => {
      const form = createFormData({
        previousNames: [
          {
            previousName: {
              first: 'ben',
              middle: '',
              last: 'solo',
            },
          },
        ],
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        'Ben Solo',
      );
    });

    it('should handle undefined previousName object', () => {
      const form = createFormData({
        previousNames: [{ previousName: undefined }],
      });

      const result = JSON.parse(transform({}, form));

      // Should handle gracefully without crashing
      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        '',
      );
    });

    it('should include service period when provided', () => {
      const form = createFormData({
        previousNames: [
          {
            previousName: {
              first: 'john',
              last: 'doe',
            },
            servicePeriod: 'Army 1968-1972',
          },
        ],
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        'John Doe, Service Periods: Army 1968-1972',
      );
    });

    it('should format multiple names with service periods', () => {
      const form = createFormData({
        previousNames: [
          {
            previousName: {
              first: 'john',
              last: 'doe',
            },
            servicePeriod: 'Army 1968-1972',
          },
          {
            previousName: {
              first: 'jane',
              middle: 'marie',
              last: 'smith',
            },
            servicePeriod: 'Navy 1975-1980',
          },
        ],
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        'John Doe, Service Periods: Army 1968-1972; Jane Marie Smith, Service Periods: Navy 1975-1980',
      );
    });

    it('should handle name without service period', () => {
      const form = createFormData({
        previousNames: [
          {
            previousName: {
              first: 'john',
              last: 'doe',
            },
          },
        ],
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        'John Doe',
      );
    });

    it('should handle mix of names with and without service periods', () => {
      const form = createFormData({
        previousNames: [
          {
            previousName: {
              first: 'john',
              last: 'doe',
            },
            servicePeriod: 'Army 1968-1972',
          },
          {
            previousName: {
              first: 'jane',
              last: 'smith',
            },
          },
        ],
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        'John Doe, Service Periods: Army 1968-1972; Jane Smith',
      );
    });
  });

  describe('Certification and Remarks', () => {
    it('should pass through certification unchanged', () => {
      const form = createFormData({
        certification: {
          nameOfStateOrTribalOfficial: 'John Administrator',
          titleOfStateOrTribalOfficial: 'Cemetery Director',
          certificationDate: '2023-12-30',
        },
      });

      const result = JSON.parse(transform({}, form));

      expect(result.certification).to.deep.equal({
        nameOfStateOrTribalOfficial: 'John Administrator',
        titleOfStateOrTribalOfficial: 'Cemetery Director',
        certificationDate: '2023-12-30',
      });
    });

    it('should pass through remarks unchanged', () => {
      const form = createFormData({
        remarks: 'Veteran served with distinction and honor.',
      });

      const result = JSON.parse(transform({}, form));

      expect(result.remarks).to.equal(
        'Veteran served with distinction and honor.',
      );
    });

    it('should handle empty remarks', () => {
      const form = createFormData({
        remarks: '',
      });

      const result = JSON.parse(transform({}, form));

      expect(result.remarks).to.equal('');
    });
  });

  describe('Sanitization - view: fields', () => {
    it('should remove fields starting with view:', () => {
      const form = createFormData({
        'view:tempField': 'should be removed',
        veteranInformation: {
          fullName: {
            first: 'John',
            last: 'Doe',
          },
          'view:someData': 'should be removed',
        },
      });

      const result = JSON.parse(transform({}, form));

      expect(result['view:tempField']).to.be.undefined;
      expect(result.veteranInformation['view:someData']).to.be.undefined;
      expect(result.veteranInformation.fullName).to.exist;
    });
  });

  describe('Sanitization - empty objects', () => {
    it('should remove empty objects', () => {
      const form = createFormData({
        veteranInformation: {
          fullName: {
            first: 'John',
            last: 'Doe',
          },
          emptyObject: {},
        },
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranInformation.emptyObject).to.be.undefined;
      expect(result.veteranInformation.fullName).to.exist;
    });

    it('should remove objects with only undefined values', () => {
      const form = createFormData({
        veteranInformation: {
          fullName: {
            first: 'John',
            last: 'Doe',
          },
          allUndefined: {
            field1: undefined,
            field2: undefined,
          },
        },
      });

      const result = JSON.parse(transform({}, form));

      expect(result.veteranInformation.allUndefined).to.be.undefined;
    });
  });

  describe('Complete Form Transformation', () => {
    it('should handle maximal form data correctly', () => {
      const maximalForm = createFormData({
        veteranInformation: {
          fullName: {
            first: 'John',
            middle: 'R',
            last: 'Smith',
          },
          ssn: '123456789',
          vaFileNumber: '987654321',
          dateOfBirth: '1950-03-15',
          dateOfDeath: '2023-11-01',
          placeOfBirth: 'New York, NY',
        },
        burialInformation: {
          nameOfStateCemeteryOrTribalOrganization: 'Illinois Veterans Affairs',
          dateOfBurial: '2023-11-05',
          placeOfBurial: {
            stateCemeteryOrTribalCemeteryName: 'Springfield Veterans Cemetery',
            cemeteryLocation: {
              city: 'Springfield',
              state: 'IL',
            },
          },
          recipientOrganization: {
            name: 'Memorial Fund',
            phoneNumber: '555-1234',
            address: {
              street: '456 Cemetery Rd',
              street2: 'Building A',
              city: 'Springfield',
              state: 'IL',
              country: 'USA',
              postalCode: '62701',
            },
          },
        },
        periods: [
          {
            serviceBranch: 'ARMY',
            dateEnteredService: '1968-05-10',
            dateLeftService: '1972-05-09',
            placeEnteredService: 'Fort Dix, NJ',
            placeLeftService: 'Fort Hood, TX',
            rankAtSeparation: 'Sergeant',
          },
        ],
        previousNames: [
          {
            previousName: {
              first: 'john',
              middle: 'r',
              last: 'smithson',
            },
          },
        ],
        certification: {
          nameOfStateOrTribalOfficial: 'Jane Administrator',
          titleOfStateOrTribalOfficial: 'Cemetery Director',
          certificationDate: '2023-11-10',
        },
        remarks: 'Purple Heart recipient',
      });

      const result = JSON.parse(transform({}, maximalForm));

      // Verify structure
      expect(result).to.have.all.keys(
        'veteranInformation',
        'burialInformation',
        'veteranServicePeriods',
        'certification',
        'remarks',
      );

      // Verify veteran information passed through
      expect(result.veteranInformation.fullName.first).to.equal('John');
      expect(result.veteranInformation.ssn).to.equal('123456789');

      // Verify burial information restructured correctly
      expect(
        result.burialInformation.nameOfStateCemeteryOrTribalOrganization,
      ).to.equal('Illinois Veterans Affairs');
      expect(result.burialInformation.dateOfBurial).to.equal('2023-11-05');
      expect(
        result.burialInformation.placeOfBurial
          .stateCemeteryOrTribalCemeteryName,
      ).to.equal('Springfield Veterans Cemetery');
      expect(
        result.burialInformation.placeOfBurial
          .stateCemeteryOrTribalCemeteryLocation,
      ).to.equal('Springfield, IL');

      // Verify recipient organization address transformation
      expect(
        result.burialInformation.recipientOrganization.address.streetAndNumber,
      ).to.equal('456 Cemetery Rd');
      expect(
        result.burialInformation.recipientOrganization.address.aptOrUnitNumber,
      ).to.equal('Building A');

      // Verify service periods wrapped correctly
      expect(result.veteranServicePeriods.periods).to.have.lengthOf(1);
      expect(result.veteranServicePeriods.periods[0].serviceBranch).to.equal(
        'Army',
      );

      // Verify previous names capitalized
      expect(result.veteranServicePeriods.servedUnderDifferentName).to.equal(
        'John R Smithson',
      );

      // Verify country code truncated
      expect(
        result.burialInformation.recipientOrganization.address.country,
      ).to.equal('USA');

      // Verify remarks
      expect(result.remarks).to.equal('Purple Heart recipient');
    });
  });

  describe('Error Handling', () => {
    it('should catch errors in submission object creation and call Sentry', () => {
      // Create form data that will cause an error during JSON.stringify
      // by creating a circular reference
      const circularRef = { self: null };
      circularRef.self = circularRef;

      const malformedForm = createFormData({
        certification: circularRef, // This will cause JSON.stringify to fail
      });

      const result = transform({}, malformedForm);

      expect(sentryStub.called).to.be.true;
      expect(result).to.equal('Transform failed, see sentry for details');
    });
  });
});
