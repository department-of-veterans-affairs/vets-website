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

    const formData = { data: transformTestData.beforeTransform };
    const transformedData = JSON.stringify({
      educationBenefitsClaim: {
        form: JSON.stringify(transformTestData.afterTransform),
      },
    });

    expect(transform(formData)).to.equal(transformedData);

    clock.restore();
  });
});
