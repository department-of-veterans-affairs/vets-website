import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import {
  getIssueTitle,
  issueTitle,
  AreaOfDisagreementReviewField,
} from '../../content/areaOfDisagreement';

describe('getIssueTitle', () => {
  const data = { issue: 'left arm', decisionDate: '2022-02-02' };
  it('should return title content', () => {
    const { container } = render(<div>{getIssueTitle(data)}</div>);

    expect($('div', container).textContent).to.eq(
      'Disagreement with left arm decision on February 2, 2022',
    );
    expect(
      $$('.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.eq(2);
  });
  it('should return a plain string', () => {
    const result = getIssueTitle(data, { plainText: true });
    expect(result).to.eq(
      'Disagreement with left arm decision on February 2, 2022',
    );
  });
  it('should not render a date if it is invalid', () => {
    const { container } = render(
      <div>{getIssueTitle({ issue: 'foo', decisionDate: 'abcd' })}</div>,
    );

    expect($('div', container).textContent).to.eq(
      'Disagreement with foo decision on ',
    );
  });
  it('should not throw an error if no data is passed in', () => {
    const { container } = render(<div>{getIssueTitle()}</div>);

    expect($('div', container)).to.exist;
  });
});

describe('issueTitle', () => {
  it('should return title wrapped in an h3', () => {
    const data = {
      data: {
        issue: 'right arm',
        decisionDate: '2023-03-03',
        index: 1,
      },
      onReviewPage: false,
    };
    const { container } = render(<div>{issueTitle(data)}</div>);

    const header = $('h3', container);
    expect(header.id).to.eq('disagreement-title-1');
    expect(header.textContent).to.eq(
      'Disagreement with right arm decision on March 3, 2023',
    );
  });
  it('should return title wrapped in an h4', () => {
    const data = {
      data: {
        issue: 'right arm',
        decisionDate: '2023-04-04',
        index: 2,
      },
      onReviewPage: true,
    };
    const { container } = render(<div>{issueTitle(data)}</div>);

    const header = $('h4', container);
    expect(header.id).to.eq('disagreement-title-2');
    expect(header.textContent).to.eq(
      'Disagreement with right arm decision on April 4, 2023',
    );
  });
});

describe('AreaOfDisagreementReviewField', () => {
  it('should render AreaOfDisagreementReviewField', () => {
    const title = 'Your evaluation of my condition';
    const { container } = render(
      <AreaOfDisagreementReviewField>
        {React.createElement(
          'div',
          {
            id: 'foo',
            name: 'evaluation',
            formData: {},
          },
          'Bar',
        )}
      </AreaOfDisagreementReviewField>,
    );
    expect($('dt', container).textContent).to.equal(title);
    expect($('dd', container).textContent).to.equal('Bar');
    expect(
      $$('dd.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.equal(0);
  });

  it('should render AreaOfDisagreementReviewField with hidden Datadog class', () => {
    const title = 'Something else:';
    const { container } = render(
      <AreaOfDisagreementReviewField>
        {React.createElement(
          'div',
          {
            id: 'foo',
            name: 'otherEntry',
            formData: {},
          },
          'Bar',
        )}
      </AreaOfDisagreementReviewField>,
    );
    expect($('dt', container).textContent).to.equal(title);
    expect(
      $('dd.dd-privacy-hidden[data-dd-action-name]', container).textContent,
    ).to.equal('Bar');
  });
});
