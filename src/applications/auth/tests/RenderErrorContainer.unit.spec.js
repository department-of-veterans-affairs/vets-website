import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { AUTH_ERROR } from 'platform/user/authentication/constants';
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
    expect(wrapper.find('em').text()).to.include(AUTH_ERROR.DEFAULT);
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

    expect(wrapper.find('Helpdesk').exists()).to.be.true;
    expect(wrapper.find('em').text()).to.include('900');
    wrapper.unmount();
  });

  it('should render appropriate content for each error code', () => {
    Object.keys(AUTH_ERROR).forEach(CODE => {
      const wrapper = shallow(
        <RenderErrorContainer auth="fail" code={AUTH_ERROR[CODE]} />,
      );

      expect(wrapper.find('em').text()).to.include(AUTH_ERROR[CODE]);
      wrapper.unmount();
    });
  });

  it('should trigger the `openModalLogin` on certain error codes `001 | 003 | 004 | 005 | 009`', () => {
    ['001', '003', '004', '005', '009'].forEach(CODE => {
      const wrapper = mount(
        <RenderErrorContainer
          auth="fail"
          code={CODE}
          openLoginModal={renderOptions.openLoginModal}
        />,
      );

      const button = wrapper.find('button');
      button.simulate('click');

      expect(renderOptions.openLoginModal.called).to.be.true;
      expect(wrapper.find('em').text()).to.include(CODE);
      wrapper.unmount();
    });
  });
});
