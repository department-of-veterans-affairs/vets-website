import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { EnrollmentStatus } from '../../../../components/IntroductionPage/EnrollmentStatus';
import EnrollmentStatusFAQ from '../../../../components/IntroductionPage/EnrollmentStatus/FAQ';
import EnrollmentStatusWarning from '../../../../components/IntroductionPage/EnrollmentStatus/Warning';

describe('hca <EnrollmentStatus>', () => {
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
      route: {
        formConfig: {},
        pageList: [],
      },
    };
  });

  it('renders an EnrollmentStatusWarning with the correct props', () => {
    const wrapper = shallow(<EnrollmentStatus {...defaultProps} />);
    const statusWarning = wrapper.find(EnrollmentStatusWarning);
    expect(statusWarning.prop('applicationDate')).to.equal(
      defaultProps.applicationDate,
    );
    expect(statusWarning.prop('enrollmentDate')).to.equal(
      defaultProps.enrollmentDate,
    );
    expect(statusWarning.prop('enrollmentStatus')).to.equal(
      defaultProps.enrollmentStatus,
    );
    expect(statusWarning.prop('preferredFacility')).to.equal(
      defaultProps.preferredFacility,
    );
    wrapper.unmount();
  });

  it('renders an EnrollmentStatusFAQ with the correct props', () => {
    const wrapper = shallow(<EnrollmentStatus {...defaultProps} />);
    const statusFAQ = wrapper.find(EnrollmentStatusFAQ);
    expect(statusFAQ.prop('enrollmentStatus')).to.equal(
      defaultProps.enrollmentStatus,
    );
    expect(statusFAQ.prop('route')).to.equal(defaultProps.route);
    wrapper.unmount();
  });
});
