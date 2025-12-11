import { expect } from 'chai';
import sinon from 'sinon';
import { transformForSubmit } from '../../../config/submit-transformer';
import transformedFixture from '../../e2e/fixtures/data/transformed/submit-transformer.json';
import claimantTransformedFixture from '../../e2e/fixtures/data/transformed/submit-claimant-transformer.json';
import minimalTransformedFixture from '../../e2e/fixtures/data/transformed/minimal-submit-transformer.json';
import claimantTestInfo from '../../e2e/fixtures/data/claimant-test-info.json';
import form from '../../e2e/fixtures/data/maximal-test.json';
import minimalForm from '../../e2e/fixtures/data/minimal-test.json';
import formConfig from '../../../config/form';

const validPathname =
  '/representative/representative-form-upload/submit-va-form-21-0966';
const validFormConfig = formConfig(validPathname);

describe('transformForSubmit', () => {
  it('should transform veteran json correctly', () => {
    const windowLocationStub = sinon.stub(window, 'location').get(() => ({
      pathname:
        'representative/representative-form-upload/submit-va-form-21-686c',
    }));

    const transformedResult = JSON.parse(
      transformForSubmit(validFormConfig, form),
    );
    expect(transformedResult).to.deep.equal(transformedFixture);

    windowLocationStub.restore();
  });

  it('should transform claimant json correctly', () => {
    const windowLocationStub = sinon.stub(window, 'location').get(() => ({
      pathname:
        'representative/representative-form-upload/submit-va-form-21-686c',
    }));

    const transformedResult = JSON.parse(
      transformForSubmit(validFormConfig, claimantTestInfo),
    );
    expect(transformedResult).to.deep.equal(claimantTransformedFixture);

    windowLocationStub.restore();
  });

  it('handles empty transformedData', () => {
    const windowLocationStub = sinon.stub(window, 'location').get(() => ({
      pathname:
        'representative/representative-form-upload/submit-va-form-21-686c',
    }));

    const transformedResult = JSON.parse(
      transformForSubmit(validFormConfig, minimalForm),
    );
    expect(transformedResult).to.deep.equal(minimalTransformedFixture);

    windowLocationStub.restore();
  });
});
