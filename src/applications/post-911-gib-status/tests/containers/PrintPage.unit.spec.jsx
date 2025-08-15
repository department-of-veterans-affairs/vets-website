import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import * as ui from 'platform/utilities/ui';
import { PrintPage, mapStateToProps } from '../../containers/PrintPage';

describe('<PrintPage/>', () => {
  // Create dummy elements to simulate header, footer, and va-breadcrumbs
  let headerEl;
  let footerEl;
  let breadcrumbsEl;
  const pushSpy = sinon.spy();
  const defaultProps = { router: { push: pushSpy }, enrollmentData: {} };

  beforeEach(() => {
    // Create and add header, footer, and va-breadcrumbs to the document
    headerEl = document.createElement('header');
    footerEl = document.createElement('footer');
    breadcrumbsEl = document.createElement('va-breadcrumbs');
    document.body.appendChild(headerEl);
    document.body.appendChild(footerEl);
    document.body.appendChild(breadcrumbsEl);
    // Stub focusElement so we can avoid real focusing during tests
    if (!ui.focusElement.isSinonStub) {
      sinon.stub(ui, 'focusElement').callsFake(() => {});
    }
  });

  afterEach(() => {
    // Remove the dummy elements after each test
    document.body.removeChild(headerEl);
    document.body.removeChild(footerEl);
    document.body.removeChild(breadcrumbsEl);
    if (ui.focusElement.isSinonStub) {
      ui.focusElement.restore();
    }
    pushSpy.reset();
  });

  it('should render', () => {
    // Not necessary if not componentWillUnmount
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    const wrapper = shallow(<PrintPage {...defaultProps} />, {
      disableLifecycleMethods: true,
    });
    expect(wrapper.type()).to.equal('div');
  });
  it('should return enrollmentData from state', () => {
    const fakeState = { post911GIBStatus: { enrollmentData: { foo: 'bar' } } };
    // other state properties if needed

    const props = mapStateToProps(fakeState);
    expect(props).to.deep.equal({ enrollmentData: { foo: 'bar' } });
  });
  it('should add no-print-no-sr class on mount', () => {
    const wrapper = mount(<PrintPage {...defaultProps} />);
    expect(headerEl.classList.contains('no-print-no-sr')).to.be.true;
    expect(footerEl.classList.contains('no-print-no-sr')).to.be.true;
    expect(breadcrumbsEl.classList.contains('no-print-no-sr')).to.be.true;
    wrapper.unmount();
  });

  it('should remove no-print-no-sr class on unmount', () => {
    const wrapper = mount(<PrintPage {...defaultProps} />);
    // Verify classes were added on mount
    expect(headerEl.classList.contains('no-print-no-sr')).to.be.true;
    expect(footerEl.classList.contains('no-print-no-sr')).to.be.true;
    expect(breadcrumbsEl.classList.contains('no-print-no-sr')).to.be.true;
    // Unmount component to trigger componentWillUnmount
    wrapper.unmount();
    // Verify classes were removed after unmount
    expect(headerEl.classList.contains('no-print-no-sr')).to.be.false;
    expect(footerEl.classList.contains('no-print-no-sr')).to.be.false;
    expect(breadcrumbsEl.classList.contains('no-print-no-sr')).to.be.false;
  });

  it('renders a UserInfoSection child', () => {
    // Not necessary if not componentWillUnmount
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    const wrapper = shallow(<PrintPage {...defaultProps} />, {
      disableLifecycleMethods: true,
    });
    expect(wrapper.find('UserInfoSection').length).to.equal(1);
  });

  it('should render a print button', () => {
    // Not necessary if not componentWillUnmount
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    const wrapper = shallow(<PrintPage {...defaultProps} />, {
      disableLifecycleMethods: true,
    });
    const printButton = wrapper.find('.usa-button-primary');
    expect(printButton.length).to.equal(1);
  });

  it('should render a back to statement button', () => {
    // Not necessary if not componentWillUnmount
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
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
    // Not necessary if not componentWillUnmount
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
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
    // Not necessary if not componentWillUnmount
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    const wrapper = shallow(<PrintPage {...defaultProps} />, {
      disableLifecycleMethods: true,
    });
    const backButton = wrapper.find('.usa-button-secondary');
    expect(pushSpy.notCalled).to.be.true;
    backButton.simulate('click');
    expect(pushSpy.calledOnce).to.be.true;
  });
  it('should default enrollmentData to an empty object when not provided', () => {
    const props = { router: { push: () => {} } }; // enrollmentData omitted
    // eslint-disable-next-line @department-of-veterans-affairs/enzyme-unmount
    const wrapper = shallow(<PrintPage {...props} />, {
      disableLifecycleMethods: true,
    });
    const userInfoSection = wrapper.find('UserInfoSection');
    expect(userInfoSection.prop('enrollmentData')).to.deep.equal({});
  });
});
