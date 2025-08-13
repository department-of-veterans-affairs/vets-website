import { expect } from 'chai';
import sinon from 'sinon';

import transformTestData from '../fixtures/data/transform-test-data.json';
import transform from '../../config/transform';

describe('22-1919 Transform Function', () => {
  it('should transform the form data on the ui to match the json schema', () => {
    // Mock Date.now() to always return a fixed value in 2024
    const fixedTimestamp = new Date('2025-08-11T00:00:00Z').getTime();
    const clock = sinon.useFakeTimers({
      now: fixedTimestamp,
      toFake: ['Date'],
    });

    // Facility code provided for institution
    expect(transform({ data: transformTestData.beforeTransform1 })).to.equal(
      JSON.stringify({
        educationBenefitsClaim: {
          form: JSON.stringify(transformTestData.afterTransform1),
        },
      }),
    );

    // Facility code *not yet* provided for institution
    expect(transform({ data: transformTestData.beforeTransform2 })).to.equal(
      JSON.stringify({
        educationBenefitsClaim: {
          form: JSON.stringify(transformTestData.afterTransform2),
        },
      }),
    );

    clock.restore();
  });
});
