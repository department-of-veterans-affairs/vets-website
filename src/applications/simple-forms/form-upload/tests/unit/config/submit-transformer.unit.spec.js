import { expect } from 'chai';
import sinon from 'sinon';
import transformForSubmit from '../../../config/submit-transformer';
import transformedFixture from '../../e2e/fixtures/data/transformed/submit-transformer.json';
import form from '../../e2e/fixtures/data/maximal-test.json';
import formConfig from '../../../config/form';

describe('transformForSubmit', () => {
  it('should transform json correctly', () => {
    const windowLocationStub = sinon
      .stub(window, 'location')
      .get(() => ({ pathname: '/21-0779' }));

    const transformedResult = JSON.parse(transformForSubmit(formConfig, form));
    expect(transformedResult).to.deep.equal(transformedFixture);

    windowLocationStub.restore();
  });
});
