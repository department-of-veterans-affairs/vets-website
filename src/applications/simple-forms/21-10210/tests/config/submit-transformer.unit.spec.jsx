import { expect } from 'chai';
import formConfig from '../../config/form';
import transformForSubmit from '../../config/submit-transformer';
import flow2 from '../e2e/fixtures/data/flow2.json';
import transformedFlow2 from '../e2e/fixtures/data/transformed/flow2.json';

describe('transformForSubmit', () => {
  it('should transform json correctly', () => {
    const transformedResult = JSON.parse(transformForSubmit(formConfig, flow2));
    expect(transformedResult).to.deep.equal(transformedFlow2);
  });
});
