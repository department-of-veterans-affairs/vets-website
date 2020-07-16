import fs from 'fs';
import path from 'path';

import { expect } from 'chai';

import _ from 'platform/utilities/data';

import formConfig from '../../config/form';

import {
  transform,
  transformRelatedDisabilities,
  getFlatIncidentKeys,
  getPtsdChangeText,
  setActionTypes,
  filterServicePeriods,
} from '../../config/submit-transformer';

import maximalData from '../fixtures/data/maximal-test.json';
import transformedMaximalData from '../fixtures/data/transformed-maximal-test.json';

describe('transform', () => {
  it(`should transform maximal.json correctly`, () => {
    const transformedResult = JSON.parse(transform(formConfig, maximalData));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.receiptDate = '2020-06-30';
    transformedResult.data.attributes.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal(transformedMaximalData);
  });
});
