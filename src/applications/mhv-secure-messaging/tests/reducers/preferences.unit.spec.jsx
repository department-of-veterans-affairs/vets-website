import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { getPatientSignature } from '../../actions/preferences';
import { preferencesReducer } from '../../reducers/preferences';
import signatureResponse from '../e2e/fixtures/signature-response.json';
import { Actions } from '../../util/actionTypes';

describe('preferences reducer', () => {
  it('should return initial state', () => {
    const state = preferencesReducer(undefined, {});
    expect(state).to.have.property('signature', undefined);
  });

  const mockStore = (initialState) => {
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

  it('should handle GET_USER_SIGNATURE action directly', () => {
    const signatureData = {
      signatureName: 'Test Name',
      includeSignature: false,
      signatureTitle: 'Test Title',
    };
    const state = preferencesReducer(undefined, {
      type: Actions.Preferences.GET_USER_SIGNATURE,
      payload: signatureData,
    });
    expect(state.signature).to.deep.equal(signatureData);
  });

  it('should handle unknown action type', () => {
    const initialState = { signature: undefined };
    const state = preferencesReducer(initialState, {
      type: 'UNKNOWN_ACTION',
    });
    expect(state).to.deep.equal(initialState);
  });
});
