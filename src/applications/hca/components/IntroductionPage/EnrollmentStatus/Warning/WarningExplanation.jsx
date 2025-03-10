import { useSelector } from 'react-redux';
import { HCA_ENROLLMENT_STATUSES } from '../../../../utils/constants';
import { createLiteralMap } from '../../../../utils/helpers';
import WarningExplainations from '../ContentBlocks/WarningExplainations';

const WarningExplanation = () => {
  const statusCode = useSelector(state => state.enrollmentStatus.statusCode);

  const contentDictionary = [
    [
      WarningExplainations.explainBlock1,
      [
        HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime,
        HCA_ENROLLMENT_STATUSES.ineligTrainingOnly,
      ],
    ],
    [
      WarningExplainations.explainBlock2,
      [HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge],
    ],
    [
      WarningExplainations.explainBlock3,
      [HCA_ENROLLMENT_STATUSES.ineligNotVerified],
    ],
    [
      WarningExplainations.explainBlock4,
      [HCA_ENROLLMENT_STATUSES.ineligGuardReserve],
    ],
    [
      WarningExplainations.explainBlock5,
      [HCA_ENROLLMENT_STATUSES.ineligCHAMPVA],
    ],
    [
      WarningExplainations.explainBlock6,
      [
        HCA_ENROLLMENT_STATUSES.ineligCitizens,
        HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts,
      ],
    ],
    [WarningExplainations.explainBlock7, [HCA_ENROLLMENT_STATUSES.deceased]],
    [WarningExplainations.explainBlock8, [HCA_ENROLLMENT_STATUSES.pendingMt]],
    [
      WarningExplainations.explainBlock9,
      [
        HCA_ENROLLMENT_STATUSES.pendingOther,
        HCA_ENROLLMENT_STATUSES.pendingUnverified,
      ],
    ],
    [
      WarningExplainations.explainBlock10,
      [HCA_ENROLLMENT_STATUSES.pendingPurpleHeart],
    ],
    [
      WarningExplainations.explainBlock11,
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

export default WarningExplanation;
