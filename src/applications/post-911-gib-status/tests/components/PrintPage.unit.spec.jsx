import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { PrintPage } from '../../containers/PrintPage';

describe('<PrintPage/>', () => {
  const pushSpy = sinon.spy();
  const defaultProps = {
    router: { push: pushSpy },
    enrollmentData: {},
  };

  afterEach(() => pushSpy.reset());

  it('should render', () => {
    // eslint-disable-next-line va-enzyme/unmount
    const wrapper = shallow(<PrintPage {...defaultProps} />, {
      disableLifecycleMethods: true,
    });
    expect(wrapper.type()).to.equal('div');
  });

  it('renders a UserInfoSection child', () => {
    // eslint-disable-next-line va-enzyme/unmount
    const wrapper = shallow(<PrintPage {...defaultProps} />, {
      disableLifecycleMethods: true,
    });
    expect(wrapper.find('UserInfoSection').length).to.equal(1);
  });

  it('should render a print button', () => {
    // eslint-disable-next-line va-enzyme/unmount
    const wrapper = shallow(<PrintPage {...defaultProps} />, {
      disableLifecycleMethods: true,
    });
    const printButton = wrapper.find('.usa-button-primary');
    expect(printButton.length).to.equal(1);
  });

  it('should render a back to statement button', () => {
    // eslint-disable-next-line va-enzyme/unmount
    const wrapper = shallow(<PrintPage {...defaultProps} />, {
      disableLifecycleMethods: true,
    });
    const backButton = wrapper.find('.usa-button-secondary');
    expect(backButton.length).to.equal(1);
  });

  it('should fire a print request when print button clicked', () => {
    const oldPrint = global.window.print;
    const printSpy = sinon.spy();
    global.window.print = printSpy;
    // eslint-disable-next-line va-enzyme/unmount
    const wrapper = shallow(<PrintPage {...defaultProps} />, {
      disableLifecycleMethods: true,
    });
    const printButton = wrapper.find('.usa-button-primary');
    expect(printSpy.notCalled).to.be.true;
    printButton.simulate('click');
    expect(printSpy.calledOnce).to.be.true;
    global.window.print = oldPrint;
  });

  it('should navigate to statement when back to statement button clicked', () => {
    // eslint-disable-next-line va-enzyme/unmount
    const wrapper = shallow(<PrintPage {...defaultProps} />, {
      disableLifecycleMethods: true,
    });
    const backButton = wrapper.find('.usa-button-secondary');
    expect(pushSpy.notCalled).to.be.true;
    backButton.simulate('click');
    expect(pushSpy.calledOnce).to.be.true;
  });
});
