import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import NeedHelp from '../../components/NeedHelp';
import { ConfirmationPage } from '../../containers/ConfirmationPage';

// Simple mock for Redux store
const mockStore = {
  getState: () => ({
    form: {
      submission: {
        timestamp: '2023-01-01',
        response: { confirmationNumber: '123456' },
      },
      data: { fullName: { first: 'Test', last: 'User' } },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

// Simple mock for the VA web components that don't exist in test environment
beforeEach(() => {
  global.customElements = {
    get: () => undefined,
    define: () => {},
  };

  // Register all components with a single function to avoid multiple class definitions
  const defineElement = name => {
    const proto = Object.create(HTMLElement.prototype);
    proto.connectedCallback = function() {};
    customElements.define(name, function createElement() {
      return proto;
    });
  };
  defineElement('va-need-help');
  defineElement('va-telephone');
  defineElement('va-alert');
  defineElement('va-button');
});

describe('NeedHelp', () => {
  it('renders the component', () => {
    const { container } = render(<NeedHelp />);
    expect(container).to.exist;
  });

  it('renders within ConfirmationPage', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(container).to.exist;
  });
});
