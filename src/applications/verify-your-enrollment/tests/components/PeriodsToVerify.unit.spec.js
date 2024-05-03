import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { mount, shallow } from 'enzyme';
import { waitFor } from '@testing-library/react';
import { UPDATED_USER_MOCK_DATA } from '../../constants/mockData';
import PeriodsToVerify from '../../components/PeriodsToVerify';

const mockStore = configureMockStore();
const initialState = {
  getDataReducer: {
    data: {
      ...UPDATED_USER_MOCK_DATA,
    },
  },
  personalInfo: {
    personalInfo: {},
  },
};
let store;
describe('<PeriodsToVerify />', () => {
  it('renders without crashing', () => {
    store = mockStore(initialState);
    const wrapper = shallow(
      <Provider store={store}>
        <PeriodsToVerify />
      </Provider>,
    );
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('shows loader when loading is true', async () => {
    store = mockStore(initialState);
    const props = {
      loading: true,
      isUserLoggedIn: false,
      enrollmentData: {},
      loggedIEnenrollmentData: {},
      dispatchUpdatePendingVerifications: sinon.spy(),
      dispatchUpdateVerifications: sinon.spy(),
      dispatchVerifyEnrollmentAction: sinon.spy(),
    };

    const wrapper = mount(
      <Provider store={store}>
        <PeriodsToVerify {...props} />
      </Provider>,
    );
    await waitFor(() => {
      expect(wrapper.find('Loader').exists()).to.be.false;
    });
    wrapper.unmount();
  });
  it('should renders up to date statement with blank enrollmentdata', async () => {
    const mockData = initialState.personalInfo;
    store = mockStore(mockData);
    const props = {
      loading: false,
      isUserLoggedIn: false,
      enrollmentData: { mockData },
      loggedIEnenrollmentData: {},
      dispatchUpdatePendingVerifications: sinon.spy(),
      dispatchUpdateVerifications: sinon.spy(),
      dispatchVerifyEnrollmentAction: sinon.spy(),
    };
    const wrapper = shallow(
      <Provider store={store}>
        <PeriodsToVerify {...props} />
      </Provider>,
    );
    expect(
      wrapper
        .find('p')
        .someWhere(t => t.text().includes("You're up-to-date with your")),
    ).to.equal(false);
    wrapper.unmount();
  });
  it('should set data to loggedInEnenrollmentData when user is isUserLoggedIn', () => {
    const props = {
      enrollmentData: {},
      loggedInEnenrollmentData: {
        'vye::UserInfo': {
          pendingVerifications: {
            awardIds: [1, 2, 3],
          },
        },
      },
      isUserLoggedIn: true,
      link: () => {},
      toggleEnrollmentSuccess: false,
    };
    const wrapper = mount(
      <Provider store={store}>
        <PeriodsToVerify {...props} />
      </Provider>,
    );

    wrapper.update();

    const alert = wrapper.find('va-alert');

    expect(alert).to.have.lengthOf(0);
    wrapper.unmount();
  });
  it('should render VerifiedSuccessStatement when there are no pending verifications', () => {
    const props = {
      enrollmentData: {
        'vye::UserInfo': {
          pendingVerifications: [],
        },
      },
      isUserLoggedIn: false,
      link: () => {},
      toggleEnrollmentSuccess: true,
    };
    const wrapper = mount(
      <Provider store={store}>
        <PeriodsToVerify {...props} />
      </Provider>,
    );

    const div = wrapper.find(
      'div.vads-u-font-size--h2.vads-u-font-weight--bold.vye-h2-style-as-h3',
    );
    expect(div).to.have.lengthOf(1);
    wrapper.unmount();
  });
  it('should renders  UpToDateVerificationStatement when there is no awardIds and its been verified before', () => {
    const props = {
      enrollmentData: {
        'vye::UserInfo': {
          pendingVerifications: [],
        },
      },
      isUserLoggedIn: false,
      link: () => {},
      toggleEnrollmentSuccess: false,
    };
    const wrapper = mount(
      <Provider store={store}>
        <PeriodsToVerify {...props} />
      </Provider>,
    );

    const alert = wrapper.find('va-alert.vads-u-margin-bottom--1');

    expect(alert).to.exist;
    wrapper.unmount();
  });
  it('should renders  va-alert for You have enrollment periods to verify  when there is awardIds', () => {
    const props = {
      enrollmentData: {
        'vye::UserInfo': {
          pendingVerifications: {
            awardIds: [29, 30, 31],
          },
        },
      },
      isUserLoggedIn: false,
      link: () => {},
      toggleEnrollmentSuccess: false,
    };
    const wrapper = mount(
      <Provider store={store}>
        <PeriodsToVerify {...props} />
      </Provider>,
    );

    const alert = wrapper.find('va-alert');

    expect(alert).to.exist;
    wrapper.unmount();
  });
  it('renders the pending enrollments when there are awards and pending verifications', () => {
    const props = {
      enrollmentData: UPDATED_USER_MOCK_DATA,
      isUserLoggedIn: false,
      link: () => {},
      toggleEnrollmentSuccess: false,
    };
    const wrapper = mount(
      <Provider store={store}>
        <PeriodsToVerify {...props} />
      </Provider>,
    );
    return new Promise(resolve => setImmediate(resolve)).then(() => {
      wrapper.update();

      const alert = wrapper.find('va-alert');
      expect(alert).to.have.lengthOf(1);
      expect(alert.text()).to.include('You have enrollment periods to verify');
      wrapper.unmount();
    });
  });
});
