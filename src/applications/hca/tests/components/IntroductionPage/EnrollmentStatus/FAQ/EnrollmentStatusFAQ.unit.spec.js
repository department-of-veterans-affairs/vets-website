import React from 'react';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { HCA_ENROLLMENT_STATUSES } from '../../../../../utils/constants';
import { EnrollmentStatusFAQ } from '../../../../../components/IntroductionPage/EnrollmentStatus/FAQ';

describe('hca <EnrollmentStatusFAQ>', () => {
  const defaultProps = {
    enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
    route: {
      formConfig: {
        savedFormMessages: {},
        downtime: {},
      },
      pageList: [],
    },
    showReapplyContent: false,
    renderReapplyContent: sinon.spy(),
  };

  describe('when the component renders', () => {
    it(`should render FAQ content`, () => {
      const { container } = render(<EnrollmentStatusFAQ {...defaultProps} />);
      const selector = container.querySelector('h3');
      expect(container).to.not.be.empty;
      expect(selector).to.exist;
    });
  });

  describe('when applying is permitted', () => {
    it('should render the apply link', () => {
      const props = {
        ...defaultProps,
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.activeDuty,
      };
      const { container } = render(<EnrollmentStatusFAQ {...props} />);
      const selector = container.querySelector('.va-button-link');
      expect(selector).to.exist;
      expect(selector).to.contain.text('Apply for VA health care');
    });

    it('should render the reapply content when `showReapplyContent` is true', () => {
      const props = {
        ...defaultProps,
        showReapplyContent: true,
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.activeDuty,
      };
      const wrapper = shallow(<EnrollmentStatusFAQ {...props} />);
      expect(wrapper.find('ProcessTimeline')).to.have.length(1);
      expect(wrapper.find('.hca-sip-intro')).to.have.length(1);
      expect(wrapper.find('OMBInfo')).to.have.length(1);
      wrapper.unmount();
    });
  });

  describe('when reapplying is permitted', () => {
    it('should render the reapply link', () => {
      const props = {
        ...defaultProps,
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.pendingUnverified,
      };
      const { container } = render(<EnrollmentStatusFAQ {...props} />);
      const selector = container.querySelector('.va-button-link');
      expect(selector).to.exist;
      expect(selector).to.contain.text('Reapply for VA health care');
    });

    it('should render the reapply content when `showReapplyContent` is true', () => {
      const props = {
        ...defaultProps,
        showReapplyContent: true,
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime,
      };
      const wrapper = shallow(<EnrollmentStatusFAQ {...props} />);
      expect(wrapper.find('ProcessTimeline')).to.have.length(1);
      expect(wrapper.find('.hca-sip-intro')).to.have.length(1);
      expect(wrapper.find('OMBInfo')).to.have.length(1);
      wrapper.unmount();
    });
  });

  describe('when applying/reapplying is not permitted', () => {
    it('should not render the reapply link', () => {
      const { container } = render(<EnrollmentStatusFAQ {...defaultProps} />);
      const selector = container.querySelector('.va-button-link');
      expect(selector).to.not.exist;
    });

    it('should not render the reapply content', () => {
      const props = {
        ...defaultProps,
        showReapplyContent: true,
      };
      const { container } = render(<EnrollmentStatusFAQ {...props} />);
      const selector = container.querySelector('.hca-sip-intro');
      expect(selector).to.not.exist;
    });
  });

  describe('when the apply/reapply button is clicked', () => {
    const { renderReapplyContent } = defaultProps;
    it('should call the `showReapplyContent` prop', () => {
      expect(renderReapplyContent.callCount).to.equal(0);
      const props = {
        ...defaultProps,
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime,
      };
      const { container } = render(<EnrollmentStatusFAQ {...props} />);
      fireEvent.click(container.querySelector('.va-button-link'));
      expect(renderReapplyContent.callCount).to.equal(1);
    });
  });
});
