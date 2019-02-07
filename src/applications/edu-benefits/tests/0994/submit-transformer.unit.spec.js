import { expect } from 'chai';

import formConfig from '../../0994/config/form';

import { transform } from '../../0994/submit-transformer';

import {
  transformedMinimalData,
  transformedMaximalData,
} from './schema/transformedData';

import minimalData from './schema/minimal-test.json';
import maximalData from './schema/maximal-test.json';

describe('transform', () => {
  it('should transform minimal data correctly', () => {
    expect(transform(formConfig, minimalData)).to.deep.equal(
      transformedMinimalData,
    );
  });

  it('should transform maximal data correctly', () => {
    expect(transform(formConfig, maximalData)).to.deep.equal(
      transformedMaximalData,
    );
  });
});
