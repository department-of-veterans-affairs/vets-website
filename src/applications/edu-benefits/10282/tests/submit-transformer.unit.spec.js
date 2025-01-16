import { expect } from 'chai';

import formConfig from '../config/form';

import { transform } from '../config/submit-transformer';

import {
  transformedMinimalData,
  transformedMaximalData,
} from './fixtures/data/transformedData';

import minimalData from './fixtures/data/minimal-test.json';
import maximalData from './fixtures/data/maximal-test.json';

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
