import { expect } from 'chai';
import sinon from 'sinon';

import transformTestData from '../fixtures/data/transform-test-data.json';
import formConfig from '../../config/form';
import transform from '../../config/transform';

describe('22-1919 Transform Function', () => {
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
    let submitData = {};

    // Facility code provided for institution
    submitData = JSON.parse(
      transform(formConfig, {
        data: transformTestData.beforeTransform1,
      }),
    );
    expect(JSON.parse(submitData.educationBenefitsClaim.form)).to.exist;

    // Facility code *not yet* provided for institution
    submitData = JSON.parse(
      transform(formConfig, {
        formConfig,
        data: transformTestData.beforeTransform2,
      }),
    );
    expect(JSON.parse(submitData.educationBenefitsClaim.form)).to.exist;
  });
});
