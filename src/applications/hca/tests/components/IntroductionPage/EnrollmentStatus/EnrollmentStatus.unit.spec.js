import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { EnrollmentStatus } from '../../../../components/IntroductionPage/EnrollmentStatus';
import EnrollmentStatusFAQ from '../../../../components/IntroductionPage/EnrollmentStatus/FAQ';
import EnrollmentStatusWarning from '../../../../components/IntroductionPage/EnrollmentStatus/Warning';

describe('hca <EnrollmentStatus>', () => {
  describe('when the `enrollmentStatus` prop is populated', () => {
    const props = {
      applicationDate: '2019-04-24T00:00:00.000-06:00',
      enrollmentDate: '2019-04-30T00:00:00.000-06:00',
      enrollmentStatus: 'enrolled',
      getEnrollmentStatus: sinon.spy(),
      preferredFacility: '463 - CHEY6',
      route: {
        formConfig: {},
        pageList: [],
      },
    };

    it('should render EnrollmentStatusWarning component with correct props', () => {
      const wrapper = shallow(<EnrollmentStatus {...props} />);
      const selector = wrapper.find(EnrollmentStatusWarning);
      const {
        applicationDate,
        enrollmentDate,
        enrollmentStatus,
        preferredFacility,
      } = props;
      expect(selector.prop('applicationDate')).to.equal(applicationDate);
      expect(selector.prop('enrollmentDate')).to.equal(enrollmentDate);
      expect(selector.prop('enrollmentStatus')).to.equal(enrollmentStatus);
      expect(selector.prop('preferredFacility')).to.equal(preferredFacility);
      wrapper.unmount();
    });

    it('should render EnrollmentStatusFAQ component with correct props', () => {
      const wrapper = shallow(<EnrollmentStatus {...props} />);
      const selector = wrapper.find(EnrollmentStatusFAQ);
      const { enrollmentStatus, route } = props;
      expect(selector.prop('enrollmentStatus')).to.equal(enrollmentStatus);
      expect(selector.prop('route')).to.equal(route);
      wrapper.unmount();
    });
  });

  describe('when the `enrollmentStatus` prop is omitted', () => {
    const props = {
      applicationDate: null,
      enrollmentDate: null,
      enrollmentStatus: null,
      preferredFacility: null,
    };
    it('should not render any components', () => {
      const wrapper = shallow(<EnrollmentStatus {...props} />);
      expect(wrapper).to.be.empty;
      wrapper.unmount();
    });
  });
});
