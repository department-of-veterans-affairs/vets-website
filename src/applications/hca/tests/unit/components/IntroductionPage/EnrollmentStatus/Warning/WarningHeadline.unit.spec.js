import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { HCA_ENROLLMENT_STATUSES } from '../../../../../../utils/constants';
import WarningHeadline from '../../../../../../components/IntroductionPage/EnrollmentStatus/Warning/WarningHeadline';

describe('hca <WarningHeadline>', () => {
  const expectedOutputs = {
    [HCA_ENROLLMENT_STATUSES.activeDuty]:
      'Our records show that you’re an active-duty service member',
    [HCA_ENROLLMENT_STATUSES.canceledDeclined]:
      'You applied before. But you can apply again now.',
    [HCA_ENROLLMENT_STATUSES.closed]:
      'You applied before. But you can apply again now.',
    [HCA_ENROLLMENT_STATUSES.deceased]:
      'Our records show that this Veteran is deceased',
    [HCA_ENROLLMENT_STATUSES.enrolled]:
      'You’re already enrolled in VA health care',
    [HCA_ENROLLMENT_STATUSES.ineligCHAMPVA]:
      'We determined that you don’t qualify for VA health care based on your past application',
    [HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge]:
      'We determined that you don’t qualify for VA health care based on your past application',
    [HCA_ENROLLMENT_STATUSES.ineligCitizens]:
      'We determined that you don’t qualify for VA health care based on your past application',
    [HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts]:
      'We determined that you don’t qualify for VA health care based on your past application',
    [HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon]:
      'We determined that you don’t qualify for VA health care based on your past application',
    [HCA_ENROLLMENT_STATUSES.ineligGuardReserve]:
      'We determined that you don’t qualify for VA health care based on your past application',
    [HCA_ENROLLMENT_STATUSES.ineligMedicare]:
      'We determined that you don’t qualify for VA health care based on your past application',
    [HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime]:
      'We determined that you don’t qualify for VA health care based on your past application',
    [HCA_ENROLLMENT_STATUSES.ineligNotVerified]:
      'We determined that you don’t qualify for VA health care based on your past application',
    [HCA_ENROLLMENT_STATUSES.ineligOther]:
      'We determined that you don’t qualify for VA health care based on your past application',
    [HCA_ENROLLMENT_STATUSES.ineligOver65]:
      'We determined that you don’t qualify for VA health care based on your past application',
    [HCA_ENROLLMENT_STATUSES.ineligRefusedCopay]:
      'We determined that you don’t qualify for VA health care based on your past application',
    [HCA_ENROLLMENT_STATUSES.ineligTrainingOnly]:
      'We determined that you don’t qualify for VA health care based on your past application',
    [HCA_ENROLLMENT_STATUSES.nonMilitary]:
      'We see that you aren’t a Veteran or service member',
    [HCA_ENROLLMENT_STATUSES.pendingMt]:
      'We need more information to complete our review of your VA health care application',
    [HCA_ENROLLMENT_STATUSES.pendingOther]: 'We’re reviewing your application',
    [HCA_ENROLLMENT_STATUSES.pendingPurpleHeart]:
      'We need more information to complete our review of your VA health care application',
    [HCA_ENROLLMENT_STATUSES.pendingUnverified]:
      'We’re reviewing your application',
    [HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry]:
      'You applied before. But you can apply again now.',
    [HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry]:
      'You applied before. But you can apply again now.',
    [HCA_ENROLLMENT_STATUSES.rejectedRightEntry]:
      'You applied before. But you can apply again now.',
  };

  context('when the content is generated based on enrollment status', () => {
    it('should have content for all possible statuses', () => {
      const possibleEnrollmentStatuses = Object.values({
        ...HCA_ENROLLMENT_STATUSES,
      }).filter(
        enrollmentStatus =>
          enrollmentStatus !== HCA_ENROLLMENT_STATUSES.activeDuty &&
          enrollmentStatus !== HCA_ENROLLMENT_STATUSES.deceased &&
          enrollmentStatus !== HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
      );
      const testedEnrollmentStatuses = Object.keys(expectedOutputs);
      expect(
        possibleEnrollmentStatuses.every(enrollmentStatus =>
          testedEnrollmentStatuses.includes(enrollmentStatus),
        ),
      ).to.be.true;
    });

    Object.keys(expectedOutputs).forEach(enrollmentStatus => {
      it(`should render the correct content for status: ${enrollmentStatus}`, () => {
        const props = { enrollmentStatus };
        const { container } = render(<WarningHeadline {...props} />);
        expect(container).to.not.be.empty;
        expect(container).to.contain.text(expectedOutputs[enrollmentStatus]);
      });
    });
  });
});
