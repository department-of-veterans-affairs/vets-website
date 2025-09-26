import { expect } from 'chai';
import { render } from '@testing-library/react';
import { getDisplayCards } from '../../utilities/dr-results-card-display-utils';
import * as c from '../../constants/results-content/dr-screens/card-content';
import { RESPONSES } from '../../constants/question-data-map';

const { INIT, NO, YES } = RESPONSES;

describe('getDisplayCards', () => {
  describe('good fit cards', () => {
    it('should properly return a Supplemental Claims summary screen card', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: NO,
        Q_2_IS_1_SERVICE_CONNECTED: NO,
        Q_2_0_CLAIM_TYPE: INIT,
        Q_2_IS_1A_LAW_POLICY_CHANGE: YES,
      };

      const { container } = render(getDisplayCards(formResponses).goodFitCards);

      expect(container.innerHTML).to.contain(
        '<h3 class="vads-u-margin-top--0">Supplemental Claim</h3>',
      );
      expect(container.innerHTML).to.contain(
        `<li data-testid="gf-content-0">${c.CARD_GF_REVIEW_INIT}`,
      );
      expect(container.innerHTML).to.contain(
        `<li data-testid="gf-content-1">${c.CARD_GF_YES_LAW_POLICY}`,
      );
      expect(container.innerHTML).to.contain(
        `<li data-testid="gf-content-2">${c.CARD_GF_NOT_CONTESTED}`,
      );
    });
  });

  describe('not good fit cards', () => {
    it('should properly return a Higher-Level Review summary screen card', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: NO,
        Q_2_IS_1_SERVICE_CONNECTED: NO,
        Q_2_0_CLAIM_TYPE: INIT,
        Q_2_IS_1A_LAW_POLICY_CHANGE: YES,
      };

      const { container } = render(
        getDisplayCards(formResponses).notGoodFitCards,
      );

      expect(container.innerHTML).to.contain(
        '<h4 class="vads-u-margin-top--0">Higher-Level Review</h4>',
      );
      expect(container.innerHTML).to.contain(
        `<p data-testid="ngf-content-0">${c.CARD_NGF_YES_LAW_POLICY}`,
      );
    });
  });
});
