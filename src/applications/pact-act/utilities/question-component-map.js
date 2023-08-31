import BurnPit210 from '../containers/questions/burn-pit/BurnPit-2-1-0';
import ServicePeriod from '../containers/questions/ServicePeriod';
import { BATCHES } from './question-batches';

// This maps SNAKE_CASE name for a question to the component
// and assigns batch (category) for results screen branching
export const QUESTIONS = {
  SERVICE_PERIOD: {
    component: ServicePeriod,
    batch: null,
  },
  BURN_PIT_210: {
    component: BurnPit210,
    batch: BATCHES.BURN_PITS,
  },
};
