import formConfig from '../../1995/config/form';

import { transform } from '../../1995/submit-transformer';

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
