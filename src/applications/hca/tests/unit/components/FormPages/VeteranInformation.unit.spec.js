import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import VeteranInformation from '../../../../components/FormPages/VeteranInformation';

describe('hca VeteranInformation page', () => {
  const authUser = {
    login: {
      currentlyLoggedIn: true,
    },
    profile: {
      userFullName: {
        first: 'John',
        middle: 'Marjorie',
        last: 'Smith',
        suffix: 'Sr.',
      },
    },
  };
  const guestUser = {
    login: {
      currentlyLoggedIn: false,
    },
    profile: {},
  };
  const mockData = {
    'view:isLoggedIn': false,
    'view:veteranInformation': {
      veteranFullName: {
        first: 'John',
        middle: 'Marjorie',
        last: 'Smith',
        suffix: 'Sr.',
      },
      veteranDateOfBirth: '1986-01-01',
      veteranSocialSecurityNumber: '211557777',
    },
  };
  const getData = ({ formData = {}, user = {} }) => ({
    props: {
      data: formData,
      goBack: sinon.spy(),
      goForward: sinon.spy(),
    },
    mockStore: {
      getState: () => ({
        form: {
          data: formData,
        },
        user,
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });
  const subject = ({ mockStore, props }) => {
    const { container } = render(
      <Provider store={mockStore}>
        <VeteranInformation {...props} />
      </Provider>,
    );
    const selectors = {
      primaryBtn: container.querySelector('.usa-button-primary'),
      secondaryBtn: container.querySelector('.usa-button-secondary'),
      profileCard: container.querySelector('[data-testid="hca-profile-card"]'),
      guestCard: container.querySelector('[data-testid="hca-guest-card"]'),
    };
    return { container, selectors };
  };

  it('should render Veteran information from profile when the user is logged in', () => {
    const { mockStore, props } = getData({
      user: authUser,
      formData: { ...mockData, 'view:isLoggedIn': true },
    });
    const { selectors } = subject({ mockStore, props });
    expect(selectors.profile).to.exist;
    expect(selectors.guest).to.not.exist;
  });

  it('should render Veteran information from ID form when the user is not logged in', () => {
    const { mockStore, props } = getData({
      user: guestUser,
      formData: mockData,
    });
    const { selectors } = subject({ mockStore, props });
    expect(selectors.profile).to.not.exist;
    expect(selectors.guest).to.exist;
  });

  it('should fire `goBack` method when the `back` button is clicked', () => {
    const { mockStore, props } = getData({
      user: guestUser,
      formData: mockData,
    });
    const { selectors } = subject({ mockStore, props });
    fireEvent.click(selectors.secondaryBtn);
    expect(props.goBack.called).to.be.true;
  });

  it('should fire `goForward` spy when the `continue` button is clicked', () => {
    const { mockStore, props } = getData({
      user: guestUser,
      formData: mockData,
    });
    const { selectors } = subject({ mockStore, props });
    fireEvent.click(selectors.primaryBtn);
    expect(props.goForward.called).to.be.true;
  });
});
