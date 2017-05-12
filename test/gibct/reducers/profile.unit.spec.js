import { expect } from 'chai';

import profileReducer from '../../../src/js/gi/reducers/profile.js';

const initialState = {
  attributes: {},
  version: {},
  inProgress: false,
};

describe('profile reducer', () => {
  it('should handle profile fetch started', () => {
    const state = profileReducer(
      initialState,
      {
        type: 'FETCH_PROFILE_STARTED'
      }
    );

    expect(state.inProgress).to.be.eql(true);
  });

  it('should handle profile fetch failure', () => {
    const state = profileReducer(
      { inProgress: true },
      {
        type: 'FETCH_PROFILE_FAILED',
        err: {
          errorMessage: 'error'
        },
      }
    );

    expect(state.errorMessage).to.be.eql('error');
    expect(state.inProgress).to.be.eql(false);
  });

  it('should handle profile fetch success', () => {
    const state = profileReducer(
      { inProgress: true },
      {
        type: 'FETCH_PROFILE_SUCCEEDED',
        payload: {
          data: {
            attributes: {
              name: 'name'
            },
            links: {}
          },
          meta: {
            version: 1
          }
        }
      }
    );

    expect(state.inProgress).to.be.eql(false);
    expect(state.attributes.name).to.be.eql('NAME');
    expect(state.version).to.be.eql(1);
  });
});
