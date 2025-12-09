import { NON_DR_RESULTS_CONTENT } from './results-content/non-dr-screens';
import { DR_RESULTS_CONTENT } from './results-content/dr-screens';

const RESULTS_NAME_MAP = Object.freeze({
  RESULTS_1_1B: 'RESULTS_1_1B', // 526EZ
  RESULTS_1_1C: 'RESULTS_1_1C', // Claims Status Tool
  RESULTS_1_3B: 'RESULTS_1_3B', // Other options
  RESULTS_1_2D: 'RESULTS_1_2D', // CUE / outside DR (1)
  RESULTS_2_IS_3: 'RESULTS_2_IS_3', // CFI
  RESULTS_2_S_3: 'RESULTS_2_S_3', // Court of Appeals
  RESULTS_2_S_3_1: 'RESULTS_2_S_3_1', // Court of Appeals & CFI
  RESULTS_2_S_4: 'RESULTS_2_S_4', //  CUE / outside DR (2)
  RESULTS_2_S_4_1: 'RESULTS_2_S_4_1', // CUE / outside DR (2) & CRI
  RESULTS_2_IS_1C: 'RESULTS_2_IS_1C', // HLR
  RESULTS_2_IS_1D: 'RESULTS_2_IS_1D', // HLR & CFI
  /* The display conditions for `RESULTS_2_S_1A` are minimal because there are so many paths
   * leading to that results screen. This means the conditions for `RESULTS_2_H_2B_1` and
   * `RESULTS_2_H_2B_1A` are never met because the conditions for `RESULTS_2_S_1A` are
   * evaluated and satisfied first.
   * To solve this, we moved up these two Board results screens in the evaluation order so they will
   * be evaluated before `RESULTS_2_S_1A`.
   */
  RESULTS_2_H_2B_1: 'RESULTS_2_H_2B_1', // Board - Hearing
  RESULTS_2_H_2B_1A: 'RESULTS_2_H_2B_1A', // Board - Hearing & CFI
  RESULTS_2_S_1A: 'RESULTS_2_S_1A', // Supp Claim
  RESULTS_2_S_1B: 'RESULTS_2_S_1B', // Supp Claim & CFI
  RESULTS_2_H_2A_1: 'RESULTS_2_H_2A_1', // Board - Evidence
  RESULTS_2_H_2A_2: 'RESULTS_2_H_2A_2', // Board - Evidence & CFI
  RESULTS_2_H_2B_2: 'RESULTS_2_H_2B_2', // Board - Direct
  RESULTS_2_H_2B_2B: 'RESULTS_2_H_2B_2B', // Board - Direct & CFI
});

const isNonDR = Object.freeze([
  RESULTS_NAME_MAP.RESULTS_1_1B,
  RESULTS_NAME_MAP.RESULTS_1_1C,
  RESULTS_NAME_MAP.RESULTS_1_3B,
  RESULTS_NAME_MAP.RESULTS_1_2D,
  RESULTS_NAME_MAP.RESULTS_2_IS_3,
  RESULTS_NAME_MAP.RESULTS_2_S_3,
  RESULTS_NAME_MAP.RESULTS_2_S_3_1,
  RESULTS_NAME_MAP.RESULTS_2_S_4,
  RESULTS_NAME_MAP.RESULTS_2_S_4_1,
]);

export {
  DR_RESULTS_CONTENT,
  isNonDR,
  NON_DR_RESULTS_CONTENT,
  RESULTS_NAME_MAP,
};
