import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { mount, shallow } from 'enzyme';
import { waitFor } from '@testing-library/react';
import { USER_MOCK_DATA } from '../../constants/mockData';
import PeriodsToVerify from '../../components/PeriodsToVerify';

const mockStore = configureMockStore();
const initialState = {
  getDataReducer: {
    data: {
      ...USER_MOCK_DATA,
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
});
