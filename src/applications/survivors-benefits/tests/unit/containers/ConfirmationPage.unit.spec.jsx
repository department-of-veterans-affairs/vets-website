import React from 'react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { cleanup, render } from '@testing-library/react';
import ConfirmationPage from '../../../containers/ConfirmationPage';

const mockStore = state => createStore(() => state);

const initConfirmationPage = () => {
  // Used bare minimum config to avoid rendering full chapter collections
  const minimalConfig = { title: 'Test form', chapters: {} };
  const store = mockStore({
    form: {
      submission: {
        response: { attributes: { confirmationNumber: '1234567890' } },
        timestamp: new Date().toISOString(),
      },
    },
  });
  // Add scroll target to prevent scroll utilities from erroring
  const scrollAnchor = document.createElement('div');
  scrollAnchor.setAttribute('name', 'topScrollElement');
  document.body.appendChild(scrollAnchor);
  const rendered = render(
    <Provider store={store}>
      <ConfirmationPage route={{ formConfig: minimalConfig }} />
    </Provider>,
  );
  return { ...rendered, cleanupAnchor: () => scrollAnchor.remove() };
};

describe('ConfirmationPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows success alert, heading, mailing address, and confirmation number', () => {
    const { container, cleanupAnchor } = initConfirmationPage();
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert).to.have.attribute('status', 'success');
    const heading = alert.querySelector('h2');
    expect(heading).to.exist;
    expect(heading.textContent).to.match(/^Form submission started/);
    expect(alert.textContent).to.include(
      'Your confirmation number is 1234567890.',
    );
    const mailingAddress = container.querySelector('.va-address-block');
    expect(mailingAddress).to.exist;
    expect(mailingAddress.textContent).to.include(
      'Department of Veterans Affairs',
    );
    expect(mailingAddress.textContent).to.include('Pension Intake Center');
    expect(mailingAddress.textContent).to.include('PO Box 5365');
    expect(mailingAddress.textContent).to.include('Janesville, WI 53547-5365');
    expect(mailingAddress.textContent).to.include('United States of America');
    cleanupAnchor();
  });
});
