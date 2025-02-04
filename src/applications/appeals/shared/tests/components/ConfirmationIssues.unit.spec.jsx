import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { SELECTED } from '../../constants';
import ConfirmationIssues from '../../components/ConfirmationIssues';

describe('ConfirmationIssues', () => {
  const mockIssues = [
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'tinnitus',
        approxDecisionDate: '2021-6-1',
      },
      [SELECTED]: true,
    },
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'left knee',
        approxDecisionDate: '2021-6-2',
      },
      [SELECTED]: true,
    },
    {
      issue: 'right shoulder',
      decisionDate: '2021-6-6',
      [SELECTED]: true,
    },
    {
      issue: 'left shoulder',
      decisionDate: '2021-8-8',
      [SELECTED]: false,
    },
  ];
  const mockAreaOfDisagreement = [
    {
      ...mockIssues[0],
      disagreementOptions: {
        serviceConnection: true,
        effectiveDate: true,
        evaluation: true,
      },
      otherEntry: 'this is tinnitus entry',
    },
    {
      ...mockIssues[1],
      disagreementOptions: {
        serviceConnection: false,
        effectiveDate: true,
      },
      otherEntry: '',
    },
    {
      ...mockIssues[2],
      disagreementOptions: {
        evaluation: true,
      },
      otherEntry: 'this is right shoulder entry',
    },
  ];
  const getData = ({ areaOfDisagreement = mockAreaOfDisagreement } = {}) => ({
    areaOfDisagreement,
  });

  it('should render contestedIssues in a single UL', () => {
    const { container } = render(
      <ConfirmationIssues
        text="Some issues for review"
        data={{ contestedIssues: mockIssues }}
      />,
    );

    expect($('h3', container).textContent).to.eq('Issues for review');
    expect($$('ul[role="list"]', container).length).to.eq(1);
    expect($$('li', container).length).to.eq(3);
    expect($('.issue-block', container).textContent).to.contain(
      'Some issues for review:',
    );

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(3);
    expect(items.map(item => item.textContent)).to.deep.equal([
      'tinnitusDecision date: June 1, 2021',
      'left kneeDecision date: June 2, 2021',
      'right shoulderDecision date: June 6, 2021',
    ]);
  });

  it('should render all fields with area of disagreement data', () => {
    const { container } = render(
      <ConfirmationIssues text="Some issues" data={getData()} />,
    );

    expect($('h3', container).textContent).to.eq('Issues for review');
    expect($$('ul[role="list"]', container).length).to.eq(1);
    expect($('.issue-block', container).textContent).to.contain('Some issues:');

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(3);
    expect(items.map(item => item.textContent)).to.deep.equal([
      'tinnitusDecision date: June 1, 2021Disagree with the service connection, the effective date of award, your evaluation of my condition, and this is tinnitus entry',
      'left kneeDecision date: June 2, 2021Disagree with the effective date of award',
      'right shoulderDecision date: June 6, 2021Disagree with your evaluation of my condition and this is right shoulder entry',
    ]);
  });

  it('should render list children', () => {
    const data = getData({
      areaOfDisagreement: [mockAreaOfDisagreement[0]],
    });
    const { container } = render(
      <ConfirmationIssues data={data}>
        <>
          <li>
            <div className="dd-privacy-hidden" data-dd-action-name="item 1">
              Item 1
            </div>
          </li>
          <li>
            <div className="dd-privacy-hidden" data-dd-action-name="item 2">
              Item 2
            </div>
          </li>
        </>
      </ConfirmationIssues>,
    );

    expect($('h3', container).textContent).to.eq('Issues for review');
    expect($$('ul[role="list"]', container).length).to.eq(2);
    expect(
      $$('ul[role="list"] > li > ul[role="list"]', container).length,
    ).to.eq(1);
    expect($('li .issue-block', container).textContent).to.contain(
      'You’ve selected these issues for review:',
    );

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(3);
    expect(items.map(item => item.textContent)).to.deep.equal([
      'Item 1',
      'Item 2',
      'tinnitusDecision date: June 1, 2021Disagree with the service connection, the effective date of award, your evaluation of my condition, and this is tinnitus entry',
    ]);
  });
});
