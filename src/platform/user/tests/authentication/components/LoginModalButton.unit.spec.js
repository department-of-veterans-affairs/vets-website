import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount, shallow } from 'enzyme';
import LoginModalButton from '../../../authentication/components/LoginModalButton';

describe('LoginModal Button', () => {
  let props;
  const fakeStore = {
    getState: () => ({
      context: '',
      shouldConfirmLeavingForm: true,
      analyticsEvent: '',
      message: 'Sign in or create an account',
      className: 'usa-button',
      storeProps: {
        useSignInService: false,
        getBackendStatuses: sinon.spy(),
        toggleFormSignInModal: sinon.spy(),
        toggleLoginModal: sinon.spy(),
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  const generateProps = ({
    context,
    shouldConfirmLeavingForm = true,
    analyticsEvent,
    message = 'Sign in or create an account',
    className,
    storeProps = {
      useSignInService: false,
      getBackendStatuses: sinon.spy(),
      toggleFormSignInModal: sinon.spy(),
      toggleLoginModal: sinon.spy(),
    },
  }) => ({
    context,
    shouldConfirmLeavingForm,
    analyticsEvent,
    message,
    className,
    storeProps,
  });

  it(`should render with default text`, () => {
    props = generateProps({});
    const screen = mount(
      <Provider store={fakeStore}>
        <LoginModalButton {...props} />
      </Provider>,
    );

    const defaultLoginButton = screen.find('button');
    expect(defaultLoginButton.length).to.equal(1);
    expect(defaultLoginButton.text()).to.equal('Sign in or create an account');

    screen.unmount();
  });
  it(`should render button with appropriate customization`, () => {
    props = generateProps({
      context: 'main',
      message: 'new button message',
      className: 'usa-button',
    });
    const screen = mount(
      <Provider store={fakeStore}>
        <LoginModalButton {...props} />
      </Provider>,
    );
    const updatedLoginButton = screen.find('button');

    expect(updatedLoginButton.text()).to.equal('new button message');
    expect(updatedLoginButton.props().className).to.equal('usa-button');
    expect(screen.children().props().context).to.equal('main');
    screen.unmount();
  });

  it(`should call the function on click`, () => {
    props = generateProps({
      context: 'main',
      // message: 'new button message',
      className: 'usa-button',
    });
    // console.log(props);
    const screen = shallow(
      <Provider store={fakeStore}>
        <LoginModalButton {...props} />
      </Provider>,
    );

    const loginModalButton = screen.find('Connect(LoginModalButton)');

    loginModalButton.simulate('click');
    // console.log(props.storeProps.getBackendStatuses);
    // mockGetBackendStatuses.reset();
    // console.log(fakeStore);
    // fireEvent.click(screen.find('LoginModalButton'));

    // console.log(loginModalButton.props('storeProps').getBackendStatuses);
    expect(
      loginModalButton.props('storeProps').shouldConfirmLeavingForm.calledOnce,
    ).to.be.true;
    // expect(props.storeProps.toggleLoginModal.calledOnce).to.be.true;

    // handleSignInSignUpSpy.reset();
    screen.unmount();
  });

  // const mockOAuthUpdateStateAndVerifier = sinon.spy(
  //   OAuthUtils,
  //   'updateStateAndVerifier',
  // );
  // const mockAuthVerify = sinon.stub(AuthUtils, 'verify');
  // const verifyHandlerSpy = sinon.spy(verifyHandler);

  // beforeEach(() => {
  //   mockOAuthUpdateStateAndVerifier.reset();
  //   mockAuthVerify.reset();
  //   verifyHandlerSpy.reset();
  //   localStorage.clear();
  // });

  // it('should not call updateStateAndVerifier if useOAuth is false', () => {
  //   verifyHandlerSpy({ useOAuth: false, policy: 'logingov' });
  //   expect(verifyHandlerSpy.called).to.be.true;
  //   expect(mockOAuthUpdateStateAndVerifier.called).to.be.false;
  // });

  // it('should call updateStateAndVerifier if useOAuth is present', () => {
  //   verifyHandlerSpy({ useOAuth: true, policy: 'logingov' });
  //   expect(verifyHandlerSpy.called).to.be.true;
  //   expect(mockOAuthUpdateStateAndVerifier.called).to.be.true;
  //   expect(mockOAuthUpdateStateAndVerifier.calledWith('logingov')).to.be.true;
  // });

  // it('should call verify when verifyHandler is called', () => {
  //   verifyHandlerSpy({
  //     policy: 'logingov',
  //     useOAuth: true,
  //   });

  //   expect(verifyHandlerSpy.called).to.be.true;
  //   expect(mockAuthVerify.called).to.be.true;
  //   expect(
  //     mockAuthVerify.calledWith({
  //       policy: 'logingov',
  //       useOAuth: true,
  //       acr: defaultWebOAuthOptions.acrVerify.logingov,
  //     }),
  //   ).to.be.true;
  // });
});
