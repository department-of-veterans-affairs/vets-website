import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import moment from 'moment';
import { MENTAL_HEALTH } from '../../utils/constants';

import { WaitTimeAlert } from '../../components/WaitTimeAlert';

const today = moment().format('YYYY-MM-DD');

describe('Wait Time Alert', () => {
  it('should render a warning alert if preferred date is today', () => {
    const tree = shallow(
      <WaitTimeAlert
        preferredDate={today}
        nextAvailableApptDate={today}
        facilityId="123"
        typeOfCareId={MENTAL_HEALTH}
      />,
    );

    const alert = tree.find('AlertBox');
    expect(alert.prop('status')).to.equal('warning');
    expect(alert.dive().text()).to.contain(
      'If you have an urgent medical need, please:',
    );
    tree.unmount();
  });

  it('should render an alert if type of care is mental health, preferred date is > 5 days and next available date is > 20 days away', () => {
    const preferredDate = moment()
      .add(6, 'days')
      .format('YYYY-MM-DD');
    const futureDate = moment()
      .add(22, 'days')
      .format('YYYY-MM-DD');

    const tree = shallow(
      <WaitTimeAlert
        preferredDate={preferredDate}
        nextAvailableApptDate={futureDate}
        typeOfCareId={MENTAL_HEALTH}
        facilityId="123"
        eligibleForRequests
      />,
    );

    const alert = tree.find('AlertBox');
    expect(alert.prop('status')).to.equal('info');
    tree.unmount();
  });

  it('should not render an info alert if type of care is mental health, preferred date is > 5 days and next available date is < 20 days away', () => {
    const preferredDate = moment()
      .add(6, 'days')
      .format('YYYY-MM-DD');
    const futureDate = moment()
      .add(15, 'days')
      .format('YYYY-MM-DD');

    const tree = shallow(
      <WaitTimeAlert
        preferredDate={preferredDate}
        nextAvailableApptDate={futureDate}
        typeOfCareId={MENTAL_HEALTH}
        eligibleForRequests
      />,
    );

    expect(tree.exists('AlertBox')).to.equal(false);
    tree.unmount();
  });

  it('should not render an info alert if type of care is mental health, preferred date is < 5 days and next available date is > 20 days away', () => {
    const preferredDate = moment()
      .add(3, 'days')
      .format('YYYY-MM-DD');
    const futureDate = moment()
      .add(25, 'days')
      .format('YYYY-MM-DD');

    const tree = shallow(
      <WaitTimeAlert
        preferredDate={preferredDate}
        nextAvailableApptDate={futureDate}
        typeOfCareId={MENTAL_HEALTH}
        eligibleForRequests
      />,
    );

    expect(tree.exists('AlertBox')).to.equal(false);
    tree.unmount();
  });

  it('should render an info alert if type of care is not mental, preferred date is > 5 days and next available date is > 28 days away', () => {
    const preferredDate = moment()
      .add(6, 'days')
      .format('YYYY-MM-DD');
    const futureDate = moment()
      .add(30, 'days')
      .format('YYYY-MM-DD');

    const tree = shallow(
      <WaitTimeAlert
        preferredDate={preferredDate}
        nextAvailableApptDate={futureDate}
        typeOfCareId="000"
        facilityId="123"
        eligibleForRequests
      />,
    );

    const alert = tree.find('AlertBox');
    expect(alert.prop('status')).to.equal('info');
    tree.unmount();
  });

  it('should not render an info alert if type of care is not mental, preferred date is > 5 days and next available date is < 20 days away', () => {
    const preferredDate = moment()
      .add(6, 'days')
      .format('YYYY-MM-DD');
    const futureDate = moment()
      .add(15, 'days')
      .format('YYYY-MM-DD');

    const tree = shallow(
      <WaitTimeAlert
        preferredDate={preferredDate}
        nextAvailableApptDate={futureDate}
        typeOfCareId="000"
        facilityId="123"
        eligibleForRequests
      />,
    );

    expect(tree.exists('AlertBox')).to.equal(false);
    tree.unmount();
  });

  it('should not render an info alert if type of care is not mental, preferred date is < 5 days and next available date is > 20 days away', () => {
    const preferredDate = moment()
      .add(3, 'days')
      .format('YYYY-MM-DD');
    const futureDate = moment()
      .add(25, 'days')
      .format('YYYY-MM-DD');

    const tree = shallow(
      <WaitTimeAlert
        preferredDate={preferredDate}
        nextAvailableApptDate={futureDate}
        typeOfCareId="000"
        facilityId="123"
        eligibleForRequests
      />,
    );

    expect(tree.exists('AlertBox')).to.equal(false);
    tree.unmount();
  });

  it('should render a request appointment button if eligible for request', () => {
    const tree = mount(
      <WaitTimeAlert
        preferredDate={today}
        nextAvailableApptDate={today}
        typeOfCareId="000"
        facilityId="123"
        eligibleForRequests
      />,
    );

    expect(tree.exists('AlertBox')).to.equal(true);
    expect(tree.exists('.usa-button-secondary')).to.equal(true);
    tree.unmount();
  });

  it('should render not a request appointment button if not eligible for request', () => {
    const tree = mount(
      <WaitTimeAlert
        preferredDate={today}
        nextAvailableApptDate={today}
        typeOfCareId="000"
        facilityId="123"
        eligibleForRequests={false}
      />,
    );

    expect(tree.exists('AlertBox')).to.equal(true);
    expect(tree.exists('.usa-button-secondary')).to.equal(false);
    tree.unmount();
  });
});
