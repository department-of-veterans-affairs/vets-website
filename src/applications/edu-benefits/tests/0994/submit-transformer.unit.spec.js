import { expect } from 'chai';

import formConfig from '../../0994/config/form';

import { transformForSubmit } from '../../0994/submit-transformer';

import {
  transformedMinimalData,
  transformedMaximalData,
} from './schema/transformedData';

import minimalData from './schema/minimal-test.json';
import maximalData from './schema/maximal-test.json';

describe('transform', () => {
  it('should transform minimal data correctly', () => {
    expect(
      JSON.parse(transformForSubmit(formConfig, minimalData)),
    ).to.deep.equal(transformedMinimalData);
  });

  it('should transform maximal data correctly', () => {
    expect(
      JSON.parse(transformForSubmit(formConfig, maximalData)),
    ).to.deep.equal(transformedMaximalData);
  });
});
