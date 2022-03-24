import React from 'react';
import { CSP_IDS, CSP_CONTENT } from 'platform/user/authentication/constants';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import LoginButton from 'platform/user/authentication/components/LoginButton';

const csps = Object.values(CSP_IDS).filter(csp => csp !== 'myhealthevet');

describe('LoginButton', () => {
  it('should not render with a `csp`', () => {
    const screen = render(<LoginButton />);
    expect(screen.queryByRole('button')).to.be.null;
  });
  csps.forEach(csp => {
    it(`should render correctly for ${csp}`, () => {
      const screen = render(<LoginButton csp={csp} />);

      expect(screen.queryByRole('button')).to.have.attr('data-csp', csp);
      expect(screen.queryByRole('button')).to.have.attr(
        'aria-label',
        `Sign in with ${CSP_CONTENT[csp].COPY}`,
      );
    });
  });
  it('should call the `loginHandler` function on click', () => {
    const loginHandler = sinon.spy();
    const wrapper = shallow(
      <LoginButton csp="dslogon" onClick={loginHandler} />,
    );

    wrapper.find('button').simulate('click');
    expect(loginHandler.called).to.be.true;
    wrapper.unmount();
  });
});
