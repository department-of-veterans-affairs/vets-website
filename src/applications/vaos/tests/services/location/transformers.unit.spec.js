import { expect } from 'chai';

import facilities983 from '../../../api/facilities_983.json';
import facilityDetails from '../../../api/facility_data.json';
import {
  transformDSFacilities,
  transformFacility,
  transformFacilities,
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
      expect(data.identifier[0].value).to.equal('urn:va:division:442:442');
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
      // it('should return if falsy', () => {
      //   const result = formatOperatingHours(false);
      //   expect(result).to.equal(false);
      // });
      // it('should convert sunrise - sunset to All day', () => {
      //   const result = formatOperatingHours('sunrise-sunset');
      //   expect(result).to.equal('All Day');
      // });
      // it('should return closed', () => {
      //   const result = formatOperatingHours('close');
      //   expect(result).to.equal('Closed');
      // });
      // it('should format hmmA times', () => {
      //   const result = formatOperatingHours('800AM-1000AM');
      //   expect(result).to.equal('8:00a.m. - 10:00a.m.');
      // });
      // it('should format h:mmA times', () => {
      //   const result = formatOperatingHours('8:00AM-10:00PM');
      //   expect(result).to.equal('8:00a.m. - 10:00p.m.');
      // });
      // it('should skip invalid date', () => {
      //   const result = formatOperatingHours('whatever-whatever');
      //   expect(result).to.equal('whatever-whatever');
      // });
    });
  });

  describe('transformFacilities', () => {
    it('should map to list', () => {
      const data = transformFacilities(facilityDetailsParsed);
      expect(data.length).to.equal(facilityDetailsParsed.length);
      expect(data[0].identifier[0].value).to.equal('urn:va:division:442:442');
    });
  });
});
