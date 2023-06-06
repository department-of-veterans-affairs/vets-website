import React from 'react';
import PropTypes from 'prop-types';

import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';
import { createLiteralMap } from '../../../../utils/helpers';
import GeneralFAQs from '../ContentBlocks/GeneralFAQs';
import ReapplyFAQs from '../ContentBlocks/ReapplyFAQs';

const FAQContent = ({ enrollmentStatus }) => {
  // Declare content blocks for use
  const {
    faqBlock1,
    faqBlock2,
    faqBlock3,
    faqBlock4,
    faqBlock5,
    faqBlock6,
    faqBlock7,
    faqBlock8,
    faqBlock9,
    faqBlock10,
    faqBlock11,
  } = GeneralFAQs;
  const {
    reapplyBlock1,
    reapplyBlock2,
    reapplyBlock3,
    reapplyBlock4,
    reapplyBlock5,
    reapplyBlock6,
  } = ReapplyFAQs;

  // Helper function to wrap multiple content blocks in JSX fragment
  const wrapContentBlocks = arrayToMap => {
    return arrayToMap.map((jsx, i) => (
      <React.Fragment key={i}>{jsx}</React.Fragment>
    ));
  };

  // Declare content block dictionary
  const contentDictionary = [
    [faqBlock8, [HCA_ENROLLMENT_STATUSES.activeDuty]],
    [
      wrapContentBlocks([faqBlock5, faqBlock11, reapplyBlock4]),
      [
        HCA_ENROLLMENT_STATUSES.canceledDeclined,
        HCA_ENROLLMENT_STATUSES.closed,
      ],
    ],
    [
      wrapContentBlocks([faqBlock1, reapplyBlock1]),
      [HCA_ENROLLMENT_STATUSES.enrolled],
    ],
    [
      wrapContentBlocks([faqBlock4, reapplyBlock2]),
      [HCA_ENROLLMENT_STATUSES.ineligCHAMPVA],
    ],
    [
      wrapContentBlocks([faqBlock2, faqBlock9, faqBlock11, reapplyBlock2]),
      [HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge],
    ],
    [
      wrapContentBlocks([faqBlock2, reapplyBlock2]),
      [
        HCA_ENROLLMENT_STATUSES.ineligCitizens,
        HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts,
      ],
    ],
    [
      wrapContentBlocks([faqBlock5, reapplyBlock2]),
      [HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon],
    ],
    [
      wrapContentBlocks([faqBlock2, faqBlock11, reapplyBlock2]),
      [
        HCA_ENROLLMENT_STATUSES.ineligGuardReserve,
        HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime,
        HCA_ENROLLMENT_STATUSES.ineligTrainingOnly,
      ],
    ],
    [
      wrapContentBlocks([faqBlock5, faqBlock11, reapplyBlock2]),
      [
        HCA_ENROLLMENT_STATUSES.ineligMedicare,
        HCA_ENROLLMENT_STATUSES.ineligOther,
        HCA_ENROLLMENT_STATUSES.ineligOver65,
        HCA_ENROLLMENT_STATUSES.ineligRefusedCopay,
      ],
    ],
    [
      wrapContentBlocks([faqBlock3, faqBlock11, reapplyBlock2]),
      [HCA_ENROLLMENT_STATUSES.ineligNotVerified],
    ],
    [faqBlock10, [HCA_ENROLLMENT_STATUSES.nonMilitary]],
    [
      wrapContentBlocks([faqBlock6, reapplyBlock5]),
      [
        HCA_ENROLLMENT_STATUSES.pendingMt,
        HCA_ENROLLMENT_STATUSES.pendingPurpleHeart,
      ],
    ],
    [
      wrapContentBlocks([faqBlock7, reapplyBlock6]),
      [
        HCA_ENROLLMENT_STATUSES.pendingOther,
        HCA_ENROLLMENT_STATUSES.pendingUnverified,
      ],
    ],
    [
      wrapContentBlocks([faqBlock5, faqBlock11, reapplyBlock3]),
      [
        HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry,
        HCA_ENROLLMENT_STATUSES.rejectedRightEntry,
        HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry,
      ],
    ],
  ];

  // Reduce content dictionary to object literal
  const contentMap = createLiteralMap(contentDictionary);

  // Render based on enrollment status
  return contentMap[enrollmentStatus];
};

FAQContent.propTypes = {
  enrollmentStatus: PropTypes.string,
};

export default FAQContent;
