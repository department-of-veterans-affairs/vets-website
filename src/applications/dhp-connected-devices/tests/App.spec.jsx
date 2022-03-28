import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import App from '../containers/App';

describe('auth flow', () => {
  it('shows sign in button when vet is not logged in', () => {
    const fakeStore = {
      getState: () => ({
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const app = shallow(<App store={fakeStore} />);
    expect(app.find({ testId: 'sign-in' })).to.exist;
    app.unmount();
  });
});
