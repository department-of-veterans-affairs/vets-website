import { expect } from 'chai';
import sinon from 'sinon';
import formConfig from '../../../config/form';
import transformForSubmit from '../../../config/submit-transformer';
import sharedTransformForSubmit from '../../../../shared/config/submit-transformer';
import fixtureUser from '../../e2e/fixtures/data/user.json';

describe('transformForSubmit', () => {
  let sharedTransformStub;

  beforeEach(() => {
    sharedTransformStub = sinon.stub(sharedTransformForSubmit, 'default');
  });

  afterEach(() => {
    sharedTransformStub.restore();
  });

  context('when middle name is present', () => {
    const inputData = {
      data: {
        ...fixtureUser.data,
        fullName: {
          first: 'AbcdefghijklZZZ',
          middle: 'AZZZ',
          last: 'AbcdefghijklmnopqrZZZ',
        },
      },
    };
    const expectedData = {
      ...fixtureUser.data,
      formNumber: '21-4138',
      fullName: {
        first: 'Abcdefghijkl',
        middle: 'A',
        last: 'Abcdefghijklmnopqr',
      },
    };

    it('truncates full name fields correctly', () => {
      const transformedResult = JSON.parse(
        transformForSubmit(formConfig, inputData),
      );
      expect(transformedResult).to.deep.equal(expectedData);
    });
  });

  context('when middle name is missing', () => {
    const inputData = {
      data: {
        ...fixtureUser.data,
        fullName: {
          first: 'AbcdefghijklZZZ',
          last: 'AbcdefghijklmnopqrZZZ',
        },
      },
    };
    const expectedData = {
      ...fixtureUser.data,
      formNumber: '21-4138',
      fullName: {
        first: 'Abcdefghijkl',
        last: 'Abcdefghijklmnopqr',
      },
    };

    it('truncates full name fields correctly', () => {
      const transformedResult = JSON.parse(
        transformForSubmit(formConfig, inputData),
      );
      expect(transformedResult).to.deep.equal(expectedData);
    });
  });

  it('does not modify full name when within limits', () => {
    const inputData = {
      data: {
        ...fixtureUser.data,
        fullName: {
          first: 'John',
          middle: 'D',
          last: 'Doe',
        },
      },
    };
    const expectedData = {
      ...fixtureUser.data,
      formNumber: '21-4138',
      fullName: {
        first: 'John',
        middle: 'D',
        last: 'Doe',
      },
    };
    const transformedResult = JSON.parse(
      transformForSubmit(formConfig, inputData),
    );
    expect(transformedResult).to.deep.equal(expectedData);
  });

  it('handles missing fullName gracefully', () => {
    const inputData = {
      data: {
        ...fixtureUser.data,
        fullName: {},
      },
    };
    const expectedData = {
      ...fixtureUser.data,
      formNumber: '21-4138',
      fullName: {},
    };
    const transformedResult = JSON.parse(
      transformForSubmit(formConfig, inputData),
    );
    expect(transformedResult).to.deep.equal(expectedData);
  });
});
