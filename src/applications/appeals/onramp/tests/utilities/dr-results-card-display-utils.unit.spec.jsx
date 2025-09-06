import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  displayCards,
  displayNotGoodFitCards,
} from '../../utilities/dr-results-card-display-utils';
import * as c from '../../constants/results-content/dr-screens/card-content';
import { RESPONSES } from '../../constants/question-data-map';

const { INIT, NO, SC, YES } = RESPONSES;

describe('displayCards', () => {
  it('should properly return a Supplemental Claims summary screen card', () => {
    const formResponses = {
      Q_1_1_CLAIM_DECISION: YES,
      Q_1_2_CLAIM_DECISION: YES,
      Q_1_3_CLAIM_CONTESTED: NO,
      Q_2_0_CLAIM_TYPE: INIT,
      Q_2_IS_1_SERVICE_CONNECTED: NO,
      Q_2_IS_1A_LAW_POLICY_CHANGE: YES,
    };

    const { container } = render(displayCards(formResponses, true));

    expect(container.innerHTML).to.contain(
      '<h3 class="vads-u-margin-top--0">Supplemental Claim</h3>',
    );
    expect(container.innerHTML).to.contain(
      `<li data-testid="gf-content-0">${c.CARD_REVIEW_INIT}`,
    );
    expect(container.innerHTML).to.contain(
      `<li data-testid="gf-content-1">${c.CARD_LAW_POLICY_CHANGE}`,
    );
    expect(container.innerHTML).to.contain(
      `<li data-testid="gf-content-2">${c.CARD_NOT_CONTESTED}`,
    );
  });
});

describe('displayNotGoodFitCards', () => {
  it('should properly return a Higher-Level Review summary screen card', () => {
    const formResponses = {
      Q_1_1_CLAIM_DECISION: YES,
      Q_1_2_CLAIM_DECISION: YES,
      Q_1_3_CLAIM_CONTESTED: NO,
      Q_2_0_CLAIM_TYPE: SC,
      Q_2_IS_1_SERVICE_CONNECTED: NO,
      Q_2_IS_1A_LAW_POLICY_CHANGE: NO,
      Q_2_IS_1B_NEW_EVIDENCE: YES,
    };

    const { container } = render(displayNotGoodFitCards(formResponses));

    expect(container.innerHTML).to.contain(
      '<h3 class="vads-u-margin-top--0">Higher-Level Review</h3>',
    );
    expect(container.innerHTML).to.contain(
      `<p data-testid="ngf-content-0">${c.CARD_CANNOT_SUBMIT_EVIDENCE}.</p>`,
    );
  });
});
