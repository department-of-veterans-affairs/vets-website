import { expect } from 'chai';
import {
  getDynamicAccordions,
  isDisplayRequirementFulfilled,
} from '../../utilities/results-1-2-accordions';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';
import { BATCH_MAP, BATCHES } from '../../constants/question-batches';

const { ORANGE, BURN_PITS, CAMP_LEJEUNE, RADIATION } = BATCHES;

const {
  BURN_PIT_2_1,
  BURN_PIT_2_1_1,
  BURN_PIT_2_1_2,
  ORANGE_2_2_A,
  ORANGE_2_2_1_A,
  ORANGE_2_2_2,
  ORANGE_2_2_3,
  RADIATION_2_3_A,
  LEJEUNE_2_4,
} = SHORT_NAME_MAP;

const getContentKey = (form, index) =>
  getDynamicAccordions(form)?.[index].content.key;

describe('Results set 1, page 2 utilities', () => {
  describe('getDynamicAccordions', () => {
    describe('single batch of content returned', () => {
      describe(BURN_PIT_2_1, () => {
        const form = { BURN_PIT_2_1: RESPONSES.YES };

        it('should return the correct dynamic content', () => {
          expect(getContentKey(form, 0)).to.equal(`${BURN_PITS}-1`);
          expect(getContentKey(form, 1)).to.equal(`${BURN_PITS}-2`);
        });
      });

      describe(BURN_PIT_2_1_1, () => {
        const form = { BURN_PIT_2_1_1: RESPONSES.YES };

        it('should return the correct dynamic content', () => {
          expect(getContentKey(form, 0)).to.equal(`${BURN_PITS}-1`);
          expect(getContentKey(form, 1)).to.equal(`${BURN_PITS}-2`);
        });
      });

      describe(BURN_PIT_2_1_2, () => {
        const form = { BURN_PIT_2_1_2: RESPONSES.YES };

        it('should return the correct dynamic content', () => {
          expect(getContentKey(form, 0)).to.equal(`${BURN_PITS}-1`);
          expect(getContentKey(form, 1)).to.equal(`${BURN_PITS}-2`);
        });
      });

      describe(ORANGE_2_2_A, () => {
        const form = { ORANGE_2_2_A: RESPONSES.YES };

        it('should return the correct dynamic content', () => {
          expect(getContentKey(form, 0)).to.equal(`${ORANGE}-1`);
          expect(getContentKey(form, 1)).to.equal(`${ORANGE}-2`);
        });
      });

      describe(ORANGE_2_2_1_A, () => {
        const form = { ORANGE_2_2_1_A: RESPONSES.YES };

        it('should return the correct dynamic content', () => {
          expect(getContentKey(form, 0)).to.equal(`${ORANGE}-1`);
          expect(getContentKey(form, 1)).to.equal(`${ORANGE}-2`);
        });
      });

      describe(ORANGE_2_2_2, () => {
        const form = { ORANGE_2_2_2: RESPONSES.YES };

        it('should return the correct dynamic content', () => {
          expect(getContentKey(form, 0)).to.equal(`${ORANGE}-1`);
          expect(getContentKey(form, 1)).to.equal(`${ORANGE}-2`);
        });
      });

      describe(ORANGE_2_2_3, () => {
        const form = { ORANGE_2_2_3: RESPONSES.YES };

        it('should return the correct dynamic content', () => {
          expect(getContentKey(form, 0)).to.equal(`${ORANGE}-1`);
          expect(getContentKey(form, 1)).to.equal(`${ORANGE}-2`);
        });
      });

      describe(RADIATION_2_3_A, () => {
        const form = { RADIATION_2_3_A: RESPONSES.YES };

        it('should return the correct dynamic content', () => {
          expect(getContentKey(form, 0)).to.equal(`${RADIATION}-1`);
          expect(getContentKey(form, 1)).to.equal(`${RADIATION}-2`);
        });
      });

      describe(LEJEUNE_2_4, () => {
        const form = { LEJEUNE_2_4: RESPONSES.YES };

        it('should return the correct dynamic content', () => {
          expect(getContentKey(form, 0)).to.equal(CAMP_LEJEUNE);
        });
      });
    });

    describe('multiple batches of content returned', () => {
      describe('scenario one', () => {
        const form = {
          BURN_PIT_2_1: RESPONSES.YES,
          ORANGE_2_2_2: RESPONSES.YES,
          RADIATION_2_3_A: RESPONSES.YES,
          LEJEUNE_2_4: RESPONSES.YES,
        };

        it('should return the correct dynamic content', () => {
          expect(getContentKey(form, 0)).to.equal(`${BURN_PITS}-1`);
          expect(getContentKey(form, 1)).to.equal(`${BURN_PITS}-2`);
          expect(getContentKey(form, 2)).to.equal(`${ORANGE}-1`);
          expect(getContentKey(form, 3)).to.equal(`${ORANGE}-2`);
          expect(getContentKey(form, 4)).to.equal(`${RADIATION}-1`);
          expect(getContentKey(form, 5)).to.equal(`${RADIATION}-2`);
          expect(getContentKey(form, 6)).to.equal(CAMP_LEJEUNE);
        });
      });

      describe('scenario two', () => {
        const form = {
          BURN_PIT_2_1: RESPONSES.YES,
          LEJEUNE_2_4: RESPONSES.YES,
        };

        it('should return the correct dynamic content', () => {
          expect(getContentKey(form, 0)).to.equal(`${BURN_PITS}-1`);
          expect(getContentKey(form, 1)).to.equal(`${BURN_PITS}-2`);
          expect(getContentKey(form, 2)).to.equal(CAMP_LEJEUNE);
        });
      });
    });

    describe('no content returned', () => {
      const form = {};

      it('should return nothing', () => {
        expect(getDynamicAccordions(form)).to.deep.equal([]);
      });
    });
  });

  describe('isDisplayRequirementFulfilled', () => {
    describe('for Burn pit questions', () => {
      it('should return true', () => {
        const form = { BURN_PIT_2_1_2: RESPONSES.YES };

        expect(isDisplayRequirementFulfilled(form, BATCH_MAP[BURN_PITS])).to.be
          .true;
      });
    });

    describe('for Agent Orange question', () => {
      it('should return true', () => {
        const form = { ORANGE_2_2_A: RESPONSES.YES };

        expect(isDisplayRequirementFulfilled(form, [ORANGE_2_2_A])).to.be.true;
      });
    });

    describe('for Camp Lejeune question', () => {
      it('should return true', () => {
        const form = { LEJEUNE_2_4: RESPONSES.YES };

        expect(isDisplayRequirementFulfilled(form, [ORANGE_2_2_A, LEJEUNE_2_4]))
          .to.be.true;
      });
    });

    describe('for Orange/Lejeune question', () => {
      it('should return true', () => {
        const form = { LEJEUNE_2_4: RESPONSES.YES };

        expect(isDisplayRequirementFulfilled(form, [ORANGE_2_2_A, LEJEUNE_2_4]))
          .to.be.true;
      });
    });

    describe('when the requirements are not met', () => {
      it('should return false', () => {
        const form = { BURN_PIT_2_1_2: RESPONSES.YES };

        expect(isDisplayRequirementFulfilled(form, [ORANGE_2_2_A, LEJEUNE_2_4]))
          .to.be.false;
      });
    });
  });
});
