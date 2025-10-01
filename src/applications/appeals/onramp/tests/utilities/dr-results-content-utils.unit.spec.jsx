import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import {
  getCardContent,
  getCardTitle,
  getDecisionTimeline,
  getLearnMoreLink,
  getStartLink,
  showOutsideDROption,
  swapPrefix,
} from '../../utilities/dr-results-content-utils';
import { RESPONSES } from '../../constants/question-data-map';
import * as c from '../../constants/results-content/dr-screens/card-content';

const { BOARD, INIT, NO, SC, YES } = RESPONSES;

describe('card utilities', () => {
  describe('swapPrefix', () => {
    it('should return an empty string when the string does not contain the "from" value', () => {
      expect(swapPrefix('SOMETHING_SC', 'CARD', 'TITLE')).to.equal('');
    });

    describe('when keepUnderscore is false', () => {
      it('swaps the prefix and removes the underscore', () => {
        expect(swapPrefix('CARD_SC', 'CARD', 'TITLE', false)).to.equal(
          'TITLESC',
        );
      });
    });

    describe('when keepUnderscore is true', () => {
      it('swaps the prefix and keeps the underscore', () => {
        expect(swapPrefix('CARD_SC', 'CARD', 'TITLE', true)).to.equal(
          'TITLE_SC',
        );
      });
    });
  });

  describe('getCardTitle', () => {
    it('returns the correct title', () => {
      expect(getCardTitle('CARD_SC')).to.equal('Supplemental Claim');
      expect(getCardTitle('CARD_BOARD_EVIDENCE')).to.equal(
        'Board Appeal: Evidence Submission',
      );
    });

    it('returns null if an incorrect card name is given', () => {
      expect(getCardTitle('SOMETHING_TITLE')).to.be.null;
    });
  });

  describe('getCardContent', () => {
    it('returns filtered content as list for a good fit card', () => {
      const stub = sinon
        .stub(c, 'CARD_CONTENT_GF_SC')
        .value(['Test item 1', 'Test item 2']);

      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: NO,
        Q_2_0_CLAIM_TYPE: SC,
        Q_2_S_1_NEW_EVIDENCE: YES,
      };

      const screen = render(getCardContent('CARD_SC', formResponses, true));

      expect(screen.getByText('Test item 1', { exact: false })).to.exist;
      expect(screen.getByText('Test item 2')).to.exist;
      stub.restore();
    });

    it('returns filtered content as list for a not good fit card', () => {
      const stub = sinon
        .stub(c, 'CARD_CONTENT_NGF_SC')
        .value(['Test item A', 'Test item B']);

      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: NO,
        Q_2_0_CLAIM_TYPE: SC,
        Q_2_S_1_NEW_EVIDENCE: YES,
      };

      const screen = render(getCardContent('CARD_SC', formResponses, false));

      expect(screen.getByText('Test item A', { exact: false })).to.exist;
      expect(screen.getByText('Test item B')).to.exist;
      stub.restore();
    });

    it('properly handles a junk card name', () => {
      expect(getCardContent('SOMETHING_SC', {})).to.be.null;
    });
  });

  describe('getLearnMoreLink', () => {
    it('returns a va-link element for Supplemental Claims', () => {
      const link = getLearnMoreLink('CARD_SC');
      expect(link.props.href).to.equal('/decision-reviews/supplemental-claim');
      expect(link.props.text).to.equal('Learn more about Supplemental Claims');
    });

    it('returns a va-link element for Board Evidence', () => {
      const link = getLearnMoreLink('CARD_BOARD_EVIDENCE');
      expect(link.props.href).to.equal('/decision-reviews/board-appeal');
      expect(link.props.text).to.equal('Learn more about Board Appeals');
    });

    it('returns null if a card that does not exist is provided', () => {
      expect(getLearnMoreLink('CARD_SOMETHING')).to.be.null;
    });
  });

  describe('getStartLink', () => {
    it('returns a va-link-action element for Board - Evidence', () => {
      const link = getStartLink('CARD_BOARD_EVIDENCE');
      expect(link.props.href).to.equal(
        '/decision-reviews/board-appeal/request-board-appeal-form-10182/start',
      );
      expect(link.props.text).to.equal('Start Board Appeal Request');
    });

    it('returns null if a card that does not exist is provided', () => {
      expect(getStartLink('CARD_SOMETHING')).to.be.null;
    });
  });

  describe('showOutsideDROption', () => {
    it('returns the proper markup if the display conditions are met', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: NO,
        Q_2_0_CLAIM_TYPE: BOARD,
        Q_2_IS_1_SERVICE_CONNECTED: NO,
        Q_2_IS_1A_LAW_POLICY_CHANGE: NO,
        Q_2_IS_1B_NEW_EVIDENCE: NO,
      };

      const screen = render(showOutsideDROption(formResponses));
      expect(screen.getByText(/US Court of Appeals for Veterans Claims/)).to
        .exist;
    });

    it('returns null if the display conditions are not met', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: NO,
        Q_2_0_CLAIM_TYPE: INIT,
        Q_2_IS_1_SERVICE_CONNECTED: NO,
        Q_2_IS_1A_LAW_POLICY_CHANGE: NO,
        Q_2_IS_1B_NEW_EVIDENCE: NO,
      };

      expect(showOutsideDROption(formResponses)).to.be.null;
    });
  });

  describe('getDecisionTimeline', () => {
    it('returns timeline string for SC', () => {
      expect(getDecisionTimeline('CARD_SC')).to.equal(
        '79.3 days (roughly 3 months)',
      );
    });

    it('returns empty string for unknown', () => {
      expect(getDecisionTimeline('UNKNOWN')).to.equal(null);
      expect(getDecisionTimeline('CARD_UNKNOWN')).to.equal('');
    });
  });
});
