import { expect } from 'chai';
import { constructBounds } from './genBBoxFromAddress';
import { LocationType } from '../../constants';

describe('constructBounds', () => {
  const baseParams = {
    longitude: -73.935242,
    latitude: 40.73061,
  };

  it('should return correct bounding box for default case', () => {
    const result = constructBounds(baseParams);

    // Default BOUNDING_RADIUS is used
    expect(result).toEqual([
      -73.935242 - 0.5, // longitude - BOUNDING_RADIUS
      40.73061 - 0.5, // latitude - BOUNDING_RADIUS
      -73.935242 + 0.5, // longitude + BOUNDING_RADIUS
      40.73061 + 0.5, // latitude + BOUNDING_RADIUS
    ]);
  });

  it('should return correct bounding box for cemetery facility type', () => {
    const result = constructBounds({
      ...baseParams,
      facilityType: LocationType.CEMETERY,
    });

    // MIN_RADIUS_NCA (5) is used for cemetery
    const expectedRadius = 5 / 69; // Convert miles to degrees
    const longitudeModifier = Math.cos((40.73061 * Math.PI) / 180);
    const expectedLonRadius = 5 / Math.abs(longitudeModifier * 69);

    expect(result).toEqual([
      -73.935242 - expectedLonRadius,
      40.73061 - expectedRadius,
      -73.935242 + expectedLonRadius,
      40.73061 + expectedRadius,
    ]);
  });

  it('should return correct bounding box for progressive disclosure', () => {
    const result = constructBounds({
      ...baseParams,
      useProgressiveDisclosure: true,
      facilityType: LocationType.VA_FACILITY,
    });

    // MIN_RADIUS_EXP (10) is used for progressive disclosure
    const expectedRadius = 10 / 69; // Convert miles to degrees
    const longitudeModifier = Math.cos((40.73061 * Math.PI) / 180);
    const expectedLonRadius = 10 / Math.abs(longitudeModifier * 69);

    expect(result).toEqual([
      -73.935242 - expectedLonRadius,
      40.73061 - expectedRadius,
      -73.935242 + expectedLonRadius,
      40.73061 + expectedRadius,
    ]);
  });

  it('should not apply progressive disclosure for PPMS facility types', () => {
    const result = constructBounds({
      ...baseParams,
      useProgressiveDisclosure: true,
      facilityType: LocationType.CC_PROVIDER,
    });

    // Should use default BOUNDING_RADIUS since PPMS types are excluded
    expect(result).toEqual([
      -73.935242 - 0.5,
      40.73061 - 0.5,
      -73.935242 + 0.5,
      40.73061 + 0.5,
    ]);
  });

  it('should use expanded radius when expandedRadius is true', () => {
    const result = constructBounds({
      ...baseParams,
      expandedRadius: true,
    });

    // EXPANDED_BOUNDING_RADIUS should be used
    expect(result).toEqual([
      -73.935242 - 1,
      40.73061 - 1,
      -73.935242 + 1,
      40.73061 + 1,
    ]);
  });
});
