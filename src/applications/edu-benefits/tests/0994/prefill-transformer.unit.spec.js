import {
  minPrefillData,
  minTransformedPrefillData,
  maxPrefillData,
  transformedMaxPrefillData,
} from './schema/prefillData';

import { prefillTransformer } from '../../0994/prefill-transformer';

describe('prefillTransformer', () => {
  test('should transform prefill data correctly', () => {
    expect(prefillTransformer({}, maxPrefillData, {}).formData).toEqual(
      transformedMaxPrefillData,
    );
  });

  test('should transform prefill data correctly if no bankAccount', () => {
    expect(prefillTransformer({}, minPrefillData, {}).formData).toEqual(
      minTransformedPrefillData,
    );
  });
});
