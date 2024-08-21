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
  personalInfo: {
    personalInfo: { ...UPDATED_USER_MOCK_DATA },
  },
  verifyEnrollment: {
    error: '',
  },
};
let store;
describe('<PeriodsToVerify />', () => {
  it('renders without crashing', () => {
    store = mockStore(initialState);
    const wrapper = shallow(
      <Provider store={store}>
        <PeriodsToVerify verifyEnrollmen={{}} />
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
      personalInfo: {},
      verifyEnrollment: {},
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
      personalInfo: { mockData },
      loggedIEnenrollmentData: {},
      verifyEnrollment: {},
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
  it('should renders  UpToDateVerificationStatement when there is no awardIds and its been verified before', () => {
    store = mockStore(initialState);
    const props = {
      loggedInEnenrollmentData: {
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
      loggedInEnenrollmentData: {
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
      enrollmentData: UPDATED_USER_MOCK_DATA['vye::UserInfo'],
      link: () => {},
      toggleEnrollmentSuccess: false,
      verifyEnrollment: { error: '' },
    };
    const wrapper = mount(
      <Provider store={store}>
        <PeriodsToVerify {...props} />
      </Provider>,
    );
    return new Promise(resolve => setImmediate(resolve)).then(() => {
      wrapper.update();

      const alert = wrapper.find('va-alert');
      expect(alert.text()).to.include('You have enrollment periods to verify');
      wrapper.unmount();
    });
  });
  it('should renders error messsage if something with enrollments verifications went wrong', () => {
    store = mockStore({
      ...initialState,
      verifyEnrollment: { error: 'some error' },
    });
    const props = {
      enrollmentData: UPDATED_USER_MOCK_DATA,
      isUserLoggedIn: false,
      link: () => {},
      toggleEnrollmentSuccess: false,
      verifyEnrollment: { error: 'some error' },
    };
    const wrapper = mount(
      <Provider store={store}>
        <PeriodsToVerify {...props} />
      </Provider>,
    );
    return new Promise(resolve => setImmediate(resolve)).then(() => {
      wrapper.update();

      const alert = wrapper.find('va-alert');
      expect(alert.at(0).text()).to.include(
        ' We’re sorry. Something went wrong on our end. Please try again',
      );
      wrapper.unmount();
    });
  });
});
