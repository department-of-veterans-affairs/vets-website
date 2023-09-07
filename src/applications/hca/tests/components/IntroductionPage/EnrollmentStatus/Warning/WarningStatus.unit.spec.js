import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { HCA_ENROLLMENT_STATUSES } from '../../../../../utils/constants';
import WarningStatus from '../../../../../components/IntroductionPage/EnrollmentStatus/Warning/WarningStatus';

describe('hca <WarningStatus>', () => {
  describe('when compontent renders', () => {
    describe('when `applicationDate` is omitted', () => {
      const props = {
        enrollmentStatus: 'enrollment_status',
        applicationDate: null,
      };
      it('should render empty', () => {
        const { container } = render(<WarningStatus {...props} />);
        expect(container).to.be.empty;
      });
    });

    describe('when `applicationDate` is provided', () => {
      const props = {
        enrollmentStatus: 'enrollment_status',
        applicationDate: '2018-01-24T00:00:00.000-06:00',
      };
      it('should render the correct content', () => {
        const { container } = render(<WarningStatus {...props} />);
        const selector = container.querySelectorAll('li');
        expect(selector).to.have.lengthOf(1);
        expect(container).to.contain.text('You applied on:');
      });
    });
  });

  describe('when `enrollmentStatus` is `deceased`', () => {
    const props = {
      enrollmentStatus: HCA_ENROLLMENT_STATUSES.deceased,
    };
    it('should render empty', () => {
      const { container } = render(<WarningStatus {...props} />);
      expect(container).to.be.empty;
    });
  });

  describe('when `enrollmentStatus` is `enrolled`', () => {
    const defaultProps = {
      enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
      applicationDate: null,
      enrollmentDate: null,
      preferredFacility: null,
    };

    describe('when no additional props are provided', () => {
      it('should render empty', () => {
        const { container } = render(<WarningStatus {...defaultProps} />);
        expect(container).to.be.empty;
      });
    });

    describe('when all props are provided', () => {
      const props = {
        ...defaultProps,
        applicationDate: '2018-01-24T00:00:00.000-06:00',
        enrollmentDate: '2018-01-24T00:00:00.000-06:00',
        preferredFacility: 'FACILITY NAME',
      };
      it('should render the correct content', () => {
        const { container } = render(<WarningStatus {...props} />);
        const selector = container.querySelectorAll('li');
        expect(selector).to.have.lengthOf(3);
        expect(container).to.contain.text('You applied on:');
        expect(container).to.contain.text('We enrolled you on:');
        expect(container).to.contain.text(
          'Your preferred VA medical center is:',
        );
      });
    });

    describe('when the `applicationDate` is omitted', () => {
      const props = {
        ...defaultProps,
        enrollmentDate: '2018-01-24T00:00:00.000-06:00',
        preferredFacility: 'FACILITY NAME',
      };
      it('should render the correct content', () => {
        const { container } = render(<WarningStatus {...props} />);
        const selector = container.querySelectorAll('li');
        expect(selector).to.have.lengthOf(2);
        expect(container).to.not.contain.text('You applied on:');
        expect(container).to.contain.text('We enrolled you on:');
        expect(container).to.contain.text(
          'Your preferred VA medical center is:',
        );
      });
    });

    describe('when the `enrollmentDate` is omitted', () => {
      const props = {
        ...defaultProps,
        applicationDate: '2018-01-24T00:00:00.000-06:00',
        preferredFacility: 'FACILITY NAME',
      };
      it('should render the correct content', () => {
        const { container } = render(<WarningStatus {...props} />);
        const selector = container.querySelectorAll('li');
        expect(selector).to.have.lengthOf(2);
        expect(container).to.contain.text('You applied on:');
        expect(container).to.not.contain.text('We enrolled you on:');
        expect(container).to.contain.text(
          'Your preferred VA medical center is:',
        );
      });
    });

    describe('when the `preferredFacility` is not set', () => {
      const props = {
        ...defaultProps,
        applicationDate: '2018-01-24T00:00:00.000-06:00',
        enrollmentDate: '2018-01-24T00:00:00.000-06:00',
      };
      it('should render the correct content', () => {
        const { container } = render(<WarningStatus {...props} />);
        const selector = container.querySelectorAll('li');
        expect(selector).to.have.lengthOf(2);
        expect(container).to.contain.text('You applied on:');
        expect(container).to.contain.text('We enrolled you on:');
        expect(container).to.not.contain.text(
          'Your preferred VA medical center is:',
        );
      });
    });

    describe('when only `preferredFacility` is set', () => {
      const props = {
        ...defaultProps,
        preferredFacility: 'FACILITY NAME',
      };
      it('should render the correct content', () => {
        const { container } = render(<WarningStatus {...props} />);
        const selector = container.querySelectorAll('li');
        expect(selector).to.have.lengthOf(1);
        expect(container).to.not.contain.text('You applied on:');
        expect(container).to.not.contain.text('We enrolled you on:');
        expect(container).to.contain.text(
          'Your preferred VA medical center is:',
        );
      });
    });
  });
});
