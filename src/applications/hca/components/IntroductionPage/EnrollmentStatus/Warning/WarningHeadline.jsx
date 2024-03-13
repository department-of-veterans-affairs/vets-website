import React from 'react';
import PropTypes from 'prop-types';

import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';
import { createLiteralMap } from '../../../../utils/helpers';

const WarningHeadline = ({ enrollmentStatus }) => {
  // Declare enrollment status content dictionary
  const contentDictionary = [
    [
      'You’re already enrolled in VA health care',
      [HCA_ENROLLMENT_STATUSES.enrolled],
    ],
    [
      'We determined that you don’t qualify for VA health care based on your past application',
      [
        HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge,
        HCA_ENROLLMENT_STATUSES.ineligCitizens,
        HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts,
        HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon,
        HCA_ENROLLMENT_STATUSES.ineligGuardReserve,
        HCA_ENROLLMENT_STATUSES.ineligMedicare,
        HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime,
        HCA_ENROLLMENT_STATUSES.ineligNotVerified,
        HCA_ENROLLMENT_STATUSES.ineligOther,
        HCA_ENROLLMENT_STATUSES.ineligOver65,
        HCA_ENROLLMENT_STATUSES.ineligRefusedCopay,
        HCA_ENROLLMENT_STATUSES.ineligTrainingOnly,
        HCA_ENROLLMENT_STATUSES.ineligCHAMPVA,
      ],
    ],
    [
      'You applied before. But you can apply again now.',
      [
        HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry,
        HCA_ENROLLMENT_STATUSES.rejectedRightEntry,
        HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry,
        HCA_ENROLLMENT_STATUSES.canceledDeclined,
        HCA_ENROLLMENT_STATUSES.closed,
      ],
    ],
    [
      'Our records show that you’re an active-duty service member',
      [HCA_ENROLLMENT_STATUSES.activeDuty],
    ],
    [
      'Our records show that this Veteran is deceased',
      [HCA_ENROLLMENT_STATUSES.deceased],
    ],
    [
      'We need more information to complete our review of your VA health care application',
      [
        HCA_ENROLLMENT_STATUSES.pendingMt,
        HCA_ENROLLMENT_STATUSES.pendingPurpleHeart,
      ],
    ],
    [
      'We’re reviewing your application',
      [
        HCA_ENROLLMENT_STATUSES.pendingOther,
        HCA_ENROLLMENT_STATUSES.pendingUnverified,
      ],
    ],
    [
      'We see that you aren’t a Veteran or service member',
      [HCA_ENROLLMENT_STATUSES.nonMilitary],
    ],
  ];

  // Reduce content dictionary to object literal
  const contentMap = createLiteralMap(contentDictionary);

  // Render based on enrollment status
  return (
    <h2 slot="headline" data-testid="hca-enrollment-alert-heading">
      {contentMap[enrollmentStatus]}
    </h2>
  );
};

WarningHeadline.propTypes = {
  enrollmentStatus: PropTypes.string,
};

export default WarningHeadline;
