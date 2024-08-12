import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { AUTH_ERRORS, getAuthError } from 'platform/user/authentication/errors';
import RenderErrorContainer from '../components/RenderErrorContainer';

describe('RenderErrorContainer', () => {
  let renderOptions;

  beforeEach(() => {
    renderOptions = {
      recordEvent: sinon.stub(),
      openLoginModal: sinon.stub(),
    };
  });

  it('should render', () => {
    const wrapper = shallow(<RenderErrorContainer />);

    expect(wrapper.find('h1').exists()).to.be.true;
    expect(wrapper.find('[data-testid="error-code"]').text()).to.include(
      AUTH_ERRORS.DEFAULT.errorCode,
    );
    wrapper.unmount();
  });

  it('should trigger `recordEvent` on fail', () => {
    const wrapper = shallow(
      <RenderErrorContainer recordEvent={renderOptions.recordEvent} />,
    );

    expect(renderOptions.recordEvent.called).to.be.true;
    wrapper.unmount();
  });

  it('should render generic content if codes dont match', () => {
    const wrapper = shallow(<RenderErrorContainer auth="fail" code="900" />);
    expect(wrapper.find('ContactCenterInformation').exists()).to.be.true;
    expect(wrapper.find('[data-testid="error-code"]').text()).to.include('900');
    wrapper.unmount();
  });

  it('should render appropriate content for each error code', () => {
    Object.values(AUTH_ERRORS).forEach(({ errorCode: code }) => {
      const wrapper = shallow(<RenderErrorContainer auth="fail" code={code} />);

      expect(wrapper.find('[data-testid="error-code"]').text()).to.include(
        code,
      );
      wrapper.unmount();
    });
  });

  it('should trigger the `openModalLogin` on certain error codes `001 | 003 | 004 | 005 | 009 | 202`', () => {
    ['001', '003', '004', '005', '009', '202'].forEach(CODE => {
      const { errorCode } = getAuthError(CODE);
      const wrapper = mount(
        <RenderErrorContainer
          auth="fail"
          code={errorCode}
          requestId={`request-${errorCode}`}
          openLoginModal={renderOptions.openLoginModal}
        />,
      );

      const button = wrapper.find('button');
      button.simulate('click');

      expect(renderOptions.openLoginModal.called).to.be.true;
      expect(wrapper.find('[data-testid="error-code"]').text()).to.include(
        errorCode,
      );
      wrapper.unmount();
    });
  });
});
