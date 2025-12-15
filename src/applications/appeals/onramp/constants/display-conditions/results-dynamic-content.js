import { RESPONSES } from '../question-data-map';
import * as c from '../results-content/dr-screens/card-content';
import * as p from '../results-content/non-dr-screens/dynamic-page-content';

const { BOARD, CFI, HLR, INIT, NO, SC, YES } = RESPONSES;

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
      Q_1_3_CLAIM_CONTESTED: NO,
      Q_2_H_2A_JUDGE_HEARING: NO,
    },
  },
};

const GOOD_FIT_HLR = {
  Q_2_IS_1B_NEW_EVIDENCE: NO,
};

const GOOD_FIT_BOARD_DIRECT = {
  FORK: {
    A: {
      Q_2_0_CLAIM_TYPE: [INIT, CFI, SC],
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
      Q_2_0_CLAIM_TYPE: [INIT, CFI, SC],
      Q_2_IS_1B_NEW_EVIDENCE: YES,
    },
    B: {
      Q_2_0_CLAIM_TYPE: HLR,
      Q_2_H_2A_JUDGE_HEARING: NO,
    },
    C: {
      Q_1_3A_FEWER_60_DAYS: YES,
      Q_2_H_2A_JUDGE_HEARING: NO,
    },
  },
};

const GOOD_FIT_BOARD_HEARING = {
  FORK: {
    A: {
      Q_2_0_CLAIM_TYPE: [INIT, CFI, SC],
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
        Q_2_H_2B_JUDGE_HEARING: YES,
      },
    },
  },
  CARD_BOARD_EVIDENCE: {
    GOOD_FIT: GOOD_FIT_BOARD_EVIDENCE,
    NOT_GOOD_FIT: {
      ONE_OF: {
        Q_1_2_CLAIM_DECISION: NO,
        Q_2_0_CLAIM_TYPE: BOARD,
        Q_2_IS_1A_LAW_POLICY_CHANGE: YES,
        Q_2_IS_1B_NEW_EVIDENCE: NO,
        Q_2_H_2_NEW_EVIDENCE: NO,
        Q_2_H_2A_JUDGE_HEARING: YES,
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
  [c.CARD_GF_DECISION_OVER_1_YEAR]: {
    Q_1_2A_2_DISAGREE_DECISION: YES,
  },
  [c.CARD_GF_REVIEW_HLR]: {
    Q_2_0_CLAIM_TYPE: HLR,
  },
  [c.CARD_GF_REVIEW_SC]: {
    Q_2_0_CLAIM_TYPE: SC,
  },
  [c.CARD_GF_REVIEW_BOARD]: {
    Q_2_0_CLAIM_TYPE: BOARD,
  },
  [c.CARD_GF_REVIEW_INIT]: {
    Q_2_0_CLAIM_TYPE: [INIT, CFI],
  },
  [c.CARD_GF_YES_EVIDENCE]: {
    ONE_OF: {
      Q_1_2C_NEW_EVIDENCE: YES,
      Q_2_S_1_NEW_EVIDENCE: YES,
      Q_2_IS_1B_NEW_EVIDENCE: YES,
      Q_2_H_2_NEW_EVIDENCE: YES,
    },
  },
  [c.CARD_GF_NO_EVIDENCE]: {
    ONE_OF: {
      Q_2_IS_1B_NEW_EVIDENCE: NO,
      Q_2_H_2_NEW_EVIDENCE: NO,
    },
  },
  [c.CARD_GF_YES_LAW_POLICY]: {
    ONE_OF: {
      Q_1_2B_LAW_POLICY_CHANGE: YES,
      Q_2_IS_1A_LAW_POLICY_CHANGE: YES,
    },
  },
  [c.CARD_GF_NO_LAW_POLICY]: {
    Q_2_IS_1A_LAW_POLICY_CHANGE: NO,
  },
  [c.CARD_GF_NOT_CONTESTED]: {
    Q_1_3_CLAIM_CONTESTED: NO,
  },
  [c.CARD_GF_BOARD_ONLY_OPTION]: {
    Q_1_3_CLAIM_CONTESTED: YES,
  },
  [c.CARD_GF_YES_HEARING]: {
    ONE_OF: {
      Q_2_H_2A_JUDGE_HEARING: YES,
      Q_2_H_2B_JUDGE_HEARING: YES,
    },
  },
  [c.CARD_GF_NO_HEARING]: {
    ONE_OF: {
      Q_2_H_2A_JUDGE_HEARING: NO,
      Q_2_H_2B_JUDGE_HEARING: NO,
    },
  },
  [c.CARD_NGF_NEED_EVIDENCE]: {
    ONE_OF: {
      Q_2_IS_1B_NEW_EVIDENCE: NO,
      Q_2_H_2_NEW_EVIDENCE: NO,
    },
  },
  [c.CARD_NGF_CLAIM_CONTESTED]: {
    Q_1_3_CLAIM_CONTESTED: YES,
  },
  [c.CARD_NGF_HEARING_NOT_INCLUDED]: {
    ONE_OF: {
      Q_2_H_2A_JUDGE_HEARING: YES,
      Q_2_H_2B_JUDGE_HEARING: YES,
    },
  },
  [c.CARD_NGF_HEARING_NOT_DESIRED]: {
    ONE_OF: {
      Q_2_H_2A_JUDGE_HEARING: NO,
      Q_2_H_2B_JUDGE_HEARING: NO,
    },
  },
  [c.CARD_NGF_HLR_NOT_AVAILABLE]: {
    Q_2_0_CLAIM_TYPE: HLR,
  },
  [c.CARD_NGF_BOARD_NOT_AVAILABLE]: {
    Q_2_0_CLAIM_TYPE: BOARD,
  },
  [c.CARD_NGF_CANNOT_SUBMIT_EVIDENCE]: {
    ONE_OF: {
      Q_1_2C_NEW_EVIDENCE: YES,
      Q_2_IS_1B_NEW_EVIDENCE: YES,
      Q_2_S_1_NEW_EVIDENCE: YES,
      Q_2_H_2_NEW_EVIDENCE: YES,
    },
  },
  [c.CARD_NGF_RECEIVED_BOARD_DECISION]: {
    Q_2_0_CLAIM_TYPE: BOARD,
  },
  [c.CARD_NGF_YES_LAW_POLICY]: {
    Q_2_IS_1A_LAW_POLICY_CHANGE: YES,
  },
  [c.CARD_NGF_NO_LAW_POLICY]: {
    Q_2_IS_1B_NEW_EVIDENCE: NO,
  },
  [c.CARD_NGF_DECISION_OVER_1_YEAR]: {
    Q_1_2_CLAIM_DECISION: NO,
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
