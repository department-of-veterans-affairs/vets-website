import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import AlertBox from '../../components/AlertBox';

describe('<AlertBox>', () => {
  it('should render shouldComponentUpdate and componentDidUpdate', () => {
    const props = {
      isVisible: true,
      scrollOnShow: true,
    };
    const tree = shallow(<AlertBox {...props} />);
    const spyScrollToAlert = sinon.spy(tree.instance(), 'scrollToAlert');
    tree.setProps({ isVisible: true, scrollOnShow: false });
    expect(spyScrollToAlert.called).to.be.false;

    tree.setProps({ isVisible: false, scrollOnShow: true });
    expect(spyScrollToAlert.called).to.be.false;
    spyScrollToAlert.restore();
    tree.unmount();
  });
  it('calls scrollAlert when isVisible is true and OnShow is provided', () => {
    const scrollAlertSpy = sinon.spy(AlertBox.prototype, 'scrollToAlert');
    const tree = mount(<AlertBox isVisible={false} scrollOnShow={false} />);

    tree.setProps({ isVisible: true, scrollOnShow: true });
    expect(scrollAlertSpy.calledOnce).to.be.true;
    scrollAlertSpy.restore();
    tree.unmount();
  });
  it('should show closeButton if onCloseAlert is provided', () => {
    const tree = mount(<AlertBox isVisible scrollOnShow onCloseAlert />);
    const btn = tree.find('button.va-alert-close');
    expect(btn).to.have.lengthOf(1);
    expect(btn.find('va-icon')).to.have.lengthOf(1);
    tree.unmount();
  });
});
