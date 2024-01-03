import { createStore, applyMiddleware } from 'redux';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { facilitiesReducer } from '../../reducers/facilities';
import { getAllFacilities } from '../../actions/facilities';
import {
  mockResponseData,
  userProfileFacilities,
} from '../fixtures/cerner-facility-mock-data.json';

describe('facilities reducer', () => {
  const mockStore = (initialState = {}) => {
    return createStore(facilitiesReducer, initialState, applyMiddleware(thunk));
  };

  it('should dispatch action on getFacilities', async () => {
    const store = mockStore();
    mockApiRequest(mockResponseData);
    await store.dispatch(getAllFacilities(userProfileFacilities));
    expect(store.getState().facilities[0].id).to.equal('vha_668');
  });
});
