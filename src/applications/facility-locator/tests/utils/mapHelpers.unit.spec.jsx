import { expect } from 'chai';
import { getBoxCenter, getPlaceName } from '../../utils/mapHelpers';

describe('mapHelpers utils', () => {
  describe('getBoxCenter', () => {
    it('should properly calculate the box center when given square bounds', () => {
      expect(
        getBoxCenter([-77.955898, 38.380263, -76.955898, 39.380263]),
      ).to.deep.equal({
        lat: 38.880263,
        lon: -77.455898,
      });
    });

    it('should properly calculate the box center when given non-square bounds', () => {
      // Non-square box ensures lonDiff !== latDiff to catch swap bugs
      expect(getBoxCenter([-123.0, 36.0, -121.0, 37.0])).to.deep.equal({
        lon: -122.0,
        lat: 36.5,
      });
    });

    it('should return an empty object when not given bounds', () => {
      expect(getBoxCenter()).to.eql({});
    });
  });

  describe('getPlaceName', () => {
    it('should properly return the place name from a response', () => {
      const response = {
        body: {
          features: [
            {
              // eslint-disable-next-line camelcase
              place_name: '123 Main St, Springfield, IL',
            },
          ],
        },
      };

      expect(getPlaceName(response)).to.equal('123 Main St, Springfield, IL');
    });

    it('should null when no place name exists', () => {
      expect(getPlaceName({})).to.equal(null);
    });
  });
});
