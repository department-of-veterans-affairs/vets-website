import React from 'react';
import { useSelector } from 'react-redux';
import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';
import { createLiteralMap } from '../../../../utils/helpers';
import content from '../../../../locales/en/content.json';

const WarningHeadline = () => {
  const statusCode = useSelector(state => state.enrollmentStatus.statusCode);

  const contentDictionary = [
    [
      content['enrollment-alert-title--enrolled'],
      [HCA_ENROLLMENT_STATUSES.enrolled],
    ],
    [
      content['enrollment-alert-title--inelig'],
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
      content['enrollment-alert-title--reapply'],
      [
        HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry,
        HCA_ENROLLMENT_STATUSES.rejectedRightEntry,
        HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry,
        HCA_ENROLLMENT_STATUSES.canceledDeclined,
        HCA_ENROLLMENT_STATUSES.closed,
      ],
    ],
    [
      content['enrollment-alert-title--active-duty'],
      [HCA_ENROLLMENT_STATUSES.activeDuty],
    ],
    [
      content['enrollment-alert-title--deceased'],
      [HCA_ENROLLMENT_STATUSES.deceased],
    ],
    [
      content['enrollment-alert-title--more-info'],
      [
        HCA_ENROLLMENT_STATUSES.pendingMt,
        HCA_ENROLLMENT_STATUSES.pendingPurpleHeart,
      ],
    ],
    [
      content['enrollment-alert-title--review'],
      [
        HCA_ENROLLMENT_STATUSES.pendingOther,
        HCA_ENROLLMENT_STATUSES.pendingUnverified,
      ],
    ],
    [
      content['enrollment-alert-title--non-military'],
      [HCA_ENROLLMENT_STATUSES.nonMilitary],
    ],
  ];

  const contentMap = createLiteralMap(contentDictionary);

  return (
    <h2 slot="headline" data-testid="hca-enrollment-alert-heading">
      {contentMap[statusCode]}
    </h2>
  );
};

export default WarningHeadline;
