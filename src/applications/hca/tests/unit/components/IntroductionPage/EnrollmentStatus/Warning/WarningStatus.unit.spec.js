import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { HCA_ENROLLMENT_STATUSES } from '../../../../../../utils/constants';
import WarningStatus from '../../../../../../components/IntroductionPage/EnrollmentStatus/Warning/WarningStatus';

describe('hca <WarningStatus>', () => {
  const getData = ({
    enrollmentStatus = 'enrollment_status',
    applicationDate = null,
    enrollmentDate = null,
    preferredFacility = null,
  }) => ({
    props: {
      enrollmentStatus,
      applicationDate,
      enrollmentDate,
      preferredFacility,
    },
  });

  context('when `applicationDate` is omitted', () => {
    const { props } = getData({});

    it('should render empty', () => {
      const { container } = render(<WarningStatus {...props} />);
      expect(container).to.be.empty;
    });
  });

  context('when `applicationDate` is provided', () => {
    const { props } = getData({
      applicationDate: '2018-01-24T00:00:00.000-06:00',
    });

    it('should render the correct content', () => {
      const { container } = render(<WarningStatus {...props} />);
      const selector = container.querySelectorAll('li');
      expect(selector).to.have.lengthOf(1);
      expect(container).to.contain.text('You applied on:');
    });
  });

  context('when `enrollmentStatus` is `deceased`', () => {
    const { props } = getData({
      enrollmentStatus: HCA_ENROLLMENT_STATUSES.deceased,
    });

    it('should render empty', () => {
      const { container } = render(<WarningStatus {...props} />);
      expect(container).to.be.empty;
    });
  });

  context('when `enrollmentStatus` is `enrolled`', () => {
    context('when no additional props are provided', () => {
      const { props } = getData({
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
      });

      it('should render empty', () => {
        const { container } = render(<WarningStatus {...props} />);
        expect(container).to.be.empty;
      });
    });

    context('when all props are provided', () => {
      const { props } = getData({
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
        applicationDate: '2018-01-24T00:00:00.000-06:00',
        enrollmentDate: '2018-01-24T00:00:00.000-06:00',
        preferredFacility: 'FACILITY NAME',
      });

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

    context('when the `applicationDate` is omitted', () => {
      const { props } = getData({
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
        enrollmentDate: '2018-01-24T00:00:00.000-06:00',
        preferredFacility: 'FACILITY NAME',
      });

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

    context('when the `enrollmentDate` is omitted', () => {
      const { props } = getData({
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
        applicationDate: '2018-01-24T00:00:00.000-06:00',
        preferredFacility: 'FACILITY NAME',
      });

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

    context('when the `preferredFacility` is not set', () => {
      const { props } = getData({
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
        applicationDate: '2018-01-24T00:00:00.000-06:00',
        enrollmentDate: '2018-01-24T00:00:00.000-06:00',
      });

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
      const { props } = getData({
        enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
        preferredFacility: 'FACILITY NAME',
      });

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
