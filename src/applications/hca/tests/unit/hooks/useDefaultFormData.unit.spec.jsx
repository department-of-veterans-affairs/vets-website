import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { useDefaultFormData } from '../../../hooks/useDefaultFormData';

// create wrapper component for our hook
const TestComponent = () => {
  useDefaultFormData();
  return null;
};

describe('hca `useDefaultFormData` hook', () => {
  const getData = ({
    loggedIn = false,
    dob = undefined,
    userFullName = undefined,
  }) => ({
    mockStore: {
      getState: () => ({
        disabilityRating: { totalRating: 0 },
        form: { data: { veteranFullName: { first: 'John', last: 'Smith' } } },
        user: {
          login: { currentlyLoggedIn: loggedIn },
          profile: {
            loa: { current: loggedIn ? 3 : null },
            loading: false,
            dob,
            userFullName,
          },
        },
        featureToggles: {
          /* eslint-disable camelcase */
          hca_reg_only_enabled: false,
          hca_insurance_v2_enabled: false,
          loading: false,
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
      veteranFullName: { first: 'John', last: 'Smith' },
      'view:isLoggedIn': false,
      'view:isRegOnlyEnabled': false,
      'view:totalDisabilityRating': 0,
    };

    subject({ mockStore });
    expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
    expect(dispatch.firstCall.args[0].data).to.deep.eq(expectedData);
  });

  it('should fire the `setData` dispatch with the correct data when the user is logged in', () => {
    const { mockStore } = getData({
      loggedIn: true,
      dob: '12/14/1986',
      userFullName: { first: 'Peggy', last: 'Smith' },
    });
    const { dispatch } = mockStore;
    const expectedData = {
      veteranFullName: { first: 'John', last: 'Smith' },
      'view:isLoggedIn': true,
      'view:isRegOnlyEnabled': false,
      'view:totalDisabilityRating': 0,
      'view:veteranInformation': {
        veteranDateOfBirth: '12/14/1986',
        veteranFullName: { first: 'Peggy', last: 'Smith' },
      },
    };

    subject({ mockStore });
    expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
    expect(dispatch.firstCall.args[0].data).to.deep.eq(expectedData);
  });
});
