import { QUESTION_CONTENT, SHORT_NAME_MAP as S } from './question-data-map';
import { RESULTS_NAME_MAP } from './results-data-map';
import { NON_DR_HEADING, DR_HEADING } from './results-content/common';

/**
 * We want the URL for each question to match the H1
 * In a lot of cases, we have the same question mapped to multiple SHORT_NAMEs
 * because it is asked in different contexts and would have different display conditions.
 * @param {*} shortName - question SHORT_NAME (e.g. Q_1_1_CLAIM_DECISION)
 * @param {*} index - for questions that are mapped to multiple SHORT_NAMES, we need to give
 * the index to differentiate the URLs to avoid routing collision
 * @returns a lowercased hyphen-separated version of the h1 with an index if isDuplicateQuestion
 */
export const convertH1ToRoute = h1Text => {
  if (!h1Text) return '';

  return h1Text
    .toLowerCase()
    .replace(/[^a-zA-Z -]/g, '')
    .replace(/ /g, '-');
};

/**
 * Generate route name for questions based on H1 content
 * @param {string} shortName - question SHORT_NAME (e.g. Q_1_1_CLAIM_DECISION)
 * @param {string|number} index - for questions that are mapped to multiple SHORT_NAMEs
 * @returns {string} - URL-friendly route name with index if provided
 */
export const getQuestionRouteName = (shortName, index) => {
  const questionH1 = QUESTION_CONTENT?.[shortName]?.h1;
  const baseUrl = convertH1ToRoute(questionH1);

  if (!index) return baseUrl;
  return `${baseUrl}-${index}`;
};

/**
 * Generate route name for results pages based on result type
 * @param {string} resultType - 'NON_DR' or 'DR'
 * @returns {string} - URL-friendly route name
 */
export const getResultsRouteName = resultType => {
  if (resultType === 'NON_DR') {
    return convertH1ToRoute(NON_DR_HEADING);
  }

  if (resultType === 'DR') {
    return convertH1ToRoute(DR_HEADING);
  }

  return '';
};

/**
 * Except for INTRODUCTION and results pages, left side must match
 * short name codes in constants/question-data-map.
 *
 * Some question codes share content (e.g. we ask the same question
 * in multiple paths). Because we kebab-case the <h1> from the page
 * to create the route, we'd end up with multiple identical routes.
 * To solve this, we pass sequential alphabetical suffixes to each
 * question code that points to shared content. For example:
 *
 * Q_2_IS_1B_2_JUDGE_HEARING: 'hearing-with-a-veterans-law-judge-a'
 * Q_2_IS_1B_3_JUDGE_HEARING: 'hearing-with-a-veterans-law-judge-b'
 */

export const ROUTES = Object.freeze({
  INTRODUCTION: ' ',
  Q_1_1_CLAIM_DECISION: getQuestionRouteName(S.Q_1_1_CLAIM_DECISION),
  Q_1_1A_SUBMITTED_526: getQuestionRouteName(S.Q_1_1A_SUBMITTED_526),
  Q_1_2_CLAIM_DECISION: getQuestionRouteName(S.Q_1_2_CLAIM_DECISION),
  Q_1_2A_1_SERVICE_CONNECTED: getQuestionRouteName(
    S.Q_1_2A_1_SERVICE_CONNECTED,
    'a',
  ),
  Q_1_2A_CONDITION_WORSENED: getQuestionRouteName(
    S.Q_1_2A_CONDITION_WORSENED,
    'a',
  ),
  Q_1_2A_2_DISAGREE_DECISION: getQuestionRouteName(
    S.Q_1_2A_2_DISAGREE_DECISION,
    'a',
  ),
  Q_1_2B_LAW_POLICY_CHANGE: getQuestionRouteName(
    S.Q_1_2B_LAW_POLICY_CHANGE,
    'a',
  ),
  Q_1_2C_NEW_EVIDENCE: getQuestionRouteName(S.Q_1_2C_NEW_EVIDENCE, 'a'),
  Q_1_3_CLAIM_CONTESTED: getQuestionRouteName(S.Q_1_3_CLAIM_CONTESTED),
  Q_1_3A_FEWER_60_DAYS: getQuestionRouteName(S.Q_1_3A_FEWER_60_DAYS),
  Q_2_IS_1_SERVICE_CONNECTED: getQuestionRouteName(
    S.Q_2_IS_1_SERVICE_CONNECTED,
    'b',
  ),
  Q_2_IS_2_CONDITION_WORSENED: getQuestionRouteName(
    S.Q_2_IS_2_CONDITION_WORSENED,
    'b',
  ),
  Q_2_IS_4_DISAGREE_DECISION: getQuestionRouteName(
    S.Q_2_IS_4_DISAGREE_DECISION,
    'b',
  ),
  Q_2_0_CLAIM_TYPE: getQuestionRouteName(S.Q_2_0_CLAIM_TYPE),
  Q_2_IS_1A_LAW_POLICY_CHANGE: getQuestionRouteName(
    S.Q_2_IS_1A_LAW_POLICY_CHANGE,
    'b',
  ),
  Q_2_IS_1B_NEW_EVIDENCE: getQuestionRouteName(S.Q_2_IS_1B_NEW_EVIDENCE, 'b'),
  Q_2_IS_1B_2_JUDGE_HEARING: getQuestionRouteName(
    S.Q_2_IS_1B_2_JUDGE_HEARING,
    'a',
  ),
  Q_2_IS_1B_3_JUDGE_HEARING: getQuestionRouteName(
    S.Q_2_IS_1B_3_JUDGE_HEARING,
    'b',
  ),
  Q_2_S_1_NEW_EVIDENCE: getQuestionRouteName(S.Q_2_S_1_NEW_EVIDENCE, 'c'),
  Q_2_S_2_WITHIN_120_DAYS: getQuestionRouteName(S.Q_2_S_2_WITHIN_120_DAYS),
  Q_2_H_2_NEW_EVIDENCE: getQuestionRouteName(S.Q_2_H_2_NEW_EVIDENCE, 'd'),
  Q_2_H_2A_JUDGE_HEARING: getQuestionRouteName(S.Q_2_H_2A_JUDGE_HEARING, 'c'),
  Q_2_H_2B_JUDGE_HEARING: getQuestionRouteName(S.Q_2_H_2B_JUDGE_HEARING, 'd'),
  RESULTS_NON_DR: getResultsRouteName('NON_DR'),
  RESULTS_DR: getResultsRouteName('DR'),
});

export const ALL_QUESTIONS = Object.freeze(Object.values(S));
export const ALL_RESULTS = Object.freeze(Object.values(RESULTS_NAME_MAP));

export const getShortNameFromRoute = route => {
  return Object.keys(ROUTES).find(key => ROUTES[key] === route) || null;
};
