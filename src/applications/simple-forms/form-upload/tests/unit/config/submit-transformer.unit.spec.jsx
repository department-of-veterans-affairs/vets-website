import { expect } from 'chai';
import transformForSubmit from '../../../config/submit-transformer';
import transformedFixture from '../../e2e/fixtures/data/transformed/submit-transformer.json';
import minimalTransformedFixture from '../../e2e/fixtures/data/transformed/minimal-submit-transformer.json';
import form from '../../e2e/fixtures/data/maximal-test.json';
import minimalForm from '../../e2e/fixtures/data/minimal-test.json';
import formConfig from '../../../config/form';

describe('transformForSubmit', () => {
  it('should transform json correctly', () => {
    delete global.window?.location;
    global.window = {
      location: { pathname: '/forms/21-0779/upload/introduction' },
    };

    const transformedResult = JSON.parse(
      transformForSubmit(formConfig(), form),
    );
    expect(transformedResult).to.deep.equal(transformedFixture);
  });

  it('handles empty transformedData', () => {
    delete global.window?.location;
    global.window = {
      location: { pathname: '/forms/21-0779/upload/introduction' },
    };

    const transformedResult = JSON.parse(
      transformForSubmit(formConfig(), minimalForm),
    );
    expect(transformedResult).to.deep.equal(minimalTransformedFixture);
  });
});
