import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import { getPatientSignature } from '../../actions/preferences';
import * as signatureResponse from '../e2e/fixtures/signature-response.json';

describe('messages actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  it('should dispatch action on getPatientSignature', () => {
    const store = mockStore();
    mockApiRequest(signatureResponse);
    store.dispatch(getPatientSignature()).then(() => {
      const actions = store.getActions();
      expect(actions[0].type).to.equal({
        type: Actions.Preferences.GET_USER_SIGNATURE,
        payload: signatureResponse.data,
      });
    });
  });
  it('should dispatch action on getPatientSignature error', () => {
    const store = mockStore();
    mockApiRequest({}, false);
    store.dispatch(getPatientSignature()).catch(() => {
      const actions = store.getActions();
      expect(actions[0].type).to.equal({
        type: Actions.Preferences.GET_USER_SIGNATURE_ERROR,
      });
    });
  });
});
