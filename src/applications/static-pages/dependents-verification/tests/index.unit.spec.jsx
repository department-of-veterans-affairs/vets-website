import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { App } from '../components/App';

const mockStore = configureStore([]);

function makeStore({ loading, enabled }) {
  return mockStore({
    featureToggles: {
      loading,
      // eslint-disable-next-line camelcase
      va_dependents_verification: enabled,
    },
  });
}

describe('0538 Dependents Verification <App>', () => {
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
        wrapper.contains(<p>You can submit this form in 1 of these 2 ways:</p>),
      ).to.equal(true);

      expect(wrapper.find('va-link-action')).to.have.lengthOf(1);
      expect(wrapper.find('va-link')).to.have.lengthOf(1);

      // Check for Option 1 content
      expect(wrapper.text()).to.include('Option 1: Verify online');
      expect(wrapper.text()).to.include(
        'You can verify your dependents online right now.',
      );

      // Check for Option 2 content
      expect(wrapper.text()).to.include(
        'Option 2: Mail us the verification form',
      );
      expect(wrapper.text()).to.include(
        'Fill out the Mandatory Verification of Dependents (VA Form 21-0538).',
      );

      // Check for address block
      expect(wrapper.text()).to.include('Department of Veterans Affairs');
      expect(wrapper.text()).to.include('Evidence Intake Center');
      expect(wrapper.text()).to.include('Janesville, WI 53547-4444');

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

      // Check that online option is not present
      expect(wrapper.text()).to.not.include('Option 1: Verify online');
      expect(wrapper.text()).to.not.include(
        'You can verify your dependents online right now.',
      );

      // Check that mail instructions are present
      expect(wrapper.text()).to.include(
        'Fill out the Mandatory Verification of Dependents (VA Form 21-0538).',
      );

      // Check for address block
      expect(wrapper.text()).to.include('Department of Veterans Affairs');
      expect(wrapper.text()).to.include('Evidence Intake Center');
      expect(wrapper.text()).to.include('Janesville, WI 53547-4444');

      wrapper.unmount();
    });
  });
});
