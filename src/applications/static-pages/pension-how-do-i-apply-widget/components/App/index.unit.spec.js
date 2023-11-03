import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { App, mapStateToProps } from '.';

const store = ({ pensionFormEnabled = false } = {}) => ({
  getState: () => ({
    user: {
      profile: {
        loading: false,
        savedForms: [],
      },
      login: {
        currentlyLoggedIn: true,
      },
    },
    featureToggles: {
      loading: false,
      // eslint-disable-next-line camelcase
      pension_form_enabled: pensionFormEnabled,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('Pension Widget <App>', () => {
  it('renders the pension widget app', () => {
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
    expect($('h3', container).textContent).to.equal(
      `The PDF form is the only computer option for applying right now`,
    );
  });

  it('renders the application status component', () => {
    const mockStore = store({ pensionFormEnabled: true });
    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
    expect($('h2', container).textContent).to.equal(`How do I apply?`);
  });

  it('shows "Refer to your saved form" link when user is logged in', () => {
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <App loggedIn />
      </Provider>,
    );

    const selector = 'va-link[href="/pension/application/527EZ/introduction"]';
    expect($(selector, container)).to.not.be.null;
  });

  describe('mapStateToProps', () => {
    it('should render appropriately', () => {
      const goodObj = { user: { login: { currentlyLoggedIn: false } } };
      expect(mapStateToProps(goodObj)).to.eql({ loggedIn: false });
    });
  });
});
