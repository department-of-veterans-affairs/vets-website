import { expect } from 'chai';

import facilities from '../../../services/mocks/var/facilities.json';
import { transformParentFacilities } from '../../../services/organization/transformers';

const facilitiesParsed = facilities.data.map(f => ({
  ...f.attributes,
  id: f.id,
}));

describe('VAOS Organization transformer', () => {
  describe('transformParentFacilities', () => {
    it('should map id', () => {
      const data = transformParentFacilities(facilitiesParsed);
      expect(data[0].identifier[0].value).to.equal(facilitiesParsed[0].id);
    });

    it('should map name', () => {
      const data = transformParentFacilities(facilitiesParsed);
      expect(data[0].name).to.equal(facilitiesParsed[0].authoritativeName);
    });

    it('should map address', () => {
      const data = transformParentFacilities(facilitiesParsed);
      expect(data[1].address[0].city).to.equal(facilitiesParsed[1].city);
      expect(data[1].address[0].state).to.equal(
        facilitiesParsed[1].stateAbbrev,
      );
    });

    it('should map partOf field for non-root parents', () => {
      const data = transformParentFacilities(facilitiesParsed);
      expect(data[2].partOf.reference).to.equal('Organization/983');
    });

    it('should not map partOf field for root parents', () => {
      const data = transformParentFacilities(facilitiesParsed);
      expect(data[1].partOf).to.be.undefined;
    });
  });
});
