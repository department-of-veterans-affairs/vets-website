import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { getPatientSignature } from '../../actions/preferences';
import { preferencesReducer } from '../../reducers/preferences';
import signatureResponse from '../e2e/fixtures/signature-response.json';

describe('preferences reducer', () => {
  const mockStore = (initialState = {}) => {
    return createStore(
      preferencesReducer,
      initialState,
      applyMiddleware(thunk),
    );
  };

  it('should dispatch action on getPatientSignature', async () => {
    const store = mockStore();
    mockApiRequest(signatureResponse);
    await store.dispatch(getPatientSignature());
    expect(store.getState()).to.deep.equal({
      signature: {
        signatureName: 'Name',
        includeSignature: true,
        signatureTitle: 'TitleTest',
      },
    });
  });
  it('should dispatch action on getPatientSignature error', async () => {
    const store = mockStore();
    mockApiRequest({}, false);
    await store.dispatch(getPatientSignature());
    expect(store.getState()).to.deep.equal({
      signature: undefined,
    });
  });
});
