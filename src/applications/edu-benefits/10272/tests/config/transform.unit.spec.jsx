import { expect } from 'chai';

import transformTestData from '../fixtures/data/transform-test-data.json';
import formConfig from '../../config/form';
import transform from '../../config/transform';
import { todaysDate } from '../../helpers';

describe('22-10272 Transform Function', () => {
  it('should transform the form data on the ui to match the json schema', () => {
    let submitData = {};

    // All optional fields included
    submitData = JSON.parse(
      transform(formConfig, {
        data: transformTestData.beforeTransform1,
      }),
    );
    expect(JSON.parse(submitData.educationBenefitsClaim.form)).to.deep.equal({
      ...transformTestData.afterTransform1,
      dateSigned: todaysDate(),
    });

    // No optional fields included
    submitData = JSON.parse(
      transform(formConfig, {
        data: transformTestData.beforeTransform2,
      }),
    );
    expect(JSON.parse(submitData.educationBenefitsClaim.form)).to.deep.equal({
      ...transformTestData.afterTransform2,
      dateSigned: todaysDate(),
    });
  });
});
