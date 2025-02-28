import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import { getPatientSignature } from '../../actions/preferences';
import * as signatureResponse from '../e2e/fixtures/signature-response.json';

describe('preferences actions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  it('should dispatch action on getPatientSignature', async () => {
    const store = mockStore();
    mockApiRequest(signatureResponse);
    await store.dispatch(getPatientSignature());
    expect(store.getActions()).to.deep.include({
      type: Actions.Preferences.GET_USER_SIGNATURE,
      payload: signatureResponse.data.attributes,
    });
  });
  it('should dispatch action on getPatientSignature error', async () => {
    const store = mockStore();
    mockApiRequest({}, false);
    await store.dispatch(getPatientSignature());
    expect(store.getActions()).to.deep.include({
      type: Actions.Preferences.GET_USER_SIGNATURE_ERROR,
    });
  });
});
