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
  const defaultEditButton = ({ label }) => (
    <va-button text="edit" label={label} />
  );
  const setup = (
    issue,
    decisionDate,
    serviceConnection = false,
    effectiveDate = false,
    evaluation = false,
    otherEntry = false,
  ) => {
    const formData = {
      issue,
      decisionDate,
      disagreementOptions: { serviceConnection, effectiveDate, evaluation },
      otherEntry,
    };
    return render(
      <div>
        <AreaOfDisagreementReviewField
          formData={formData}
          defaultEditButton={defaultEditButton}
        />
      </div>,
    );
  };

  it('should not render AreaOfDisagreementReviewField when issue name is missing', () => {
    const { container } = setup('', '2020-01-01', true);

    expect($('h4', container)).to.not.exist;
    expect(container.innerHTML).to.eq('<div></div>');
  });
  it('should render AreaOfDisagreementReviewField with service connection only', () => {
    const { container } = setup('Headaches', '2020-01-01', true);

    expect($('h4', container).textContent).to.equal(
      'Disagreement with Headaches decision on January 1, 2020',
    );

    expect($('dt', container).textContent).to.equal('What you disagree with');
    expect($('dd', container).textContent).to.equal('the service connection');
  });

  it('should render AreaOfDisagreementReviewField with everything selected & hidden Datadog class', () => {
    const { container } = setup(
      'Tinnitus',
      '2023-03-03',
      true,
      true,
      true,
      'Lorem ipsum lorem ipsum lorem ipsu',
    );

    expect($('h4', container).textContent).to.equal(
      'Disagreement with Tinnitus decision on March 3, 2023',
    );

    expect($('dt', container).textContent).to.equal('What you disagree with');
    expect($('dd', container).textContent).to.equal(
      'the service connection, the effective date of award, your evaluation of my condition, and Lorem ipsum lorem ipsum lorem ipsu',
    );
    expect(
      $$('dd.dd-privacy-hidden[data-dd-action-name]', container).length,
    ).to.equal(1);
  });
});
