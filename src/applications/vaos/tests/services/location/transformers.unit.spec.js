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
      expect(data[0].identifier[0].value).to.equal('urn:va:division:983:983');
    });

    it('should map name', () => {
      const data = transformDSFacilities(facilitiesParsed);
      expect(data[0].name).to.equal(facilitiesParsed[0].authoritativeName);
    });

    it('should map address', () => {
      const data = transformDSFacilities(facilitiesParsed);
      expect(data[1].address[0].city).to.equal(facilitiesParsed[1].city);
      expect(data[1].address[0].state).to.equal(
        facilitiesParsed[1].stateAbbrev,
      );
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
      expect(data.address[0].city).to.equal(
        facilityDetailsParsed[0].address.physical.city,
      );
      expect(data.address[0].state).to.equal(
        facilityDetailsParsed[0].address.physical.state,
      );
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
