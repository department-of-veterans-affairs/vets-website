import { SHORT_NAME_MAP } from './question-data-map';
// These are the question categories in the PACT Act flow
// https://app.mural.co/t/departmentofveteransaffairs9999/m/departmentofveteransaffairs9999/1692989444688/0044b9825c82d8d23920601f68c41a61d047d681?sender=ue51e6049230e03c1248b5078
export const BATCHES = Object.freeze({
  ORANGE: 'Agent Orange',
  BURN_PITS: 'Burn pits',
  CAMP_LEJEUNE: 'Lejeune',
  RADIATION: 'Radiation',
});

// This maps SNAKE_CASE name for a question to the batch for results screen branching
export const BATCH_MAP = Object.freeze({
  [BATCHES.BURN_PITS]: [
    SHORT_NAME_MAP.BURN_PIT_2_1,
    SHORT_NAME_MAP.BURN_PIT_2_1_1,
    SHORT_NAME_MAP.BURN_PIT_2_1_2,
  ],
  [BATCHES.ORANGE]: [
    SHORT_NAME_MAP.ORANGE_2_2_A,
    SHORT_NAME_MAP.ORANGE_2_2_B,
    SHORT_NAME_MAP.ORANGE_2_2_1_A,
    SHORT_NAME_MAP.ORANGE_2_2_1_B,
    SHORT_NAME_MAP.ORANGE_2_2_2,
    SHORT_NAME_MAP.ORANGE_2_2_3,
  ],
  [BATCHES.RADIATION]: [
    SHORT_NAME_MAP.RADIATION_2_3_A,
    SHORT_NAME_MAP.RADIATION_2_3_B,
  ],
  [BATCHES.CAMP_LEJEUNE]: [SHORT_NAME_MAP.LEJEUNE_2_4],
});
