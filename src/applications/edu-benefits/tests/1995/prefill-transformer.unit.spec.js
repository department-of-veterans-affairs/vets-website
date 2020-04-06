import {
  minPrefillData,
  minTransformedPrefillData,
  maxPrefillData,
  transformedMaxPrefillData,
} from './schema/prefillData';

import { prefillTransformer } from '../../1995/prefill-transformer';

describe('prefillTransformer', () => {
  test('should transform minimal prefill data correctly', () => {
    expect(prefillTransformer({}, minPrefillData, {}).formData).toEqual(
      minTransformedPrefillData,
    );
  });
  test('should transform maximal prefill data correctly', () => {
    expect(prefillTransformer({}, maxPrefillData, {}).formData).toEqual(
      transformedMaxPrefillData,
    );
  });
});
