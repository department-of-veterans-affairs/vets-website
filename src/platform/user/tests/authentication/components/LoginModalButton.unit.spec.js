import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as ToggleUtils from 'platform/site-wide/user-nav/actions';
import * as StatusUtils from 'platform/monitoring/external-services/actions';

import {
  onClickHandler,
  LoginModalButton,
} from '../../../authentication/components/LoginModalButton';

const initState = {
  useSignInService: false,
  getBackendStatuses: sinon.spy(),
  toggleFormSignInModal: sinon.spy(),
  inModal: sinon.spy(),
};

const generateState = ({
  context = '',
  shouldConfirmLeavingForm = true,
  analyticsEvent = '',
  message = 'Sign in or create an account',
  className = 'usa-button',
  props = initState,
}) => ({
  context,
  shouldConfirmLeavingForm,
  analyticsEvent,
  message,
  className,
  props,
});

describe('LoginModalButton', () => {
  let props;
  it(`should render a button correctly`, () => {
    props = generateState({
      context: 'test',
    });

    const screen = render(<LoginModalButton {...props} />);

    const verifyButton = screen.getByRole('button', {
      name: `Sign in or create an account`,
    });

    expect(verifyButton).to.have.class(`usa-button`);
  });

  it(`should call the 'onClickHandler' function on click`, () => {
    const onClickHandlerSpy = sinon.spy(onClickHandler);
    const screen = render(
      <LoginModalButton {...props} onClick={onClickHandlerSpy} />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: `Sign in or create an account`,
      }),
    );
    expect(onClickHandlerSpy.called).to.be.true;
    onClickHandlerSpy.reset();
    screen.unmount();
  });
});

describe('onClickHandler', () => {
  const onClickHandlerSpy = sinon.spy(onClickHandler);
  const backendStatusesSpy = sinon.spy(StatusUtils, 'getBackendStatuses');
  const toggleFormSignInSpy = sinon.spy(ToggleUtils, 'toggleFormSignInModal');

  afterEach(() => {
    onClickHandlerSpy.reset();
    backendStatusesSpy.reset();
    toggleFormSignInSpy.reset();
  });

  it('should call toggleFormSignInModal if shouldConfirmLeavingForm is true', () => {
    onClickHandlerSpy(
      generateState({
        context: 'test',
        shouldConfirmLeavingForm: true,
        analyticsEvent: 'cta',
        message: 'Sign in or create an account',
        className: 'usa-button',
      }),
    );

    expect(onClickHandlerSpy.called).to.be.true;
    expect(toggleFormSignInSpy.calledWith(true)).to.be.true;
    expect(backendStatusesSpy.called).to.be.false;
  });

  it('should call getBackendStatuses if shouldConfirmLeavingForm is false', async () => {
    await onClickHandlerSpy(
      generateState({
        context: 'test',
        shouldConfirmLeavingForm: false,
        analyticsEvent: 'cta',
        message: 'Sign in or create an account',
        className: 'usa-button',
      }),
    );
    expect(onClickHandlerSpy.called).to.be.true;
    expect(backendStatusesSpy.called).to.be.true;
  });
});
