import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import OverviewPanel, {
  HEADING_DR_WITH_CFI,
} from '../../../components/dr-results-screens/OverviewPanel';
import { RESPONSES } from '../../../constants/question-data-map';

const { INIT, BOARD, YES, NO } = RESPONSES;

describe('OverviewPanel', () => {
  describe('non-CFI variant', () => {
    it('renders single option with singular text', () => {
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
        'Decision review option based on your answers',
      );

      expect(
        screen.getByText(
          'You may be eligible for this decision review option:',
        ),
      ).to.exist;

      expectedOptions.forEach(option => {
        expect(screen.getByText(option)).to.exist;
      });
    });

    it('renders multiple options with plural text', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: NO,
        Q_2_IS_1_SERVICE_CONNECTED: NO,
        Q_2_0_CLAIM_TYPE: INIT,
        Q_2_IS_1A_LAW_POLICY_CHANGE: NO,
        Q_2_IS_1B_NEW_EVIDENCE: NO,
      };

      const screen = render(<OverviewPanel formResponses={formResponses} />);

      expect(screen.getByRole('heading', { level: 2 }).textContent).to.equal(
        'Decision review options based on your answers',
      );

      expect(
        screen.getByText(
          'You may be eligible for these decision review options:',
        ),
      ).to.exist;
    });
  });

  describe('CFI variant', () => {
    it('renders single option with CFI-specific text', () => {
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

      expect(
        screen.getByText(
          'You may be eligible for this decision review option because you disagree with a decision:',
        ),
      ).to.exist;

      expectedOptions.forEach(option => {
        expect(screen.getByText(option)).to.exist;
      });

      expect(screen.getByTestId('claim-for-increase-option').textContent).to
        .exist;
    });

    it('renders multiple options with CFI-specific plural text', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: YES,
        Q_1_2_CLAIM_DECISION: YES,
        Q_1_3_CLAIM_CONTESTED: NO,
        Q_2_IS_1_SERVICE_CONNECTED: YES,
        Q_2_IS_2_CONDITION_WORSENED: YES,
        Q_2_IS_4_DISAGREE_DECISION: YES,
        Q_2_0_CLAIM_TYPE: INIT,
        Q_2_IS_1A_LAW_POLICY_CHANGE: NO,
        Q_2_IS_1B_NEW_EVIDENCE: NO,
      };

      const screen = render(<OverviewPanel formResponses={formResponses} />);

      expect(screen.getByRole('heading', { level: 2 }).textContent).to.equal(
        HEADING_DR_WITH_CFI,
      );

      expect(
        screen.getByText(
          'You may be eligible for these decision review options because you disagree with a decision:',
        ),
      ).to.exist;

      expect(screen.getByTestId('claim-for-increase-option').textContent).to
        .exist;
    });
  });

  describe('dynamic text generation', () => {
    it('correctly handles edge case with no available options', () => {
      const formResponses = {
        Q_1_1_CLAIM_DECISION: NO,
      };

      const screen = render(<OverviewPanel formResponses={formResponses} />);

      expect(screen.getByRole('heading', { level: 2 }).textContent).to.equal(
        'Decision review options based on your answers',
      );

      expect(
        screen.getByText(
          'You may be eligible for these decision review options:',
        ),
      ).to.exist;
    });
  });
});
