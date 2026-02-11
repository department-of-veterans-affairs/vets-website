import React from 'react';
import { expect } from 'chai';
import { format } from 'date-fns';
import { daysAgo } from '@@profile/tests/helpers';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import Appeal from '../../../components/claims-and-appeals/Appeal';
import { APPEAL_TYPES, EVENT_TYPES } from '../../../utils/appeals-helpers';
import { replaceDashesWithSlashes } from '../../../utils/date-formatting/helpers';

function makeAppealObject({
  updateDate,
  type = APPEAL_TYPES.legacy,
  programArea = 'compensation',
  description = 'Benefits as a result of VA error (Section 1151)',
  issueCount = 1,
  includeRequestEvent = true,
}) {
  const events = [];

  // Add the request event matching the appeal type
  if (includeRequestEvent) {
    let requestEventType;
    switch (type) {
      case APPEAL_TYPES.legacy:
        requestEventType = EVENT_TYPES.nod;
        break;
      case APPEAL_TYPES.supplementalClaim:
        requestEventType = EVENT_TYPES.scRequest;
        break;
      case APPEAL_TYPES.higherLevelReview:
        requestEventType = EVENT_TYPES.hlrRequest;
        break;
      case APPEAL_TYPES.appeal:
        requestEventType = EVENT_TYPES.amaNod;
        break;
      default:
        requestEventType = EVENT_TYPES.nod;
    }
    events.push({ type: requestEventType, date: '2012-02-03' });
  }

  // Add an update event as the last event
  events.push({ type: 'hearing_held', date: updateDate });

  const issues = [];
  for (let i = 0; i < issueCount; i += 1) {
    issues.push({
      description,
      diagnosticCode: null,
      active: true,
      lastAction: null,
      date: null,
    });
  }

  return {
    id: '2765759',
    type,
    attributes: {
      appealIds: ['2765759'],
      updated: '2021-03-04T19:55:21-05:00',
      incompleteHistory: false,
      type: 'original',
      active: true,
      description,
      aod: false,
      location: 'bva',
      aoj: 'vba',
      programArea,
      status: { type: 'on_docket', details: {} },
      alerts: [],
      docket: null,
      issues,
      events,
      evidence: [],
    },
  };
}

// Helper to get normalized text content from an element
const getHeadingText = container => {
  const h3 = container.querySelector('h3');
  return h3 ? h3.textContent.replace(/\s+/g, ' ').trim() : '';
};

describe('Appeal', () => {
  const name = { first: 'Test', middle: 'T', last: 'User' };

  it('renders a legacy appeal with compensation program area', () => {
    const updateDate = daysAgo(1);
    const appeal = makeAppealObject({
      updateDate,
      type: APPEAL_TYPES.legacy,
    });
    const formattedDate = format(
      new Date(replaceDashesWithSlashes(updateDate)),
      'MMMM d, yyyy',
    );

    const { container } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    const heading = getHeadingText(container);
    expect(heading).to.include('Disability compensation appeal updated:');
    expect(heading).to.include(formattedDate);
  });

  it('renders a supplemental claim title with program area', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(2),
      type: APPEAL_TYPES.supplementalClaim,
    });

    const { container } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    const heading = getHeadingText(container);
    expect(heading).to.include(
      'Supplemental claim for disability compensation updated:',
    );
  });

  it('renders a higher-level review title with program area', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(2),
      type: APPEAL_TYPES.higherLevelReview,
    });

    const { container } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    const heading = getHeadingText(container);
    expect(heading).to.include(
      'Higher-level review for disability compensation updated:',
    );
  });

  it('renders an AMA appeal title with program area', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(2),
      type: APPEAL_TYPES.appeal,
    });

    const { container } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    const heading = getHeadingText(container);
    expect(heading).to.include('Disability compensation appeal updated:');
  });

  it('renders appeal title without program area when programArea is not mapped', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(2),
      type: APPEAL_TYPES.legacy,
      programArea: 'unknown_area',
    });

    const { container } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    const heading = getHeadingText(container);
    expect(heading).to.include('Appeal updated:');
    expect(heading).to.not.include('compensation');
  });

  it('renders non-appeal title without program area when programArea is not mapped', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(2),
      type: APPEAL_TYPES.supplementalClaim,
      programArea: 'unknown_area',
    });

    const { container } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    const heading = getHeadingText(container);
    expect(heading).to.include('Supplemental claim updated:');
    expect(heading).to.not.include('compensation');
  });

  it('renders the status', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(1),
    });

    const { getByText } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    expect(getByText(/Status:/)).to.exist;
  });

  it('renders single issue description with "Issue on appeal"', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(1),
      issueCount: 1,
    });

    const { getByText } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    expect(getByText(/Issue on appeal:/)).to.exist;
  });

  it('renders multiple issues description with "Issues on appeal"', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(1),
      issueCount: 2,
    });

    const { getByText } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    expect(getByText(/Issues on appeal:/)).to.exist;
  });

  it('renders "Issues on review" for non-appeal types with multiple issues', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(1),
      type: APPEAL_TYPES.supplementalClaim,
      issueCount: 2,
    });

    const { getByText } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    expect(getByText(/Issues on review:/)).to.exist;
  });

  it('renders "Issue on review" for non-appeal types with one issue', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(1),
      type: APPEAL_TYPES.higherLevelReview,
      issueCount: 1,
    });

    const { getByText } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    expect(getByText(/Issue on review:/)).to.exist;
  });

  it('renders the submitted date from the request event', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(1),
    });

    const { getByText } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    expect(getByText(/Submitted on: February 3, 2012/)).to.exist;
  });

  it('does not render submitted date when no matching request event exists', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(1),
      includeRequestEvent: false,
    });

    const { queryByText } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    expect(queryByText(/Submitted on:/)).to.not.exist;
  });

  it('renders the Review details link with correct href', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(1),
    });

    const { container } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    const link = container.querySelector('va-link[text="Review details"]');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      '/track-claims/appeals/2765759/status',
    );
  });

  it('renders the Review details link label with appeal title', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(1),
    });

    const { container } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    const link = container.querySelector('va-link[text="Review details"]');
    expect(link.getAttribute('label')).to.include(
      'Disability compensation appeal',
    );
  });

  it('throws when appeal has no attributes', () => {
    const badAppeal = { id: '123', type: 'legacyAppeal' };
    expect(() => {
      renderWithStoreAndRouter(<Appeal appeal={badAppeal} name={name} />, {
        initialState: {},
      });
    }).to.throw();
  });

  it('does not render description when appeal.attributes.description is falsy', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(1),
      description: '',
    });
    appeal.attributes.description = '';

    const { queryByText } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    expect(queryByText(/Issue on appeal:/)).to.not.exist;
    expect(queryByText(/Issues on review:/)).to.not.exist;
  });

  it('renders with pension program area', () => {
    const appeal = makeAppealObject({
      updateDate: daysAgo(1),
      type: APPEAL_TYPES.legacy,
      programArea: 'pension',
    });

    const { container } = renderWithStoreAndRouter(
      <Appeal appeal={appeal} name={name} />,
      { initialState: {} },
    );

    const heading = getHeadingText(container);
    expect(heading).to.include('Pension appeal updated:');
  });
});
