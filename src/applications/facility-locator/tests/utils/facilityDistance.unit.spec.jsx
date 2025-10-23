import { expect } from 'chai';
import {
  distBetween,
  radiusFromBoundingBox,
} from '../../utils/facilityDistance';
import {
  MIN_RADIUS,
  MIN_RADIUS_NCA,
  MIN_RADIUS_EXP,
  LocationType,
  MIN_RADIUS_CCP,
} from '../../constants';

describe('facilityDistance utils', () => {
  describe('distBetween', () => {
    it('should return the correct distance between given points', () => {
      const result = distBetween(10.1, 20.1, 10.2, 20.2);

      expect(result).to.eq(9.695709000420234);
    });
  });

  describe('radiusFromBoundingBox', () => {
    const testZip92052Bbox2 = [
      {
        bbox: [-117.357412, 33.21172839552, -117.35718939552, 33.21189160448],
      },
    ];

    it('should return a valid computed radius - Dallas', () => {
      const testDallasFeatureBbox = [
        {
          bbox: [
            -97.04103101,
            32.6185720016946,
            -96.5555139885032,
            33.016494008014,
          ],
        },
      ];

      const [, radToUse] = radiusFromBoundingBox(testDallasFeatureBbox);

      expect(radToUse > MIN_RADIUS).to.eql(true);
    });

    it('should return a default 10 miles radius - zip 92052', () => {
      const [, radToUse] = radiusFromBoundingBox(testZip92052Bbox2);

      expect(radToUse === MIN_RADIUS).to.eql(true);
    });

    it('should return the NCA search radius for cemeteries', () => {
      const [, radToUse] = radiusFromBoundingBox(
        testZip92052Bbox2,
        LocationType.CEMETERY,
      );

      expect(radToUse === MIN_RADIUS_NCA).to.eql(true);
    });

    it('should return the CCP radius for CC providers', () => {
      const [, radToUse] = radiusFromBoundingBox(
        testZip92052Bbox2,
        LocationType.CC_PROVIDER,
      );

      expect(radToUse === MIN_RADIUS_CCP).to.eql(true);
    });

    it('should return the expanded search radius for health facilities', () => {
      const [, radToUse] = radiusFromBoundingBox(
        testZip92052Bbox2,
        LocationType.HEALTH,
        true,
      );

      expect(radToUse === MIN_RADIUS_EXP).to.eql(true);
    });
  });
});
