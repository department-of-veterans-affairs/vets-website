import { expect } from 'chai';
import sinon from 'sinon';

import transformTestData from '../fixtures/data/maximal-test.json';
import formConfig from '../../config/form';
import transform from '../../config/submit-transformer';

describe('22-10275 Submit Transformer Function', () => {
  let clock;

  beforeEach(() => {
    // Mock Date.now() to always return a fixed value in 2025
    const fixedTimestamp = new Date('2025-08-11T00:00:00Z').getTime();
    clock = sinon.useFakeTimers({ now: fixedTimestamp, toFake: ['Date'] });
  });

  afterEach(() => {
    clock.restore();
  });

  it('should transform the form data on the ui to match the json schema', () => {
    const submitData = JSON.parse(
      transform(formConfig, {
        data: transformTestData.data,
      }),
    );

    expect(JSON.parse(submitData.educationBenefitsClaim.form)).to.exist;
  });
});
