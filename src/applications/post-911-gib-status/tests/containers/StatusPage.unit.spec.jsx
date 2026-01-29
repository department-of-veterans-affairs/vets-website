import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import createCommonStore from 'platform/startup/store';
import reducer from '../../reducers/index.js';
import StatusPage from '../../containers/StatusPage';

const store = createCommonStore(reducer);
const defaultProps = store.getState();
defaultProps.post911GIBStatus = {
  enrollmentData: {
    veteranIsEligible: true,
    dateOfBirth: '1995-11-12T06:00:00.000+0000',
    remainingEntitlement: {},
    originalEntitlement: {},
    usedEntitlement: {},
  },
};

describe('<StatusPage>', () => {
  afterEach(() => {
    window.dataLayer = [];
  });
  it('should render', () => {
    const tree = mount(
      <Provider store={store}>
        <StatusPage {...defaultProps} />
      </Provider>,
    );
    const vdom = tree.html();
    expect(vdom).to.exist;
    tree.unmount();
  });

  it('should show title and print button', () => {
    const tree = mount(
      <Provider store={store}>
        <StatusPage {...defaultProps} />
      </Provider>,
    );
    expect(tree.find('h1').text()).to.equal(
      'Check your remaining Post-9/11 GI Bill benefits',
    );
    expect(tree.find({ text: 'Get printable statement of benefits' }).exists());
    tree.unmount();
  });

  it('should not show intro and print button if veteran is not eligible', () => {
    const props = {
      enrollmentData: {
        veteranIsEligible: false,
        dateOfBirth: '1995-11-12T06:00:00.000+0000',
        originalEntitlement: {},
        usedEntitlement: {},
        remainingEntitlement: {},
      },
    };

    const tree = shallow(<StatusPage store={store} {...props} />);
    expect(tree.find('.va-introtext').exists()).to.be.false;
    expect(tree.find('.usa-button-primary').exists()).to.be.false;
    tree.unmount();
  });

  it('should navigate to print page when print button is clicked', () => {
    const mockRouter = { push: sinon.spy() };
    const props = { ...defaultProps, router: mockRouter };

    const tree = mount(
      <Provider store={store}>
        <StatusPage {...props} />
      </Provider>,
    );

    const printButton = tree
      .find('#print-button')
      .at(0)
      .getDOMNode();
    printButton.click();
    expect(mockRouter.push.calledOnce).to.be.true;
    expect(mockRouter.push.calledWithExactly('/print')).to.be.true;

    tree.unmount();
  });

  it('should record an event when veteranIsEligible is true', () => {
    const recordEventModule = require('platform/monitoring/record-event');
    const recordEventStub = sinon.stub(recordEventModule, 'default');
    const tree = mount(
      <Provider store={store}>
        <StatusPage {...defaultProps} />
      </Provider>,
    );
    expect(
      recordEventStub.calledWith({
        event: 'post911-status-info-shown',
      }),
    ).to.be.true;
    expect(tree.find('.va-introtext').exists()).to.be.true;
    expect(tree.find('#print-button').exists()).to.be.true;
    recordEventStub.restore();
    tree.unmount();
  });

  it('should render VaNeedHelp with correct telephone numbers', () => {
    const tree = mount(
      <Provider store={store}>
        <StatusPage {...defaultProps} />
      </Provider>,
    );
    // Verify that VaNeedHelp is rendered
    expect(tree.find('VaNeedHelp').exists()).to.be.true;
    // Verify the telephone components inside VaNeedHelp have the expected contacts
    const vaTelephones = tree.find('VaTelephone');
    expect(vaTelephones).to.have.lengthOf(2);
    expect(vaTelephones.at(0).prop('contact')).to.equal('8884424551');
    expect(vaTelephones.at(1).prop('contact')).to.equal('711');
    tree.unmount();
  });

  it('should contain a link to payment history', () => {
    const tree = mount(
      <Provider store={store}>
        <StatusPage {...defaultProps} />
      </Provider>,
    );
    // Verify that the payment history link is present
    const link = tree.find('a[href="/va-payment-history/payments/"]');
    expect(link.exists()).to.be.true;
    tree.unmount();
  });

  it('should render UserInfoSection with enrollmentData prop', () => {
    const tree = mount(
      <Provider store={store}>
        <StatusPage {...defaultProps} />
      </Provider>,
    );
    // Verify that UserInfoSection is rendered and receives the correct enrollmentData
    const userInfoSection = tree.find('UserInfoSection');
    expect(userInfoSection.exists()).to.be.true;
    expect(userInfoSection.prop('enrollmentData')).to.deep.equal(
      defaultProps.post911GIBStatus.enrollmentData,
    );
    tree.unmount();
  });
});
