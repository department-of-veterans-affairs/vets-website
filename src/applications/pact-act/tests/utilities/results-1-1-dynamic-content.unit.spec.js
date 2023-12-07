import { expect } from 'chai';
import { getDynamicContent } from '../../utilities/results-1-1-dynamic-content';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';

const {
  BURN_PIT_2_1,
  BURN_PIT_2_1_1,
  BURN_PIT_2_1_2,
  ORANGE_2_2_B,
  ORANGE_2_2_1_B,
  ORANGE_2_2_2,
  ORANGE_2_2_3,
  RADIATION_2_3_B,
  LEJEUNE_2_4,
} = SHORT_NAME_MAP;

const {
  AMERICAN_SAMOA,
  CAMBODIA,
  ENEWETAK_ATOLL,
  GREENLAND_THULE,
  GUAM,
  JOHNSTON_ATOLL,
  KOREA_DMZ,
  LAOS,
  NO,
  NOT_SURE,
  SPAIN_PALOMARES,
  THAILAND,
  VIETNAM_REP,
  VIETNAM_WATERS,
  YES,
} = RESPONSES;

describe('Results set 1, page 1 utilities', () => {
  describe('getDynamicContent - single piece of content returned', () => {
    describe(BURN_PIT_2_1, () => {
      const form = { BURN_PIT_2_1: YES };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(BURN_PIT_2_1);
      });
    });

    describe(BURN_PIT_2_1_1, () => {
      const form = { BURN_PIT_2_1_1: YES };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(BURN_PIT_2_1_1);
      });
    });

    describe(BURN_PIT_2_1_2, () => {
      const form = { BURN_PIT_2_1_2: YES };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(BURN_PIT_2_1_2);
      });
    });

    describe(`${ORANGE_2_2_B} - ${VIETNAM_REP}`, () => {
      const form = { ORANGE_2_2_B: [VIETNAM_REP] };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(`${ORANGE_2_2_B}-1`);
      });
    });

    describe(`${ORANGE_2_2_B} - ${VIETNAM_WATERS}`, () => {
      const form = { ORANGE_2_2_B: [VIETNAM_WATERS] };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(`${ORANGE_2_2_B}-2`);
      });
    });

    describe(`${ORANGE_2_2_B} - ${KOREA_DMZ}`, () => {
      const form = { ORANGE_2_2_B: [KOREA_DMZ] };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(`${ORANGE_2_2_B}-3`);
      });
    });

    describe(`${ORANGE_2_2_1_B} - ${AMERICAN_SAMOA}`, () => {
      const form = { ORANGE_2_2_1_B: [AMERICAN_SAMOA] };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(`${ORANGE_2_2_1_B}-1`);
      });
    });

    describe(`${ORANGE_2_2_1_B} - ${CAMBODIA}`, () => {
      const form = { ORANGE_2_2_1_B: [CAMBODIA] };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(`${ORANGE_2_2_1_B}-2`);
      });
    });

    describe(`${ORANGE_2_2_1_B} - ${GUAM}`, () => {
      const form = { ORANGE_2_2_1_B: [GUAM] };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(`${ORANGE_2_2_1_B}-3`);
      });
    });

    describe(`${ORANGE_2_2_1_B} - ${JOHNSTON_ATOLL}`, () => {
      const form = { ORANGE_2_2_1_B: [JOHNSTON_ATOLL] };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(`${ORANGE_2_2_1_B}-4`);
      });
    });

    describe(`${ORANGE_2_2_1_B} - ${LAOS}`, () => {
      const form = { ORANGE_2_2_1_B: [LAOS] };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(`${ORANGE_2_2_1_B}-5`);
      });
    });

    describe(`${ORANGE_2_2_1_B} - ${THAILAND}`, () => {
      const form = { ORANGE_2_2_1_B: [THAILAND] };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(`${ORANGE_2_2_1_B}-6`);
      });
    });

    describe(ORANGE_2_2_2, () => {
      const form = { ORANGE_2_2_2: YES };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(ORANGE_2_2_2);
      });
    });

    describe(ORANGE_2_2_3, () => {
      const form = { ORANGE_2_2_3: YES };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(ORANGE_2_2_3);
      });
    });

    describe(`${RADIATION_2_3_B} - ${ENEWETAK_ATOLL}`, () => {
      const form = { RADIATION_2_3_B: [ENEWETAK_ATOLL] };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(`${RADIATION_2_3_B}-1`);
      });
    });

    describe(`${RADIATION_2_3_B} - ${SPAIN_PALOMARES}`, () => {
      const form = { RADIATION_2_3_B: [SPAIN_PALOMARES] };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(`${RADIATION_2_3_B}-2`);
      });
    });

    describe(`${RADIATION_2_3_B} - ${GREENLAND_THULE}`, () => {
      const form = { RADIATION_2_3_B: [GREENLAND_THULE] };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(`${RADIATION_2_3_B}-3`);
      });
    });

    describe(LEJEUNE_2_4, () => {
      const form = { LEJEUNE_2_4: YES };

      it('should return the correct dynamic content', () => {
        expect(getDynamicContent(form)[0].key).to.equal(LEJEUNE_2_4);
      });
    });
  });

  describe('getDynamicContent - multiple pieces of content returned', () => {
    describe('scenario one', () => {
      const form = {
        BURN_PIT_2_1: NO,
        BURN_PIT_2_1_1: NOT_SURE,
        BURN_PIT_2_1_2: YES,
        ORANGE_2_2_B: [VIETNAM_REP],
        RADIATION_2_3_B: [GREENLAND_THULE],
        LEJEUNE_2_4: YES,
      };

      it('should return the correct dynamic content', () => {
        const returnedKeys = getDynamicContent(form).map(
          content => content.key,
        );

        expect(returnedKeys).to.deep.equal([
          BURN_PIT_2_1_2,
          `${ORANGE_2_2_B}-1`,
          `${RADIATION_2_3_B}-3`,
          LEJEUNE_2_4,
        ]);
      });
    });

    describe('scenario two', () => {
      const form = {
        BURN_PIT_2_1: NO,
        BURN_PIT_2_1_1: YES,
        ORANGE_2_2_1_B: [AMERICAN_SAMOA, CAMBODIA, GUAM, LAOS],
        RADIATION_2_3_B: [ENEWETAK_ATOLL, SPAIN_PALOMARES, GREENLAND_THULE],
      };

      it('should return the correct dynamic content', () => {
        const returnedKeys = getDynamicContent(form).map(
          content => content.key,
        );

        expect(returnedKeys).to.deep.equal([
          BURN_PIT_2_1_1,
          `${ORANGE_2_2_1_B}-1`,
          `${ORANGE_2_2_1_B}-2`,
          `${ORANGE_2_2_1_B}-3`,
          `${ORANGE_2_2_1_B}-5`,
          `${RADIATION_2_3_B}-1`,
          `${RADIATION_2_3_B}-2`,
          `${RADIATION_2_3_B}-3`,
        ]);
      });
    });

    describe('scenario three', () => {
      const form = {
        ORANGE_2_2_2: YES,
        RADIATION_2_3_B: [SPAIN_PALOMARES],
      };

      it('should return the correct dynamic content', () => {
        const returnedKeys = getDynamicContent(form).map(
          content => content.key,
        );

        expect(returnedKeys).to.deep.equal([
          ORANGE_2_2_2,
          `${RADIATION_2_3_B}-2`,
        ]);
      });
    });
  });

  describe('getDynamicContent - when no valid form responses are given', () => {
    const form = {};

    it('should return nothing', () => {
      expect(getDynamicContent(form)).to.deep.equal([]);
    });
  });
});
