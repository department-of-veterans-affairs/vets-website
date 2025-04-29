import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';
import formConfig from '../../../config/form';
import PersonalInformationPage from '../../../containers/PersonalInformationPage';

describe('hca PersonalInformationPage', () => {
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
      dob: '1986-01-01',
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
      router: { push: sinon.spy() },
      route: {
        pageList: [
          { path: '/previous', formConfig },
          { path: '/current-page' },
          { path: '/next', formConfig },
        ],
      },
      location: {
        pathname: '/current-page',
      },
    },
    mockStore: {
      getState: () => ({
        form: { data: formData },
        user,
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });
  const subject = ({ props, mockStore }) => {
    const { container } = render(
      <Provider store={mockStore}>
        <PersonalInformationPage {...props} />
      </Provider>,
    );
    const selectors = () => ({
      primaryBtn: container.querySelector('.usa-button-primary'),
      secondaryBtn: container.querySelector('.usa-button-secondary'),
      profileCard: container.querySelector('[data-testid="hca-profile-card"]'),
      guestCard: container.querySelector('[data-testid="hca-guest-card"]'),
    });
    return { container, selectors };
  };

  it('should render Veteran information from profile when the user is logged in', () => {
    const { mockStore, props } = getData({
      user: authUser,
      formData: {
        ...mockData,
        'view:totalDisabilityRating': 0,
        'view:isLoggedIn': true,
      },
    });
    const { selectors } = subject({ mockStore, props });
    const { guestCard, profileCard } = selectors();
    expect(profileCard).to.exist;
    expect(guestCard).to.not.exist;
  });

  it('should render Veteran information from identity verification form when the user is not logged in', () => {
    const { mockStore, props } = getData({
      user: guestUser,
      formData: mockData,
    });
    const { selectors } = subject({ mockStore, props });
    const { guestCard, profileCard } = selectors();
    expect(profileCard).to.not.exist;
    expect(guestCard).to.exist;
  });

  it('should fire the routers `push` method with the correct path when the `back` button is clicked', () => {
    const { mockStore, props } = getData({
      user: guestUser,
      formData: mockData,
    });
    const { selectors } = subject({ mockStore, props });
    const { router } = props;
    fireEvent.click(selectors().secondaryBtn);
    expect(router.push.calledWith('/previous')).to.be.true;
  });

  it('should fire the routers `push` method with the correct path the `continue` button is clicked', () => {
    const { mockStore, props } = getData({
      user: guestUser,
      formData: mockData,
    });
    const { selectors } = subject({ mockStore, props });
    const { router } = props;
    fireEvent.click(selectors().primaryBtn);
    expect(router.push.calledWith('/next')).to.be.true;
  });
});
