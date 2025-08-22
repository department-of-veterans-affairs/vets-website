import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { App } from '.';

const mockStore = configureStore([]);

function makeStore({ loading, enabled }) {
  return mockStore({
    featureToggles: {
      loading,
      // eslint-disable-next-line camelcase
      income_and_assets_form_enabled: enabled,
    },
  });
}

describe('0969 Staged Entry <App>', () => {
  it('shows loading indicator while feature toggles are loading', () => {
    const store = makeStore({ loading: true, enabled: false });
    const wrapper = mount(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(wrapper.find('va-loading-indicator')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  describe('when the form is enabled', () => {
    it('renders the online form link and the download link', () => {
      const store = makeStore({ loading: false, enabled: true });
      const wrapper = mount(
        <Provider store={store}>
          <App />
        </Provider>,
      );

      expect(
        wrapper.contains(<p>You can submit this form online or by mail.</p>),
      ).to.equal(true);

      expect(wrapper.find('va-link-action')).to.have.lengthOf(1);
      expect(wrapper.find('va-link')).to.have.lengthOf(1);

      wrapper.unmount();
    });
  });

  describe('when the form is disabled', () => {
    it('renders only the download link (no online form link)', () => {
      const store = makeStore({ loading: false, enabled: false });
      const wrapper = mount(
        <Provider store={store}>
          <App />
        </Provider>,
      );

      expect(
        wrapper.contains(<p>You can submit this form by mail.</p>),
      ).to.equal(true);

      expect(wrapper.find('va-link-action')).to.have.lengthOf(0);
      expect(wrapper.find('va-link')).to.have.lengthOf(1);

      wrapper.unmount();
    });
  });
});
