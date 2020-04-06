import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { HCAEnrollmentStatus } from '../../containers/HCAEnrollmentStatus';
import HCAEnrollmentStatusWarning from '../../components/HCAEnrollmentStatusWarning';
import HCAEnrollmentStatusFAQ from '../../components/HCAEnrollmentStatusFAQ';

describe('<HCAEnrollmentStatus />', () => {
  let getEnrollmentStatusSpy;
  let defaultProps = {};
  beforeEach(() => {
    getEnrollmentStatusSpy = sinon.spy();
    defaultProps = {
      applicationDate: '2019-04-24T00:00:00.000-06:00',
      enrollmentDate: '2019-04-30T00:00:00.000-06:00',
      enrollmentStatus: 'enrolled',
      getEnrollmentStatus: getEnrollmentStatusSpy,
      preferredFacility: '463 - CHEY6',
      route: {},
    };
  });
  test('renders an HCAEnrollmentStatusWarning with the correct props', () => {
    const wrapper = shallow(<HCAEnrollmentStatus {...defaultProps} />);
    const statusWarning = wrapper.find(HCAEnrollmentStatusWarning);
    expect(statusWarning.prop('applicationDate')).toBe(
      defaultProps.applicationDate,
    );
    expect(statusWarning.prop('enrollmentDate')).toBe(
      defaultProps.enrollmentDate,
    );
    expect(statusWarning.prop('enrollmentStatus')).toBe(
      defaultProps.enrollmentStatus,
    );
    expect(statusWarning.prop('preferredFacility')).toBe(
      defaultProps.preferredFacility,
    );
    wrapper.unmount;
  });
  test('renders an HCAEnrollmentStatusFAQ with the correct props', () => {
    const wrapper = shallow(<HCAEnrollmentStatus {...defaultProps} />);
    const statusFAQ = wrapper.find(HCAEnrollmentStatusFAQ);
    expect(statusFAQ.prop('enrollmentStatus')).toBe(
      defaultProps.enrollmentStatus,
    );
    expect(statusFAQ.prop('route')).toBe(defaultProps.route);
    wrapper.unmount();
  });
  test('calls its `getEnrollmentStatus` prop when it mounts', () => {
    const wrapper = shallow(<HCAEnrollmentStatus {...defaultProps} />);
    expect(getEnrollmentStatusSpy.callCount).toBe(1);
    wrapper.unmount();
  });
});
