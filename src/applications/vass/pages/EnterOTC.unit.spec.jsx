import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';

import EnterOTC from './EnterOTC';

describe('VASS Component: EnterOTC', () => {
  it('should render page title', () => {
    const screen = renderWithStoreAndRouterV6(<EnterOTC />, {
      initialState: {},
    });

    expect(screen.getByTestId('header')).to.exist;
  });

  it('should render success alert with verification message', () => {
    const { container } = renderWithStoreAndRouterV6(<EnterOTC />, {
      initialState: {},
    });
    const alert = container.querySelector('va-alert[status="success"]');

    expect(alert).to.exist;
    expect(alert.getAttribute('visible')).to.exist;
  });

  it('should display email address in alert message', () => {
    const { getByText } = renderWithStoreAndRouterV6(<EnterOTC />, {
      initialState: {},
    });

    expect(getByText(/We just emailed a one-time verification code to/i)).to
      .exist;
    expect(getByText(/test@test.com/i)).to.exist;
  });

  it('should render OTC input field', () => {
    const { container } = renderWithStoreAndRouterV6(<EnterOTC />, {
      initialState: {},
    });
    const otcInput = container.querySelector('va-text-input[name="otc"]');

    expect(otcInput).to.exist;
    expect(otcInput.getAttribute('label')).to.equal(
      'Enter your one-time verification code',
    );
    expect(otcInput.getAttribute('required')).to.exist;
  });

  it('should render continue button', () => {
    const { container } = renderWithStoreAndRouterV6(<EnterOTC />, {
      initialState: {},
    });
    const continueButton = container.querySelector('va-button');

    expect(continueButton).to.exist;
    expect(continueButton.getAttribute('text')).to.equal('Continue');
  });
});
