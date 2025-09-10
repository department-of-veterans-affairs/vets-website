import { RESPONSES } from '../question-data-map';
import * as c from '../results-content/dr-screens/card-content';
import * as p from '../results-content/non-dr-screens/dynamic-page-content';

const { BOARD, HLR, INIT, NO, SC, YES } = RESPONSES;

const GOOD_FIT_SC = {
  FORK: {
    A: {
      ONE_OF: {
        Q_1_2A_2_DISAGREE_DECISION: YES,
        Q_1_2B_LAW_POLICY_CHANGE: YES,
        Q_1_2C_NEW_EVIDENCE: YES,
        Q_2_IS_1A_LAW_POLICY_CHANGE: YES,
        Q_2_IS_1B_NEW_EVIDENCE: YES,
        Q_2_S_1_NEW_EVIDENCE: YES,
      },
    },
    B: {
      Q_2_H_2A_JUDGE_HEARING: NO,
      NONE_OF: {
        Q_1_3A_FEWER_60_DAYS: YES,
      },
    },
  },
};

const GOOD_FIT_HLR = {
  Q_1_3_CLAIM_CONTESTED: NO,
  Q_2_IS_1B_NEW_EVIDENCE: NO,
};

const GOOD_FIT_BOARD_DIRECT = {
  FORK: {
    A: {
      Q_2_0_CLAIM_TYPE: [INIT, SC],
      Q_2_IS_1B_NEW_EVIDENCE: NO,
    },
    B: {
      Q_2_0_CLAIM_TYPE: HLR,
      Q_2_H_2B_JUDGE_HEARING: NO,
    },
    C: {
      Q_1_3A_FEWER_60_DAYS: YES,
      Q_2_H_2B_JUDGE_HEARING: NO,
    },
  },
};

const GOOD_FIT_BOARD_EVIDENCE = {
  FORK: {
    A: {
      Q_2_0_CLAIM_TYPE: [INIT, SC, HLR],
      Q_2_H_2A_JUDGE_HEARING: NO,
    },
    B: {
      Q_2_0_CLAIM_TYPE: [INIT, SC, HLR],
      Q_2_IS_1B_NEW_EVIDENCE: YES,
    },
    C: {
      Q_1_3A_FEWER_60_DAYS: YES,
    },
  },
};

const GOOD_FIT_BOARD_HEARING = {
  FORK: {
    A: {
      Q_2_0_CLAIM_TYPE: [INIT, SC],
      Q_2_IS_1A_LAW_POLICY_CHANGE: NO,
    },
    B: {
      Q_2_0_CLAIM_TYPE: HLR,
      ONE_OF: {
        Q_2_H_2A_JUDGE_HEARING: YES,
        Q_2_H_2B_JUDGE_HEARING: YES,
      },
    },
    C: {
      Q_1_3A_FEWER_60_DAYS: YES,
      ONE_OF: {
        Q_2_H_2A_JUDGE_HEARING: YES,
        Q_2_H_2B_JUDGE_HEARING: YES,
      },
    },
  },
};

// Refer to the README in this directory for an explanation of display conditions
export const resultsDRDynamicContentDCs = Object.freeze({
  [c.TITLE_SC]: GOOD_FIT_SC,
  [c.TITLE_HLR]: GOOD_FIT_HLR,
  [c.TITLE_BOARD_DIRECT]: GOOD_FIT_BOARD_DIRECT,
  [c.TITLE_BOARD_EVIDENCE]: GOOD_FIT_BOARD_EVIDENCE,
  [c.TITLE_BOARD_HEARING]: GOOD_FIT_BOARD_HEARING,
  CARD_SC: {
    GOOD_FIT: GOOD_FIT_SC,
    NOT_GOOD_FIT: {
      ONE_OF: {
        Q_1_3_CLAIM_CONTESTED: YES,
        Q_2_H_2_NEW_EVIDENCE: NO,
        Q_2_IS_1B_NEW_EVIDENCE: NO,
        Q_2_H_2A_JUDGE_HEARING: YES,
      },
    },
  },
  CARD_HLR: {
    GOOD_FIT: GOOD_FIT_HLR,
    NOT_GOOD_FIT: {
      ONE_OF: {
        Q_1_2_CLAIM_DECISION: NO,
        Q_1_3_CLAIM_CONTESTED: YES,
        Q_2_0_CLAIM_TYPE: [HLR, BOARD],
        Q_2_IS_1A_LAW_POLICY_CHANGE: YES,
        Q_2_IS_1B_NEW_EVIDENCE: YES,
      },
    },
  },
  CARD_BOARD_DIRECT: {
    GOOD_FIT: GOOD_FIT_BOARD_DIRECT,
    NOT_GOOD_FIT: {
      ONE_OF: {
        Q_1_2_CLAIM_DECISION: NO,
        Q_2_0_CLAIM_TYPE: BOARD,
        Q_2_IS_1A_LAW_POLICY_CHANGE: YES,
        Q_2_IS_1B_NEW_EVIDENCE: YES,
        Q_2_H_2_NEW_EVIDENCE: YES,
        Q_2_H_2A_JUDGE_HEARING: YES,
        Q_2_H_2B_JUDGE_HEARING: YES,
      },
    },
  },
  CARD_BOARD_EVIDENCE: {
    GOOD_FIT: GOOD_FIT_BOARD_EVIDENCE,
    NOT_GOOD_FIT: {
      ONE_OF: {
        Q_2_H_2_NEW_EVIDENCE: NO,
        Q_2_H_2B_JUDGE_HEARING: YES,
      },
    },
  },
  CARD_BOARD_HEARING: {
    GOOD_FIT: GOOD_FIT_BOARD_HEARING,
    NOT_GOOD_FIT: {
      ONE_OF: {
        Q_1_2_CLAIM_DECISION: NO,
        Q_2_0_CLAIM_TYPE: BOARD,
        Q_2_IS_1A_LAW_POLICY_CHANGE: YES,
        Q_2_H_2A_JUDGE_HEARING: NO,
        Q_2_H_2B_JUDGE_HEARING: NO,
      },
    },
  },
  CARD_COURT_OF_APPEALS: {
    Q_2_0_CLAIM_TYPE: BOARD,
  },
  [c.CARD_DECISION_OVER_1_YEAR]: {
    Q_1_2A_2_DISAGREE_DECISION: YES, // SC
  },
  [c.CARD_REVIEW_HLR]: {
    Q_2_0_CLAIM_TYPE: HLR,
  },
  [c.CARD_REVIEW_SC]: {
    Q_2_0_CLAIM_TYPE: SC,
  },
  [c.CARD_REVIEW_BOARD]: {
    Q_2_0_CLAIM_TYPE: BOARD,
  },
  [c.CARD_REVIEW_INIT]: {
    Q_2_0_CLAIM_TYPE: INIT,
  },
  [c.CARD_NEW_EVIDENCE]: {
    ONE_OF: {
      Q_1_2C_NEW_EVIDENCE: YES, // SC
      Q_2_S_1_NEW_EVIDENCE: YES, // SC
      Q_2_IS_1B_NEW_EVIDENCE: YES, // SC, BE, BH
      Q_2_H_2_NEW_EVIDENCE: YES, // SC, BE, BH
    },
  },
  [c.CARD_NO_NEW_EVIDENCE]: {
    ONE_OF: {
      Q_2_IS_1B_NEW_EVIDENCE: NO, // HLR, BD, BH
      Q_2_H_2_NEW_EVIDENCE: NO, // BD, BH
    },
  },
  [c.CARD_LAW_POLICY_CHANGE]: {
    ONE_OF: {
      Q_1_2B_LAW_POLICY_CHANGE: YES, // SC
      Q_2_IS_1A_LAW_POLICY_CHANGE: YES, // SC
    },
  },
  [c.CARD_NOT_LAW_POLICY_CHANGE]: {
    Q_2_IS_1A_LAW_POLICY_CHANGE: NO, // HLR
  },
  [c.CARD_NOT_CONTESTED]: {
    Q_1_3_CLAIM_CONTESTED: NO, // SC, HLR
  },
  [c.CARD_BOARD_ONLY_OPTION]: {
    Q_1_3_CLAIM_CONTESTED: YES, // BD, BE, BH
  },
  [c.CARD_HEARING]: {
    ONE_OF: {
      Q_2_H_2A_JUDGE_HEARING: YES, // BH
      Q_2_H_2B_JUDGE_HEARING: YES, // BH
    },
  },
  [c.CARD_NO_HEARING]: {
    ONE_OF: {
      Q_2_H_2A_JUDGE_HEARING: NO, // SC, BE
      Q_2_H_2B_JUDGE_HEARING: NO, // BD
    },
  },
  [c.CARD_NEED_EVIDENCE]: {
    ONE_OF: {
      Q_2_IS_1B_NEW_EVIDENCE: NO, // SC
      Q_2_H_2_NEW_EVIDENCE: NO, // SC
    },
  },
  [c.CARD_CLAIM_CONTESTED]: {
    Q_1_3_CLAIM_CONTESTED: YES, // SC, HLR
  },
  [c.CARD_HEARING_NOT_INCLUDED]: {
    ONE_OF: {
      Q_2_H_2A_JUDGE_HEARING: YES, // SC, HLR, BD
      Q_2_H_2B_JUDGE_HEARING: YES, // HLR, BD
    },
  },
  [c.CARD_HEARING_NOT_DESIRED]: {
    ONE_OF: {
      Q_2_H_2A_JUDGE_HEARING: NO,
      Q_2_H_2B_JUDGE_HEARING: NO,
    },
  },
  [c.CARD_HLR_NOT_AVAILABLE]: {
    Q_2_0_CLAIM_TYPE: HLR, // HLR
  },
  [c.CARD_BOARD_NOT_AVAILABLE]: {
    Q_2_0_CLAIM_TYPE: BOARD, // HLR
  },
  [c.CARD_CANNOT_SUBMIT_EVIDENCE]: {
    ONE_OF: {
      Q_1_2C_NEW_EVIDENCE: YES, // BD
      Q_2_IS_1B_NEW_EVIDENCE: YES, // HLR, BD
      Q_2_S_1_NEW_EVIDENCE: YES,
      Q_2_H_2_NEW_EVIDENCE: YES, // BD
    },
  },
  [c.CARD_LAW_OR_POLICY]: {
    Q_2_IS_1A_LAW_POLICY_CHANGE: YES, // HLR, BD
  },
  [c.CARD_NOT_LAW_OR_POLICY]: {
    Q_2_IS_1B_NEW_EVIDENCE: NO, // SC
  },
  [c.CARD_WITHIN_1_YEAR]: {
    Q_1_2_CLAIM_DECISION: NO, // HLR, BD
  },
  [c.CARD_RECEIVED_BOARD_DECISION]: {
    Q_2_0_CLAIM_TYPE: BOARD, // BD
  },
});

export const resultsNonDRDynamicContentDCs = Object.freeze({
  [p.NOT_SERVICE_CONNECTED]: {
    Q_1_2A_1_SERVICE_CONNECTED: NO,
  },
  [p.NOT_LAW_POLICY_CHANGE]: {
    Q_1_2B_LAW_POLICY_CHANGE: NO,
  },
  [p.CONDITION_NOT_WORSE]: {
    Q_1_2A_CONDITION_WORSENED: NO,
  },
});
