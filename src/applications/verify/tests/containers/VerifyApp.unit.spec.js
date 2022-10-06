import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import localStorage from 'platform/utilities/storage/localStorage';
import { VerifyApp } from '../../containers/VerifyApp';

const mockProfile = {
  verified: false,
  signIn: { serviceName: 'logingov' },
};
const generateProps = ({
  useOAuth = false,
  profile = mockProfile,
  loading = false,
}) => ({
  loading,
  profile,
  useOAuth,
});

describe('VerifyApp', () => {
  let props;

  afterEach(() => {
    props = {};
    localStorage.clear();
  });

  it('renders VerifyApp', () => {
    props = generateProps({});
    localStorage.setItem('hasSession', true);
    const wrapper = render(<VerifyApp {...props} />);

    const verifyApp = wrapper.getByTestId('verify-app');

    expect(verifyApp);
    wrapper.unmount();
  });
  it('renders loading indicator when app is loading', () => {
    props = generateProps({ loading: true });
    localStorage.setItem('hasSession', true);

    const wrapper = render(<VerifyApp {...props} />);

    const verifyApp = wrapper.getByTestId('loading-indicator');

    expect(verifyApp);
    wrapper.unmount();
  });

  ['dslogon', 'mhv'].forEach(csp => {
    it('displays both logingov and idme verification buttons for mhv, and dslogon users', () => {
      props = generateProps({
        profile: {
          signIn: {
            serviceName: csp,
          },
        },
      });
      const wrapper = render(<VerifyApp {...props} />);

      localStorage.setItem('hasSession', true);
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
    it(`should display one ${csp} verification button for ${csp} users`, () => {
      props = generateProps({
        profile: {
          signIn: {
            serviceName: `${csp}`,
          },
        },
      });
      localStorage.setItem('hasSession', true);
      const wrapper = render(<VerifyApp {...props} />);
      const verifyButton = wrapper.getByTestId('verify-button').children;
      expect(verifyButton.length).to.equal(1);
      expect(verifyButton[0]).to.have.attr('aria-label');
      wrapper.unmount();
    });
  });
  it('should redirect to home page when user is using a verified account', () => {
    localStorage.setItem('hasSession', true);
    props = generateProps({
      loading: true,
      profile: {
        verified: true,
        signIn: { serviceName: 'logingov' },
      },
    });
    const wrapper = render(<VerifyApp {...props} />);

    expect(wrapper.findByTestId('loading-indicator'));
    wrapper.unmount();
  });
});
