import { expect } from 'chai';

import facilities983 from '../../../services/mocks/var/facilities_983.json';
import facilityDetails from '../../../services/mocks/var/facility_data.json';
import {
  transformDSFacilities,
  transformFacility,
  transformFacilities,
  transformATLASLocation,
} from '../../../services/location/transformers';

const facilitiesParsed = facilities983.data.map(f => ({
  ...f.attributes,
  id: f.id,
}));

const facilityDetailsParsed = facilityDetails.data.map(f => ({
  ...f.attributes,
  id: f.id,
}));

describe('VAOS Location transformer', () => {
  describe('transformDSFacilities', () => {
    it('should map id', () => {
      const data = transformDSFacilities(facilitiesParsed);
      expect(data[0].identifier[0].value).to.equal('983');
      expect(data[0].identifier[1].value).to.equal('urn:va:division:983:983');
    });

    it('should map name', () => {
      const data = transformDSFacilities(facilitiesParsed);
      expect(data[0].name).to.equal(facilitiesParsed[0].authoritativeName);
    });

    it('should map address', () => {
      const data = transformDSFacilities(facilitiesParsed);
      expect(data[1].address.city).to.equal(facilitiesParsed[1].city);
      expect(data[1].address.state).to.equal(facilitiesParsed[1].stateAbbrev);
    });
  });

  describe('transformFacility', () => {
    it('should map id', () => {
      const data = transformFacility(facilityDetailsParsed[0]);
      expect(data.identifier[0].value).to.equal('urn:va:division:983:983');
    });

    it('should map name', () => {
      const data = transformFacility(facilityDetailsParsed[0]);
      expect(data.name).to.equal(facilityDetailsParsed[0].name);
    });

    it('should map phone', () => {
      const data = transformFacility(facilityDetailsParsed[0]);
      expect(data.telecom[0]).to.deep.equal({
        system: 'phone',
        value: facilityDetailsParsed[0].phone.main,
      });
    });

    it('should map address', () => {
      const data = transformFacility(facilityDetailsParsed[0]);
      expect(data.address.city).to.equal(
        facilityDetailsParsed[0].address.physical.city,
      );
      expect(data.address.state).to.equal(
        facilityDetailsParsed[0].address.physical.state,
      );
    });
    describe('should map operating hours', () => {
      it('should skip entry if closed', () => {
        const data = transformFacility({
          ...facilityDetailsParsed[0],
          hours: {
            monday: null,
          },
        });
        expect(data.hoursOfOperation).to.be.empty;
      });
      it('should convert sunrise - sunset to All day', () => {
        const data = transformFacility({
          ...facilityDetailsParsed[0],
          hours: {
            monday: 'sunrise - sunset',
          },
        });
        expect(data.hoursOfOperation[0]).to.deep.equal({
          allDay: true,
          daysOfWeek: ['mon'],
          openingTime: null,
          closingTime: null,
        });
      });
      it('should return closed if text is close', () => {
        const data = transformFacility({
          ...facilityDetailsParsed[0],
          hours: {
            tuesday: 'close',
          },
        });
        expect(data.hoursOfOperation).to.be.empty;
      });
      it('should format hmmA times', () => {
        const data = transformFacility({
          ...facilityDetailsParsed[0],
          hours: {
            monday: '800AM-1000AM',
          },
        });
        expect(data.hoursOfOperation[0]).to.deep.equal({
          allDay: false,
          daysOfWeek: ['mon'],
          openingTime: '08:00',
          closingTime: '10:00',
        });
      });
      it('should format h:mmA times', () => {
        const data = transformFacility({
          ...facilityDetailsParsed[0],
          hours: {
            monday: '8:00AM-10:00PM',
          },
        });
        expect(data.hoursOfOperation[0]).to.deep.equal({
          allDay: false,
          daysOfWeek: ['mon'],
          openingTime: '08:00',
          closingTime: '22:00',
        });
      });
      it('should skip invalid date', () => {
        const data = transformFacility({
          ...facilityDetailsParsed[0],
          hours: {
            monday: 'whatever-whatever',
          },
        });
        expect(data.hoursOfOperation[0]).to.deep.equal({
          allDay: false,
          daysOfWeek: ['mon'],
          openingTime: null,
          closingTime: null,
        });
      });
    });
  });

  describe('transformFacilities', () => {
    it('should map to list', () => {
      const data = transformFacilities(facilityDetailsParsed);
      expect(data.length).to.equal(facilityDetailsParsed.length);
      expect(data[0].identifier[0].value).to.equal('urn:va:division:983:983');
    });
  });

  describe('transformATLASLocation', () => {
    it('should transform ATLAS Location', () => {
      const tasInfo = {
        confirmationCode: '7VBBCA',
        address: {
          streetAddress: '114 Dewey Ave',
          city: 'Eureka',
          state: 'MT',
          zipCode: '59917',
          country: 'USA',
          longitude: -115.1,
          latitude: 48.8,
          additionalDetails: '',
        },
        siteCode: 9931,
      };

      const {
        streetAddress,
        city,
        state,
        zipCode: postalCode,
        latitude,
        longitude,
      } = tasInfo.address;

      const location = {
        resourceType: 'Location',
        id: tasInfo.siteCode,
        address: {
          line: [streetAddress],
          city,
          state,
          postalCode,
        },
        position: {
          longitude,
          latitude,
        },
      };

      const result = transformATLASLocation(tasInfo);

      expect(result).to.eql(location);
    });
  });
});
