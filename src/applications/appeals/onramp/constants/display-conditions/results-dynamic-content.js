import { RESPONSES } from '../question-data-map';
import * as c from '../results-content/dr-screens/card-content';

const { BOARD, HLR, INIT, NO, SC, YES } = RESPONSES;

// Refer to the README in this directory for an explanation of display conditions
export const resultsDynamicContentDCs = Object.freeze({
  [c.TITLE_SC]: {
    ONE_OF: {
      Q_1_2B_LAW_POLICY_CHANGE: YES,
      Q_1_2C_NEW_EVIDENCE: YES,
      Q_2_IS_1A_LAW_POLICY_CHANGE: YES,
      Q_2_IS_1B_NEW_EVIDENCE: YES,
      Q_2_S_1_NEW_EVIDENCE: YES,
      Q_2_H_1_EXISTING_BOARD_APPEAL: YES,
      Q_2_H_2_NEW_EVIDENCE: YES,
    },
  },
  [c.TITLE_HLR]: {
    ONE_OF: {
      Q_2_IS_1B_NEW_EVIDENCE: NO,
      Q_2_S_1_NEW_EVIDENCE: NO,
    },
  },
  [c.TITLE_BOARD_DIRECT]: {
    Q_2_H_2B_JUDGE_HEARING: NO,
  },
  [c.TITLE_BOARD_EVIDENCE]: {
    Q_2_H_2A_JUDGE_HEARING: NO,
  },
  [c.TITLE_BOARD_HEARING]: {
    ONE_OF: {
      Q_2_H_2A_JUDGE_HEARING: YES,
      Q_2_H_2B_JUDGE_HEARING: YES,
    },
  },
  CARD_SC: {
    GOOD_FIT: {
      NONE_OF: {
        Q_2_IS_1B_NEW_EVIDENCE: NO,
        Q_2_S_1_NEW_EVIDENCE: NO,
        Q_2_H_2_NEW_EVIDENCE: NO,
      },
    },
    NOT_GOOD_FIT: {
      ONE_OF: {
        Q_2_IS_1B_NEW_EVIDENCE: NO,
        Q_2_S_1_NEW_EVIDENCE: NO,
        Q_2_H_2_NEW_EVIDENCE: NO,
      },
    },
  },
  CARD_HLR: {
    GOOD_FIT: {
      Q_1_3_CLAIM_CONTESTED: NO,
      ONE_OF: {
        Q_2_IS_1B_NEW_EVIDENCE: NO,
        Q_2_S_1_NEW_EVIDENCE: NO,
      },
    },
    NOT_GOOD_FIT: {
      ONE_OF: {
        Q_1_3_CLAIM_CONTESTED: YES,
        Q_2_0_CLAIM_TYPE: HLR,
        Q_2_IS_1B_NEW_EVIDENCE: YES,
        Q_2_S_1_NEW_EVIDENCE: YES,
      },
    },
  },
  CARD_BOARD_DIRECT: {
    GOOD_FIT: {
      FORK: {
        A: {
          Q_2_0_CLAIM_TYPE: [INIT, SC, HLR],
          ONE_OF: {
            Q_2_IS_1B_NEW_EVIDENCE: NO,
            Q_2_S_1_NEW_EVIDENCE: NO,
            Q_2_H_2_NEW_EVIDENCE: NO,
          },
        },
        B: {
          Q_1_3A_FEWER_60_DAYS: YES,
        },
      },
    },
    NOT_GOOD_FIT: {
      ONE_OF: {
        Q_2_H_1_EXISTING_BOARD_APPEAL: YES,
        Q_2_H_2_NEW_EVIDENCE: YES,
        Q_2_H_2B_JUDGE_HEARING: YES,
      },
    },
  },
  CARD_BOARD_EVIDENCE: {
    GOOD_FIT: {
      FORK: {
        A: {
          Q_2_0_CLAIM_TYPE: [INIT, SC, HLR],
          ONE_OF: {
            Q_2_IS_1B_NEW_EVIDENCE: YES,
            Q_2_S_1_NEW_EVIDENCE: YES,
            Q_2_H_2_NEW_EVIDENCE: YES,
          },
        },
        B: {
          Q_1_3A_FEWER_60_DAYS: YES,
        },
      },
    },
    NOT_GOOD_FIT: {
      ONE_OF: {
        Q_2_H_1_EXISTING_BOARD_APPEAL: YES,
        Q_2_H_2_NEW_EVIDENCE: NO,
        Q_2_H_2B_JUDGE_HEARING: YES,
      },
    },
  },
  CARD_BOARD_HEARING: {
    GOOD_FIT: {
      FORK: {
        A: {
          Q_2_0_CLAIM_TYPE: [INIT, SC, HLR],
          Q_2_H_2_NEW_EVIDENCE: YES,
          Q_2_H_2A_JUDGE_HEARING: YES,
        },
        B: {
          Q_2_0_CLAIM_TYPE: [INIT, SC, HLR],
          Q_2_H_2_NEW_EVIDENCE: NO,
          Q_2_H_2B_JUDGE_HEARING: YES,
        },
        C: {
          Q_1_3A_FEWER_60_DAYS: YES,
          Q_2_H_2_NEW_EVIDENCE: YES,
          Q_2_H_2A_JUDGE_HEARING: YES,
        },
        D: {
          Q_1_3A_FEWER_60_DAYS: YES,
          Q_2_H_2_NEW_EVIDENCE: NO,
          Q_2_H_2B_JUDGE_HEARING: YES,
        },
      },
    },
    NOT_GOOD_FIT: {
      ONE_OF: {
        Q_2_H_1_EXISTING_BOARD_APPEAL: YES,
        Q_2_H_2B_JUDGE_HEARING: YES,
      },
    },
  },
  CARD_COURT_OF_APPEALS: {
    Q_2_0_CLAIM_TYPE: [BOARD],
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
      Q_1_2C_NEW_EVIDENCE: YES, // Should be SC
      Q_2_S_1_NEW_EVIDENCE: YES, // SC
      Q_2_IS_1B_NEW_EVIDENCE: YES, // SC
      Q_2_H_2_NEW_EVIDENCE: YES, // BOARD-EVIDENCE
    },
  },
  [c.CARD_NO_NEW_EVIDENCE]: {
    ONE_OF: {
      Q_2_IS_1B_NEW_EVIDENCE: NO, // SC, BOARD-DIRECT
      Q_2_S_1_NEW_EVIDENCE: NO, // SC, BOARD-DIRECT
      Q_2_H_2_NEW_EVIDENCE: NO, // new from BOARD-DIRECT
    },
  },
  [c.CARD_LAW_POLICY_CHANGE]: {
    ONE_OF: {
      Q_1_2B_LAW_POLICY_CHANGE: YES, // Should be SC
      Q_2_IS_1A_LAW_POLICY_CHANGE: YES, // SC
    },
  },
  [c.CARD_NOT_LAW_POLICY_CHANGE]: {
    Q_2_IS_1A_LAW_POLICY_CHANGE: NO,
  },
  [c.CARD_NOT_CONTESTED]: {
    Q_1_3_CLAIM_CONTESTED: NO,
  },
  [c.CARD_SUBMITTED_BOARD_APPEAL]: {
    Q_2_H_1_EXISTING_BOARD_APPEAL: YES,
  },
  [c.CARD_BOARD_ONLY_OPTION]: {
    Q_1_3_CLAIM_CONTESTED: YES,
  },
  [c.CARD_HEARING]: {
    ONE_OF: {
      Q_2_H_2A_JUDGE_HEARING: YES, // BOARD-EVIDENCE
      Q_2_H_2B_JUDGE_HEARING: YES, // BOARD-HEARING
    },
  },
  [c.CARD_NO_HEARING]: {
    ONE_OF: {
      Q_2_H_2A_JUDGE_HEARING: NO, // BOARD-EVIDENCE
      Q_2_H_2B_JUDGE_HEARING: NO, // BOARD-DIRECT
    },
  },
  [c.CARD_NEED_EVIDENCE]: {
    ONE_OF: {
      Q_2_IS_1B_NEW_EVIDENCE: NO,
      Q_2_S_1_NEW_EVIDENCE: NO,
      Q_2_H_2_NEW_EVIDENCE: NO,
    },
  },
  [c.CARD_CLAIM_CONTESTED]: {
    Q_1_3_CLAIM_CONTESTED: YES,
  },
  [c.CARD_HEARING_NOT_INCLUDED]: {
    ONE_OF: {
      Q_2_H_2A_JUDGE_HEARING: YES,
      Q_2_H_2B_JUDGE_HEARING: YES,
    },
  },
  [c.CARD_HEARING_NOT_DESIRED]: {
    ONE_OF: {
      Q_2_H_2A_JUDGE_HEARING: NO,
      Q_2_H_2B_JUDGE_HEARING: NO,
    },
  },
  [c.CARD_HLR_NOT_AVAILABLE]: {
    Q_2_0_CLAIM_TYPE: HLR,
  },
  [c.CARD_CANNOT_SUBMIT_EVIDENCE]: {
    ONE_OF: {
      Q_2_IS_1B_NEW_EVIDENCE: YES,
      Q_2_S_1_NEW_EVIDENCE: YES,
    },
  },
  [c.CARD_RECEIVED_BOARD_DECISION]: {
    Q_2_H_1_EXISTING_BOARD_APPEAL: YES,
  },
});
