import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { formConfig1 } from '../../../_config/formConfig';
import { fetchFormConfig } from '../../../actions/form-load';

const sinon = require('sinon');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const initialState = {
  formId: null,
  formConfig: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  error: null,
};

describe('form-load actions', () => {
  describe('fetchFormConfig', () => {
    it('calls the given fetchMethod', async () => {
      const stub = sinon.stub().resolves(formConfig1);
      const store = mockStore(initialState);

      await store.dispatch(fetchFormConfig('123-abc', stub));
      expect(stub.calledWith('123-abc')).to.be.true;
    });
  });
});
