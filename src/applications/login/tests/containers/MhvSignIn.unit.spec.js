import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import MhvSignIn from '../../containers/MhvSignIn';

describe('MhvSignIn Component', () => {
  it('renders the heading and description', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);
    expect(screen.getByRole('heading', { name: /My HealtheVet test account/i }))
      .to.exist;
    expect(
      screen.getByText(
        /My HealtheVet test accounts are available for VA and Oracle Health staff only\./i,
      ),
    ).to.exist;
  });

  it('renders email input and checkbox', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);
    const emailInput = screen.getByTestId('mvhemailinput');
    // const checkbox = screen.getByLabelText(
    //   /I’m using My HealtheVet for official VA testing, training, or development purposes\./i,
    // );
    expect(emailInput).to.exist;
    // expect(checkbox).to.exist;
  });

  it('validates email input with allowed domains', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);
    const emailInput = screen.getByTestId('mvhemailinput');

    fireEvent.input(emailInput, { target: { value: 'test@va.gov' } });
    expect(emailInput).to.have.value('test@va.gov');
    expect(
      screen.queryByText(/Please enter a valid VA or Oracle Health email/i),
    ).to.not.exist;

    fireEvent.input(emailInput, { target: { value: 'test@gmail.com' } });
    expect(emailInput).to.have.value('test@gmail.com');
    expect(screen.getByText(/Please enter a valid VA or Oracle Health email/i))
      .to.exist;
  });

  // it('toggles checkbox state correctly', () => {
  //   const screen = renderInReduxProvider(<MhvSignIn />);

  //   const checkbox = screen.getByLabelText(
  //     /I’m using My HealtheVet for official VA testing, training, or development purposes\./i
  //   );

  //   expect(checkbox.checked).to.be.false;
  //   fireEvent.click(checkbox);
  //   expect(checkbox.checked).to.be.true;
  //   fireEvent.click(checkbox);
  //   expect(checkbox.checked).to.be.false;
  // });

  it('renders the login button with correct props', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);
    expect(screen.getByRole('button', { text: /Access My HealtheVet/i })).to
      .exist;
  });

  it('renders the "Having trouble signing in?" section', () => {
    const screen = renderInReduxProvider(<MhvSignIn />);
    expect(
      screen.getByRole('heading', { name: /Having trouble signing in\?/i }),
    ).to.exist;
    expect(
      screen.getByText(
        /Contact the administrator who gave you access to your test account\./i,
      ),
    ).to.exist;
  });
});
