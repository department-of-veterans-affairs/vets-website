import React from 'react';
import { render } from '@testing-library/react';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { VerifyButton } from '../../components/verifyButton';

const { logingov, idme } = SERVICE_PROVIDERS;

describe('Verify Button', () => {
  [logingov, idme].forEach(csp => {
    const { label, link, image, policy, className } = csp;

    it(`should render correctly for ${policy}`, () => {
      const screen = render(
        <VerifyButton
          key={policy}
          label={label}
          link={link}
          image={image}
          policy={policy}
          className={className}
        />,
      );

      const verifyButton = screen.getByRole('button', {
        name: `Verify with ${label}`,
      });
      expect(verifyButton).to.have.class(`${className}`);
      expect(screen.queryByRole('button')).to.have.attr(
        'aria-label',
        `Verify with ${label}`,
      );
    });

    it('should call the `verifyHandler` function on click', () => {
      const verifyHandlerSpy = sinon.spy();
      const wrapper = shallow(
        <VerifyButton
          key={policy}
          label={label}
          link={link}
          image={image}
          policy={policy}
          className={className}
          onClick={verifyHandlerSpy}
          useOAuth
        />,
      );

      wrapper.find('button').simulate('click');
      expect(verifyHandlerSpy.called).to.be.true;
      wrapper.unmount();
    });
  });
});
