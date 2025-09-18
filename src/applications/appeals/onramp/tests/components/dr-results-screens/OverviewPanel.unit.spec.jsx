import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import OverviewPanel, {
  ELIGIBLE_TEXT_DR_WITH_CFI,
  ELIGIBLE_TEXT_DR_ONLY,
  HEADING_DR_WITH_CFI,
  HEADING_DR_ONLY,
} from '../../../components/dr-results-screens/OverviewPanel';
import { RESPONSES } from '../../../constants/question-data-map';

const { BOARD, YES, NO } = RESPONSES;

describe('OverviewPanel', () => {
  describe('non-CFI variant', () => {
    it('renders all available options as list items', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: YES,
        Q_1_3A_FEWER_60_DAYS: YES,
        Q_2_H_2_NEW_EVIDENCE: NO,
        Q_2_H_2B_JUDGE_HEARING: YES,
      };

      const expectedOptions = ['Board Appeal: Hearing'];

      const screen = render(<OverviewPanel formResponses={formResponses} />);

      expect(screen.getByRole('heading', { level: 2 }).textContent).to.equal(
        HEADING_DR_ONLY,
      );

      expect(screen.getByText(ELIGIBLE_TEXT_DR_ONLY)).to.exist;

      expectedOptions.forEach(option => {
        expect(screen.getByText(option)).to.exist;
      });
    });
  });

  describe('CFI variant', () => {
    it('renders all available options as list items and CFI specific text', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: NO,
        Q_2_IS_1_SERVICE_CONNECTED: YES,
        Q_2_IS_2_CONDITION_WORSENED: YES,
        Q_2_IS_4_DISAGREE_DECISION: YES,
        Q_2_0_CLAIM_TYPE: BOARD,
        Q_2_S_1_NEW_EVIDENCE: YES,
      };

      const expectedOptions = ['Supplemental Claim'];

      const screen = render(<OverviewPanel formResponses={formResponses} />);

      expect(screen.getByRole('heading', { level: 2 }).textContent).to.equal(
        HEADING_DR_WITH_CFI,
      );

      expect(screen.getByText(ELIGIBLE_TEXT_DR_WITH_CFI)).to.exist;

      expectedOptions.forEach(option => {
        expect(screen.getByText(option)).to.exist;
      });

      expect(screen.getByTestId('claim-for-increase-option').textContent).to
        .exist;
    });
  });
});
