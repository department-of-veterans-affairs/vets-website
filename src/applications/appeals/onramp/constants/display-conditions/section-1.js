import { RESPONSES } from '../question-data-map';

const { NO, YES } = RESPONSES;

// Refer to the README in this directory for an explanation of display conditions
export const section1DCs = Object.freeze({
  Q_1_1_CLAIM_DECISION: {},
  Q_1_1A_SUBMITTED_526: {
    Q_1_1_CLAIM_DECISION: [NO],
  },
  Q_1_2_CLAIM_DECISION: {
    Q_1_1_CLAIM_DECISION: [YES],
  },
  Q_1_2A_CONDITION_WORSENED: {
    Q_1_1_CLAIM_DECISION: [YES],
    Q_1_2_CLAIM_DECISION: [NO],
  },
  Q_1_2B_LAW_POLICY_CHANGE: {
    Q_1_1_CLAIM_DECISION: [YES],
    Q_1_2_CLAIM_DECISION: [NO],
    Q_1_2A_CONDITION_WORSENED: [NO],
  },
  Q_1_2C_NEW_EVIDENCE: {
    Q_1_1_CLAIM_DECISION: [YES],
    Q_1_2_CLAIM_DECISION: [NO],
    Q_1_2A_CONDITION_WORSENED: [NO],
    Q_1_2B_LAW_POLICY_CHANGE: [NO],
  },
  Q_1_3_CLAIM_CONTESTED: {
    Q_1_1_CLAIM_DECISION: [YES],
    Q_1_2_CLAIM_DECISION: [YES],
  },
  Q_1_3A_FEWER_60_DAYS: {
    Q_1_1_CLAIM_DECISION: [YES],
    Q_1_2_CLAIM_DECISION: [YES],
    Q_1_3_CLAIM_CONTESTED: [YES],
  },
});
