import React from 'react';
import { useSelector } from 'react-redux';
import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';
import { createLiteralMap } from '../../../../utils/helpers';
import GeneralFAQs from '../ContentBlocks/GeneralFAQs';
import ReapplyFAQs from '../ContentBlocks/ReapplyFAQs';

const EnrollmentStatusFAQ = () => {
  const statusCode = useSelector(state => state.enrollmentStatus.statusCode);

  const wrapContentBlocks = blocks =>
    blocks.map((jsx, i) => <React.Fragment key={i}>{jsx}</React.Fragment>);

  const contentDictionary = [
    [GeneralFAQs.faqBlock8, [HCA_ENROLLMENT_STATUSES.activeDuty]],
    [
      wrapContentBlocks([GeneralFAQs.faqBlock1, ReapplyFAQs.reapplyBlock1]),
      [HCA_ENROLLMENT_STATUSES.enrolled],
    ],
    [
      wrapContentBlocks([GeneralFAQs.faqBlock4, ReapplyFAQs.reapplyBlock2]),
      [HCA_ENROLLMENT_STATUSES.ineligCHAMPVA],
    ],
    [
      wrapContentBlocks([
        GeneralFAQs.faqBlock2,
        GeneralFAQs.faqBlock9,
        GeneralFAQs.faqBlock11,
        ReapplyFAQs.reapplyBlock2,
      ]),
      [HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge],
    ],
    [
      wrapContentBlocks([GeneralFAQs.faqBlock2, ReapplyFAQs.reapplyBlock2]),
      [
        HCA_ENROLLMENT_STATUSES.ineligCitizens,
        HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts,
      ],
    ],
    [
      wrapContentBlocks([GeneralFAQs.faqBlock5, ReapplyFAQs.reapplyBlock2]),
      [HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon],
    ],
    [
      wrapContentBlocks([
        GeneralFAQs.faqBlock2,
        GeneralFAQs.faqBlock11,
        ReapplyFAQs.reapplyBlock2,
      ]),
      [
        HCA_ENROLLMENT_STATUSES.ineligGuardReserve,
        HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime,
        HCA_ENROLLMENT_STATUSES.ineligTrainingOnly,
      ],
    ],
    [
      wrapContentBlocks([
        GeneralFAQs.faqBlock5,
        GeneralFAQs.faqBlock11,
        ReapplyFAQs.reapplyBlock2,
      ]),
      [
        HCA_ENROLLMENT_STATUSES.ineligMedicare,
        HCA_ENROLLMENT_STATUSES.ineligOther,
        HCA_ENROLLMENT_STATUSES.ineligOver65,
        HCA_ENROLLMENT_STATUSES.ineligRefusedCopay,
      ],
    ],
    [
      wrapContentBlocks([
        GeneralFAQs.faqBlock3,
        GeneralFAQs.faqBlock11,
        ReapplyFAQs.reapplyBlock2,
      ]),
      [HCA_ENROLLMENT_STATUSES.ineligNotVerified],
    ],
    [GeneralFAQs.faqBlock10, [HCA_ENROLLMENT_STATUSES.nonMilitary]],
    [
      wrapContentBlocks([GeneralFAQs.faqBlock6, ReapplyFAQs.reapplyBlock5]),
      [
        HCA_ENROLLMENT_STATUSES.pendingMt,
        HCA_ENROLLMENT_STATUSES.pendingPurpleHeart,
      ],
    ],
    [
      wrapContentBlocks([GeneralFAQs.faqBlock7, ReapplyFAQs.reapplyBlock6]),
      [
        HCA_ENROLLMENT_STATUSES.pendingOther,
        HCA_ENROLLMENT_STATUSES.pendingUnverified,
      ],
    ],
    [
      wrapContentBlocks([
        GeneralFAQs.faqBlock5,
        GeneralFAQs.faqBlock11,
        ReapplyFAQs.reapplyBlock4,
      ]),
      [
        HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry,
        HCA_ENROLLMENT_STATUSES.rejectedRightEntry,
        HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry,
        HCA_ENROLLMENT_STATUSES.canceledDeclined,
        HCA_ENROLLMENT_STATUSES.closed,
      ],
    ],
  ];

  const contentMap = createLiteralMap(contentDictionary);

  return contentMap[statusCode] || null;
};

export default EnrollmentStatusFAQ;
