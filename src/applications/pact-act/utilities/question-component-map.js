import { BATCHES } from './question-batches';
import { SHORT_NAME_MAP } from './question-data-map';

const { ORANGE, BURN_PITS } = BATCHES;

// This maps SNAKE_CASE name for a question to the batch (category) for results screen branching
export const BATCH_MAP = {
  [ORANGE]: [
    SHORT_NAME_MAP.ORANGE_2_2_A,
    SHORT_NAME_MAP.ORANGE_2_2_B,
    SHORT_NAME_MAP.ORANGE_2_2_1_A,
    SHORT_NAME_MAP.ORANGE_2_2_1_B,
    SHORT_NAME_MAP.ORANGE_2_2_2,
    SHORT_NAME_MAP.ORANGE_2_2_3,
  ],
  [BURN_PITS]: [
    SHORT_NAME_MAP.BURN_PIT_2_1,
    SHORT_NAME_MAP.BURN_PIT_2_1_1,
    SHORT_NAME_MAP.BURN_PIT_2_1_2,
  ],
};
