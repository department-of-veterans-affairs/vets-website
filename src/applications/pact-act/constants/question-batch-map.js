import { BATCHES } from './question-batches';
import { SHORT_NAME_MAP } from './question-data-map';

const { BURN_PITS, ORANGE, RADIATION, CAMP_LEJEUNE } = BATCHES;

// This maps SNAKE_CASE name for a question to the batch (category) for results screen branching
export const BATCH_MAP = Object.freeze({
  [BURN_PITS]: [
    SHORT_NAME_MAP.BURN_PIT_2_1,
    SHORT_NAME_MAP.BURN_PIT_2_1_1,
    SHORT_NAME_MAP.BURN_PIT_2_1_2,
  ],
  [ORANGE]: [
    SHORT_NAME_MAP.ORANGE_2_2_A,
    SHORT_NAME_MAP.ORANGE_2_2_B,
    SHORT_NAME_MAP.ORANGE_2_2_1_A,
    SHORT_NAME_MAP.ORANGE_2_2_1_B,
    SHORT_NAME_MAP.ORANGE_2_2_2,
    SHORT_NAME_MAP.ORANGE_2_2_3,
  ],
  [RADIATION]: [SHORT_NAME_MAP.RADIATION_2_3_A, SHORT_NAME_MAP.RADIATION_2_3_B],
  [CAMP_LEJEUNE]: [SHORT_NAME_MAP.LEJEUNE_2_4],
});
