import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import * as profileUtils from 'platform/user/profile/utilities';
import { VerifyApp } from '../../containers/VerifyApp';

const mockProfile = {
  verified: false,
  signIn: { serviceName: 'logingov' },
};
const generateProps = ({
  useOAuth = true,
  profile = mockProfile,
  loading = false,
}) => ({
  loading,
  profile,
  useOAuth,
});

describe('VerifyApp', () => {
  const mockHasSessionHandler = sinon
    .stub(profileUtils, 'hasSession')
    .returns(true);

  let props;

  afterEach(() => {
    mockHasSessionHandler.reset();
    props = {};
  });

  it('renders VerifyApp', () => {
    props = generateProps({});
    const wrapper = render(
      <VerifyApp
        profile={props.profile}
        loading={props.loading}
        useOAuth={props.useOAuth}
      />,
    );

    const verifyApp = wrapper.getByTestId('verify-app');

    mockHasSessionHandler();
    expect(verifyApp);
    wrapper.unmount();
  });
  it('renders loading indicator when app is loading', () => {
    props = generateProps({ loading: true });

    const wrapper = render(
      <VerifyApp
        profile={props.profile}
        loading={props.loading}
        useOAuth={props.useOAuth}
      />,
    );

    const verifyApp = wrapper.getByTestId('loading-indicator');

    mockHasSessionHandler();
    expect(verifyApp);
    wrapper.unmount();
  });

  ['dslogon', 'mhv'].forEach(csp => {
    props = generateProps({
      profile: {
        signIn: {
          serviceName: `${csp}`,
        },
      },
    });
    const { profile } = props;
    it('displays both logingov and idme verification buttons for mhv, and dslogon users', () => {
      const wrapper = render(
        <VerifyApp
          profile={profile}
          loading={props.loading}
          useOAuth={props.useOAuth}
        />,
      );

      mockHasSessionHandler();
      const verifyButtonGroup = wrapper.getByTestId('verify-button-group')
        .children;
      expect(verifyButtonGroup.length).to.equal(2);
      expect(verifyButtonGroup[0]).to.have.attr(
        'aria-label',
        `Verify with Login.gov`,
      );
      expect(verifyButtonGroup[1]).to.have.attr(
        'aria-label',
        `Verify with ID.me`,
      );
      wrapper.unmount();
    });
  });
  ['idme', 'logingov'].forEach(csp => {
    props = generateProps({
      profile: {
        signIn: {
          serviceName: `${csp}`,
        },
      },
    });
    const { profile } = props;
    it(`should display one ${csp} verification button for ${csp} users`, () => {
      const wrapper = render(
        <VerifyApp
          profile={profile}
          loading={props.loading}
          useOAuth={props.useOAuth}
        />,
      );
      mockHasSessionHandler();
      const verifyButton = wrapper.getByTestId('verify-button').children;
      expect(verifyButton.length).to.equal(1);
      expect(verifyButton[0]).to.have.attr('aria-label');
      wrapper.unmount();
    });
  });
  it('should redirect to home page when user is using a verified account', () => {
    props = generateProps({
      loading: true,
      profile: {
        verified: true,
        signIn: { serviceName: 'logingov' },
      },
    });
    const wrapper = render(
      <VerifyApp
        profile={props.profile}
        loading={props.loading}
        useOAuth={props.useOAuth}
      />,
    );

    expect(wrapper.findByTestId('loading-indicator'));
    wrapper.unmount();
  });
});
