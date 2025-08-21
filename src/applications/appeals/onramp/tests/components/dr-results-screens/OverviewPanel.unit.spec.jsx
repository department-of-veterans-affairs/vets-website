import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import OverviewPanel from '../../../components/dr-results-screens/OverviewPanel';
import { RESPONSES } from '../../../constants/question-data-map';

const { YES, NO } = RESPONSES;

describe('OverviewPanel', () => {
  it('renders all available options as list items', () => {
    const formResponses = {
      Q_1_1_CLAIM_DECISION: YES,
      Q_1_2_CLAIM_DECISION: YES,
      Q_1_3_CLAIM_CONTESTED: YES,
      Q_1_3A_FEWER_60_DAYS: YES,
      Q_2_H_2_NEW_EVIDENCE: YES,
      Q_2_H_2A_JUDGE_HEARING: NO,
    };

    const expectedOptions = [
      'Supplemental Claim',
      'Board Appeal: Evidence Submission',
    ];

    const screen = render(<OverviewPanel formResponses={formResponses} />);

    expectedOptions.forEach(option => {
      expect(screen.getByText(option)).to.exist;
    });
  });
});
