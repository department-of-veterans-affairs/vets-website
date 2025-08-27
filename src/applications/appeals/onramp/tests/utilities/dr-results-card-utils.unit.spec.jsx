import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import {
  getCardContent,
  getCardTitle,
  swapPrefix,
} from '../../utilities/dr-results-card-utils';
import { RESPONSES } from '../../constants/question-data-map';
import * as c from '../../constants/results-content/dr-screens/card-content';

const { HLR, INIT, NO, SC, YES } = RESPONSES;

// Mocks for imported modules/constants
const mockContent = {
  TITLE_SC: 'Supplemental Claim',
  CARD_CONTENT_GF_SC: ['GF_ITEM_1', 'GF_ITEM_2'],
  CARD_CONTENT_NGF_SC: ['NGF_ITEM_1'],
  LEARN_MORE_SC: { url: 'https://va.gov/sc', text: 'Learn more SC' },
  START_SC: { url: 'https://va.gov/start-sc', text: 'Start SC' },
  CARD_HLR: 'CARD_HLR',
  TITLE_HLR: 'Higher-Level Review',
  CARD_BOARD: 'CARD_BOARD',
  TITLE_BOARD: 'Board Appeal',
  CARD_COURT_OF_APPEALS: 'CARD_COURT_OF_APPEALS',
  DECISION_TIMELINES: { SC: 'SC Timeline', HLR: 'HLR Timeline' },
};
const mockDisplayConditions = {
  GF_ITEM_1: {},
  GF_ITEM_2: {},
  NGF_ITEM_1: {},
  CARD_COURT_OF_APPEALS: {},
};

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
    it('returns filtered content as list', () => {
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

    it('properly handles a junk card name', () => {
      expect(getCardContent('SOMETHING_SC', {})).to.be.null;
    });

    describe('when none of the content items meet display conditions', () => {
      it('should return null', () => {
        const stub = sinon
          .stub(c, 'CARD_CONTENT_GF_SC')
          .value(['Test item 1', 'Test item 2']);

        const formResponses = {
          Q_1_1_CLAIM_DECISION: YES,
          Q_1_2_CLAIM_DECISION: YES,
          Q_1_2A_CONDITION_WORSENED: NO,
          Q_1_2B_LAW_POLICY_CHANGE: YES,
        };

        expect(getCardContent('CARD_BOARD_HEARING', formResponses, true)).to.be
          .null;
        stub.restore();
      });
    });
  });

  describe('getLearnMoreLink', () => {
    it('returns a va-link element for SC', () => {
      const link = utils.getLearnMoreLink('CARD_SC');
      expect(link.props.href).to.equal('https://va.gov/sc');
      expect(link.props.text).to.equal('Learn more SC');
    });
    it('returns null if no linkInfo', () => {
      utils.c.LEARN_MORE_SC = undefined;
      expect(utils.getLearnMoreLink('CARD_SC')).to.be.null;
    });
  });

  // describe('getStartLink', () => {
  //   it('returns a va-link-action element for SC', () => {
  //     const link = utils.getStartLink('CARD_SC');
  //     expect(link.props.href).to.equal('https://va.gov/start-sc');
  //     expect(link.props.text).to.equal('Start SC');
  //   });
  //   it('returns null if no startLink', () => {
  //     utils.c.START_SC = undefined;
  //     expect(utils.getStartLink('CARD_SC')).to.be.null;
  //   });
  // });

  // describe('getLimitOneText', () => {
  //   it('returns TITLE_HLR for CARD_HLR', () => {
  //     expect(utils.getLimitOneText('CARD_HLR')).to.equal('Higher-Level Review');
  //   });
  //   it('returns TITLE_BOARD for BOARD', () => {
  //     expect(utils.getLimitOneText('CARD_BOARD')).to.equal('Board Appeal');
  //   });
  //   it('returns null for unknown', () => {
  //     expect(utils.getLimitOneText('CARD_SC')).to.be.null;
  //   });
  // });

  // describe('showOutsideDROption', () => {
  //   it('returns JSX if displayConditionsMet is true', () => {
  //     const result = utils.showOutsideDROption({});
  //     expect(result.props.children[1].type).to.equal(utils.OutsideDROption);
  //   });
  //   it('returns null if displayConditionsMet is false', () => {
  //     utils.displayConditionsMet.returns(false);
  //     expect(utils.showOutsideDROption({})).to.be.null;
  //   });
  // });

  // describe('getDecisionTimeline', () => {
  //   it('returns timeline string for SC', () => {
  //     expect(utils.getDecisionTimeline('CARD_SC')).to.equal('SC Timeline');
  //   });
  //   it('returns empty string for unknown', () => {
  //     expect(utils.getDecisionTimeline('CARD_UNKNOWN')).to.equal('');
  //   });
  //   it('returns null if swapPrefix returns empty', () => {
  //     utils.swapPrefix.returns('');
  //     expect(utils.getDecisionTimeline('CARD_SC')).to.be.null;
  //   });
  // });
});
