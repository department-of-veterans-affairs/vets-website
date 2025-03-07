import { useSelector } from 'react-redux';
import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';
import { selectEnrollmentStatus } from '../../../../utils/selectors';
import { createLiteralMap } from '../../../../utils/helpers';
import WarningExplainations from '../ContentBlocks/WarningExplainations';

const WarningExplanation = () => {
  const { statusCode } = useSelector(selectEnrollmentStatus);

  // Declare content blocks for use
  const {
    explainBlock1,
    explainBlock2,
    explainBlock3,
    explainBlock4,
    explainBlock5,
    explainBlock6,
    explainBlock7,
    explainBlock8,
    explainBlock9,
    explainBlock10,
    explainBlock11,
  } = WarningExplainations;

  // Declare content block dictionary
  const contentDictionary = [
    [
      explainBlock1,
      [
        HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime,
        HCA_ENROLLMENT_STATUSES.ineligTrainingOnly,
      ],
    ],
    [explainBlock2, [HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge]],
    [explainBlock3, [HCA_ENROLLMENT_STATUSES.ineligNotVerified]],
    [explainBlock4, [HCA_ENROLLMENT_STATUSES.ineligGuardReserve]],
    [explainBlock5, [HCA_ENROLLMENT_STATUSES.ineligCHAMPVA]],
    [
      explainBlock6,
      [
        HCA_ENROLLMENT_STATUSES.ineligCitizens,
        HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts,
      ],
    ],
    [explainBlock7, [HCA_ENROLLMENT_STATUSES.deceased]],
    [explainBlock8, [HCA_ENROLLMENT_STATUSES.pendingMt]],
    [
      explainBlock9,
      [
        HCA_ENROLLMENT_STATUSES.pendingOther,
        HCA_ENROLLMENT_STATUSES.pendingUnverified,
      ],
    ],
    [explainBlock10, [HCA_ENROLLMENT_STATUSES.pendingPurpleHeart]],
    [
      explainBlock11,
      [
        HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry,
        HCA_ENROLLMENT_STATUSES.rejectedRightEntry,
        HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry,
        HCA_ENROLLMENT_STATUSES.canceledDeclined,
        HCA_ENROLLMENT_STATUSES.closed,
      ],
    ],
  ];

  // Reduce content dictionary to object literal
  const contentMap = createLiteralMap(contentDictionary);

  // Render based on enrollment status
  return contentMap[statusCode] || null;
};

export default WarningExplanation;
