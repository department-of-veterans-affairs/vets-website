import React from 'react';
import { render } from '@testing-library/react';
import { daysAgo } from '@@profile/tests/helpers';
import { expect } from 'chai';
import moment from 'moment';

import Appeal from '../../../components/claims-and-appeals/Appeal';
import { APPEAL_TYPES } from '../../../utils/appeals-v2-helpers';

function makeAppealObject({
  updateDate,
  type = APPEAL_TYPES.legacy,
  closed = false,
}) {
  return {
    id: '2765759',
    type,
    attributes: {
      appealIds: ['2765759'],
      updated: '2021-03-04T19:55:21-05:00',
      incompleteHistory: false,
      type: 'original',
      active: !closed,
      description: 'Benefits as a result of VA error (Section 1151)',
      aod: false,
      location: 'bva',
      aoj: 'vba',
      programArea: 'compensation',
      status: { type: 'on_docket', details: {} },
      alerts: [],
      docket: {
        front: false,
        total: 140135,
        ahead: 101381,
        ready: 16432,
        month: '2012-04-01',
        docketMonth: '2011-01-01',
        eta: null,
      },
      issues: [
        {
          description: 'Benefits as a result of VA error (Section 1151)',
          diagnosticCode: null,
          active: true,
          lastAction: null,
          date: null,
        },
      ],
      events: [
        { type: 'nod', date: '2012-02-02' },
        { type: 'soc', date: '2012-03-03' },
        { type: 'form9', date: '2012-04-04' },
        { type: 'hearing_held', date: updateDate },
      ],
      evidence: [],
    },
  };
}

describe('<Appeal />', () => {
  const name = { first: 'Test', middle: 'T', last: 'User' };

  it('should render', () => {
    const appeal = makeAppealObject({ updateDate: daysAgo(1) });
    const updatedDate = moment(daysAgo(1)).format('MMMM D, YYYY');
    const appealTitle = `Disability compensation appeal updated on ${updatedDate}`;

    const tree = render(<Appeal appeal={appeal} name={name} />);

    expect(tree.getByText(appealTitle)).to.exist;
    expect(
      tree.getByText(/Status: Your appeal is waiting to be sent to a judge/),
    ).to.exist;
    expect(tree.getByText(/Issue on appeal: Benefits as a result of VA error/))
      .to.exist;
    expect(tree.getByText(/Submitted on: February 2, 2012/)).to.exist;
    expect(tree.getByText(/Review details/)).to.exist;
  });

  context('title', () => {
    it('should render the correct title for supplement claims', () => {
      const appeal = makeAppealObject({
        updateDate: daysAgo(1),
        type: APPEAL_TYPES.supplementalClaim,
      });
      const tree = render(<Appeal appeal={appeal} name={name} />);

      expect(
        tree.getByText(
          /Supplemental claim for disability compensation updated on/,
        ),
      ).to.exist;
    });

    it('should render the correct title for higher level reviews', () => {
      const appeal = makeAppealObject({
        updateDate: daysAgo(1),
        type: APPEAL_TYPES.higherLevelReview,
      });

      const tree = render(<Appeal appeal={appeal} name={name} />);

      expect(
        tree.getByText(
          /Higher-level review for disability compensation updated on/,
        ),
      ).to.exist;
    });

    it('should render the correct title for the appeal type', () => {
      const appeal = makeAppealObject({
        updateDate: daysAgo(1),
        type: APPEAL_TYPES.appeal,
      });

      const tree = render(<Appeal appeal={appeal} name={name} />);

      expect(tree.getByText(/Disability compensation appeal updated on/)).to
        .exist;
    });
  });

  context('description with multiple issues', () => {
    it('should render the right description when it is an appeal', () => {
      const appeal = makeAppealObject({ updateDate: daysAgo(1) });
      appeal.attributes.issues.push(appeal.attributes.issues.first);
      const tree = render(<Appeal appeal={appeal} name={name} />);

      expect(
        tree.getByText(/Issues on appeal: Benefits as a result of VA error/),
      ).to.exist;
    });

    it('should render the right description when it is not an appeal', () => {
      const appeal = makeAppealObject({
        updateDate: daysAgo(1),
        type: APPEAL_TYPES.supplementalClaim,
      });
      appeal.attributes.issues.push(appeal.attributes.issues.first);
      const tree = render(<Appeal appeal={appeal} name={name} />);

      expect(
        tree.getByText(/Issues on review: Benefits as a result of VA error/),
      ).to.exist;
    });
  });
});
