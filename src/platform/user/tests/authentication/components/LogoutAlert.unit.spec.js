import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import LogoutAlert from 'platform/user/authentication/components/LogoutAlert';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const mockStore = configureMockStore([]);

describe('LogoutAlert', () => {
  let store;
  let wrapper;

  beforeEach(() => {
    store = mockStore({
      externalServiceStatuses: {
        statuses: [],
        maintenanceWindows: [],
      },
    });
    delete window.location;
    window.location = { search: '?status=sessionExpired' };
    wrapper = mount(
      <Provider store={store}>
        <LogoutAlert />
      </Provider>,
    );
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('renders the session timeout alert', () => {
    expect(wrapper.find(VaAlert).text()).to.include(
      'Your session timed out. Sign in again to continue.',
    );
  });

  it('doesn’t render the session timeout alert if there are downtime banners showing', () => {
    wrapper.unmount();
    store = mockStore({
      externalServiceStatuses: {
        statuses: [{ status: 'down' }],
        maintenanceWindows: [],
      },
    });
    wrapper = mount(
      <Provider store={store}>
        <LogoutAlert />
      </Provider>,
    );
    expect(wrapper.find(VaAlert)).to.have.lengthOf(0);
  });

  it('doesn’t render the session timeout alert if the query parameter is not sessionExpired', () => {
    wrapper.unmount();
    window.location = '/?next=loginModal';
    wrapper = mount(
      <Provider store={store}>
        <LogoutAlert />
      </Provider>,
    );
    expect(wrapper.find(VaAlert)).to.have.lengthOf(0);
  });
});
