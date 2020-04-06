import {
  minPrefillData,
  minTransformedPrefillData,
  maxPrefillData,
  transformedMaxPrefillData,
} from './schema/prefillData';

import { prefillTransformer } from '../../1995/prefill-transformer';

describe('prefillTransformer', () => {
  it('should transform minimal prefill data correctly', () => {
    expect(prefillTransformer({}, minPrefillData, {}).formData).toEqual(
      minTransformedPrefillData,
    );
  });
  it('should transform maximal prefill data correctly', () => {
    expect(prefillTransformer({}, maxPrefillData, {}).formData).toEqual(
      transformedMaxPrefillData,
    );
  });
});
