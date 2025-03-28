import { expect } from 'chai';
import { constructBounds } from '../../actions/mapbox/genBBoxFromAddress';
import { BOUNDING_RADIUS, LocationType, MIN_RADIUS_EXP } from '../../constants';

describe('constructBounds', () => {
  const baseParams = {
    longitude: -73.935242,
    latitude: 40.73061,
    facilityType: LocationType.HEALTH,
    expandedRadius: false,
    useProgressiveDisclosure: false,
  };

  it('should return correct bounding box for default case', () => {
    const result = constructBounds(baseParams);

    // Default BOUNDING_RADIUS is used
    expect(result).to.deep.equal([
      baseParams.longitude - BOUNDING_RADIUS, // longitude - BOUNDING_RADIUS
      baseParams.latitude - BOUNDING_RADIUS, // latitude - BOUNDING_RADIUS
      baseParams.longitude + BOUNDING_RADIUS, // longitude + BOUNDING_RADIUS
      baseParams.latitude + BOUNDING_RADIUS, // latitude + BOUNDING_RADIUS
    ]);
  });

  it('should return correct bounding box for cemetery facility type', () => {
    const result = constructBounds({
      ...baseParams,
      facilityType: LocationType.CEMETERY,
    });

    // MIN_RADIUS_NCA (5) is used for cemetery
    const expectedRadius = 133 / 69; // Convert miles to degrees
    const longitudeModifier = Math.cos((baseParams.latitude * Math.PI) / 180);
    const expectedLonRadius = 133 / Math.abs(longitudeModifier * 69);

    expect(result).to.deep.equal([
      baseParams.longitude - expectedLonRadius,
      baseParams.latitude - expectedRadius,
      baseParams.longitude + expectedLonRadius,
      baseParams.latitude + expectedRadius,
    ]);
  });

  it('should return correct bounding box for progressive disclosure', () => {
    const result = constructBounds({
      ...baseParams,
      useProgressiveDisclosure: true,
      facilityType: LocationType.HEALTH,
    });

    // MIN_RADIUS_EXP (10) is used for progressive disclosure
    const expectedRadius = MIN_RADIUS_EXP / 69; // Convert miles to degrees
    const longitudeModifier = Math.cos((baseParams.latitude * Math.PI) / 180);
    const expectedLonRadius = MIN_RADIUS_EXP / Math.abs(longitudeModifier * 69);

    expect(result).to.deep.equal([
      baseParams.longitude - expectedLonRadius,
      baseParams.latitude - expectedRadius,
      baseParams.longitude + expectedLonRadius,
      baseParams.latitude + expectedRadius,
    ]);
  });

  it('should not apply progressive disclosure for PPMS facility types', () => {
    const result = constructBounds({
      ...baseParams,
      useProgressiveDisclosure: true,
      facilityType: LocationType.CC_PROVIDER,
    });

    // Should use default BOUNDING_RADIUS since PPMS types are excluded
    expect(result).to.deep.equal([
      baseParams.longitude - BOUNDING_RADIUS,
      baseParams.latitude - BOUNDING_RADIUS,
      baseParams.longitude + BOUNDING_RADIUS,
      baseParams.latitude + BOUNDING_RADIUS,
    ]);
  });

  it('should use expanded radius when expandedRadius is true', () => {
    const result = constructBounds({
      ...baseParams,
      expandedRadius: true,
    });

    // EXPANDED_BOUNDING_RADIUS should be used
    expect(result).to.deep.equal([
      baseParams.longitude - 0.78,
      baseParams.latitude - 0.78,
      baseParams.longitude + 0.78,
      baseParams.latitude + 0.78,
    ]);
  });
});
