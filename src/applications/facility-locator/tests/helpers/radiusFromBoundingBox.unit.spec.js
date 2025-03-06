import { expect } from 'chai';
import { radiusFromBoundingBox } from '../../utils/facilityDistance';
import { MIN_RADIUS } from '../../constants';

describe('radiusFromBoundingBox', () => {
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
    const testZip92052Bbox = [
      {
        bbox: [-117.357412, 33.21172839552, -117.35718939552, 33.21189160448],
      },
    ];
    const [, radToUse] = radiusFromBoundingBox(testZip92052Bbox);
    expect(radToUse === MIN_RADIUS).to.eql(true);
  });
});
