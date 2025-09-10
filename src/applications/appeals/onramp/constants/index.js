import { QUESTION_CONTENT, SHORT_NAME_MAP as S } from './question-data-map';
import { RESULTS_NAME_MAP } from './results-data-map';

/**
 * We want the URL for each question to match the H1
 * In a lot of cases, we have the same question mapped to multiple SHORT_NAMEs
 * because it is asked in different contexts and would have different display conditions.
 * @param {*} shortName - question SHORT_NAME (e.g. Q_1_1_CLAIM_DECISION)
 * @param {*} index - for questions that are mapped to multiple SHORT_NAMES, we need to give
 * the index to differentiate the URLs to avoid routing collision
 * @returns a lowercased hyphen-separated version of the h1 with an index if isDuplicateQuestion
 */
export const getRouteName = (shortName, index) => {
  const questionH1 = QUESTION_CONTENT?.[shortName]?.h1;

  if (!questionH1) {
    return '';
  }

  const baseUrl = questionH1
    .toLowerCase()
    .replace(/[^a-zA-Z -]/g, '')
    .replace(/ /g, '-');

  if (!index) return baseUrl;

  return `${baseUrl}-${index}`;
};

// Except for INTRODUCTION and results pages, left side must match
// short name codes in constants/question-data-map
export const ROUTES = Object.freeze({
  INTRODUCTION: 'introduction',
  Q_1_1_CLAIM_DECISION: getRouteName(S.Q_1_1_CLAIM_DECISION),
  Q_1_1A_SUBMITTED_526: getRouteName(S.Q_1_1A_SUBMITTED_526),
  Q_1_2_CLAIM_DECISION: getRouteName(S.Q_1_2_CLAIM_DECISION),
  Q_1_2A_1_SERVICE_CONNECTED: getRouteName(S.Q_1_2A_1_SERVICE_CONNECTED, 'a'),
  Q_1_2A_CONDITION_WORSENED: getRouteName(S.Q_1_2A_CONDITION_WORSENED, 'a'),
  Q_1_2A_2_DISAGREE_DECISION: getRouteName(S.Q_1_2A_2_DISAGREE_DECISION, 'a'),
  Q_1_2B_LAW_POLICY_CHANGE: getRouteName(S.Q_1_2B_LAW_POLICY_CHANGE, 'a'),
  Q_1_2C_NEW_EVIDENCE: getRouteName(S.Q_1_2C_NEW_EVIDENCE, 'a'),
  Q_1_3_CLAIM_CONTESTED: getRouteName(S.Q_1_3_CLAIM_CONTESTED),
  Q_1_3A_FEWER_60_DAYS: getRouteName(S.Q_1_3A_FEWER_60_DAYS),
  Q_2_IS_1_SERVICE_CONNECTED: getRouteName(S.Q_2_IS_1_SERVICE_CONNECTED, 'b'),
  Q_2_IS_2_CONDITION_WORSENED: getRouteName(S.Q_2_IS_2_CONDITION_WORSENED, 'b'),
  Q_2_IS_4_DISAGREE_DECISION: getRouteName(S.Q_2_IS_4_DISAGREE_DECISION, 'b'),
  Q_2_0_CLAIM_TYPE: getRouteName(S.Q_2_0_CLAIM_TYPE),
  Q_2_IS_1A_LAW_POLICY_CHANGE: getRouteName(S.Q_2_IS_1A_LAW_POLICY_CHANGE, 'b'),
  Q_2_IS_1B_NEW_EVIDENCE: getRouteName(S.Q_2_IS_1B_NEW_EVIDENCE, 'b'),
  Q_2_S_1_NEW_EVIDENCE: getRouteName(S.Q_2_S_1_NEW_EVIDENCE, 'c'),
  Q_2_S_2_WITHIN_120_DAYS: getRouteName(S.Q_2_S_2_WITHIN_120_DAYS),
  Q_2_H_2_NEW_EVIDENCE: getRouteName(S.Q_2_H_2_NEW_EVIDENCE, 'd'),
  Q_2_H_2A_JUDGE_HEARING: getRouteName(S.Q_2_H_2A_JUDGE_HEARING, 'a'),
  Q_2_H_2B_JUDGE_HEARING: getRouteName(S.Q_2_H_2B_JUDGE_HEARING, 'b'),
  RESULTS: 'results',
});

export const ALL_QUESTIONS = Object.freeze(Object.values(S));
export const ALL_RESULTS = Object.freeze(Object.values(RESULTS_NAME_MAP));
