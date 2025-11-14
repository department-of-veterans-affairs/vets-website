import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import EnterOTC from './EnterOTC';

describe('VASS Component: EnterOTC', () => {
  it('should render page title', () => {
    const screen = render(
      <MemoryRouter>
        <EnterOTC />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('header')).to.exist;
  });

  it('should render success alert with verification message', () => {
    const { container } = render(
      <MemoryRouter>
        <EnterOTC />
      </MemoryRouter>,
    );
    const alert = container.querySelector('va-alert[status="success"]');

    expect(alert).to.exist;
    expect(alert.getAttribute('visible')).to.exist;
  });

  it('should display email address in alert message', () => {
    const { getByText } = render(
      <MemoryRouter>
        <EnterOTC />
      </MemoryRouter>,
    );

    expect(getByText(/We just emailed a one-time verification code to/i)).to
      .exist;
    expect(getByText(/test@test.com/i)).to.exist;
  });

  it('should render OTC input field', () => {
    const { container } = render(
      <MemoryRouter>
        <EnterOTC />
      </MemoryRouter>,
    );
    const otcInput = container.querySelector('va-text-input[name="otc"]');

    expect(otcInput).to.exist;
    expect(otcInput.getAttribute('label')).to.equal(
      'Enter your one-time verification code',
    );
    expect(otcInput.getAttribute('required')).to.exist;
  });

  it('should render continue button', () => {
    const { container } = render(
      <MemoryRouter>
        <EnterOTC />
      </MemoryRouter>,
    );
    const continueButton = container.querySelector('va-button');

    expect(continueButton).to.exist;
    expect(continueButton.getAttribute('text')).to.equal('Continue');
  });
});
