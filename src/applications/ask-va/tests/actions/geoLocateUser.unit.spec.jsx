import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import {
  GEOCODE_COMPLETE,
  GEOCODE_FAILED,
  GEOLOCATE_USER,
  geoLocateUser,
} from '../../actions/geoLocateUser';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('geoLocateUser Action Creator', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});

    if (!global.navigator) {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
      });
    }

    Object.defineProperty(global.navigator, 'geolocation', {
      value: {
        getCurrentPosition: sinon.stub(),
      },
      writable: true,
    });
  });

  it('should dispatch GEOLOCATE_USER and GEOCODE_COMPLETE on successful geolocation', async () => {
    const mockPosition = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    };

    navigator.geolocation.getCurrentPosition.yieldsAsync(mockPosition);

    await store.dispatch(geoLocateUser());

    const actions = store.getActions();
    expect(actions[0]).to.deep.equal({ type: GEOLOCATE_USER });
    expect(actions[1]).to.deep.equal({
      type: GEOCODE_COMPLETE,
      payload: [-122.4194, 37.7749],
    });
  });

  it('should dispatch GEOLOCATE_USER and GEOCODE_FAILED on failed geolocation', async () => {
    navigator.geolocation.getCurrentPosition.callsFake((success, error) =>
      error(),
    );

    await store.dispatch(geoLocateUser());

    const actions = store.getActions();
    expect(actions[0]).to.deep.equal({ type: GEOLOCATE_USER });
    expect(actions[1]).to.deep.equal({ type: GEOCODE_FAILED });
  });

  it('should dispatch GEOCODE_FAILED if geolocation is not supported', async () => {
    Object.defineProperty(global.navigator, 'geolocation', {
      value: undefined,
      writable: true,
    });

    await store.dispatch(geoLocateUser());

    const actions = store.getActions();
    expect(actions[0]).to.deep.equal({ type: GEOCODE_FAILED });
  });
});
