import formConfig from '../../0994/config/form';

import { transform } from '../../0994/submit-transformer';

import {
  transformedMinimalData,
  transformedMaximalData,
} from './schema/transformedData';

import minimalData from './schema/minimal-test.json';
import maximalData from './schema/maximal-test.json';

describe('transform', () => {
  test('should transform minimal data correctly', () => {
    expect(transform(formConfig, minimalData)).toEqual(transformedMinimalData);
  });

  test('should transform maximal data correctly', () => {
    expect(transform(formConfig, maximalData)).toEqual(transformedMaximalData);
  });
});
