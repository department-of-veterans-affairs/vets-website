import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { useDefaultFormData } from '../../hooks/useDefaultFormData';

// create wrapper component for our hook
const TestComponent = () => {
  useDefaultFormData();
  return null;
};

describe('`useDefaultFormData` hook', () => {
  const getData = ({ loggedIn = false, dob = undefined }) => ({
    mockStore: {
      getState: () => ({
        disabilityRating: { totalRating: 0 },
        form: { data: { veteranFullName: {} } },
        user: {
          login: { currentlyLoggedIn: loggedIn },
          profile: {
            loa: { current: loggedIn ? 3 : null },
            loading: false,
            dob,
          },
        },
        featureToggles: {
          /* eslint-disable camelcase */
          appoint_a_representative_enable_v2_features: false,
        },
      }),
      subscribe: () => {},
      dispatch: sinon.stub(),
    },
  });
  const subject = ({ mockStore }) =>
    render(
      <Provider store={mockStore}>
        <TestComponent />
      </Provider>,
    );

  it('should fire the `setData` dispatch with the correct data when the user is logged out', () => {
    const { mockStore } = getData({});
    const { dispatch } = mockStore;
    const expectedData = {
      veteranFullName: {},
      'view:isLoggedIn': false,
      'view:isUserLOA3': false,
      'view:v2IsEnabled': false,
    };

    subject({ mockStore });
    expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
    expect(dispatch.firstCall.args[0].data).to.deep.eq(expectedData);
  });

  it('should fire the `setData` dispatch with the correct data when the user is logged in', () => {
    const { mockStore } = getData({ loggedIn: true, dob: '12/14/1986' });
    const { dispatch } = mockStore;
    const expectedData = {
      veteranFullName: {},
      'view:isLoggedIn': true,
      'view:isUserLOA3': true,
      'view:v2IsEnabled': false,
    };

    subject({ mockStore });
    expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
    expect(dispatch.firstCall.args[0].data).to.deep.eq(expectedData);
  });
});
