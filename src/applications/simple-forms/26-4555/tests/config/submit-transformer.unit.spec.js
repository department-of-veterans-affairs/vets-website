import { expect } from 'chai';
import formConfig from '../../config/form';
import transformForSubmit from '../../config/submit-transformer';
import fixture from '../e2e/fixtures/data/maximal-test.json';
import transformedFixture from '../e2e/fixtures/data/transformed/maximal-test.json';

describe('transformForSubmit', () => {
  it('should transform json correctly', () => {
    const transformedResult = JSON.parse(
      transformForSubmit(formConfig, fixture),
    );
    expect(transformedResult).to.deep.equal(transformedFixture);
  });
});
