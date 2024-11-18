import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import ConfirmationIssues from '../../components/ConfirmationIssues';

describe('ConfirmationIssues', () => {
  const mockAreaOfDisagreement = [
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'tinnitus',
        approxDecisionDate: '2021-6-1',
      },
      disagreementOptions: {
        serviceConnection: true,
        effectiveDate: true,
        evaluation: true,
      },
      otherEntry: 'this is tinnitus entry',
    },
    {
      type: 'contestableIssue',
      attributes: {
        ratingIssueSubjectText: 'left knee',
        approxDecisionDate: '2021-6-2',
      },
      disagreementOptions: {
        serviceConnection: false,
        effectiveDate: true,
      },
      otherEntry: '',
    },
    {
      issue: 'right shoulder',
      decisionDate: '2021-6-6',
      disagreementOptions: {
        evaluation: true,
      },
      otherEntry: 'this is right shoulder entry',
    },
  ];
  const getData = ({ areaOfDisagreement = mockAreaOfDisagreement } = {}) => ({
    areaOfDisagreement,
  });

  it('should render all fields', () => {
    const { container } = render(<ConfirmationIssues data={getData()} />);

    expect($('h3', container).textContent).to.eq('Issues for review');
    expect($$('ul[role="list"]', container).length).to.eq(2);

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

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(3);
    expect(items.map(item => item.textContent)).to.deep.equal([
      'Item 1',
      'Item 2',
      'tinnitusDecision date: June 1, 2021Disagree with the service connection, the effective date of award, your evaluation of my condition, and this is tinnitus entry',
    ]);
  });
});
