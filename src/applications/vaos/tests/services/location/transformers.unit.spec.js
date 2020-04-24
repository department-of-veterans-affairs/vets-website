import { expect } from 'chai';

import facilities983 from '../../../api/facilities_983.json';
import { transformFacilities } from '../../../services/location/transformers';

const facilitiesParsed = facilities983.data.map(f => ({
  ...f.attributes,
  id: f.id,
}));

describe('VAOS Location transformer', () => {
  describe('transformFacilities', () => {
    it('should map id', () => {
      const data = transformFacilities(facilitiesParsed);
      expect(data[0].identifier[0].value).to.equal('urn:va:division:983:983');
    });

    it('should map name', () => {
      const data = transformFacilities(facilitiesParsed);
      expect(data[0].name).to.equal(facilitiesParsed[0].authoritativeName);
    });

    it('should map address', () => {
      const data = transformFacilities(facilitiesParsed);
      expect(data[1].address[0].city).to.equal(facilitiesParsed[1].city);
      expect(data[1].address[0].state).to.equal(
        facilitiesParsed[1].stateAbbrev,
      );
    });
  });
});
