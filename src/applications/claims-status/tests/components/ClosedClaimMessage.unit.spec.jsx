import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { format, formatISO, subDays } from 'date-fns';

import ClosedClaimMessage from '../../components/ClosedClaimMessage';
import { DATE_FORMATS } from '../../constants';

// HELPERS
const formatString = DATE_FORMATS.LONG_DATE;
const getISOString = date => formatISO(date, { representation: 'date' });

describe('<ClosedClaimMessage>', () => {
  context('Appeals', () => {
    it('should render closed appeals within 60 days', () => {
      const closeDate = subDays(new Date(), 59);

      const claims = [
        {
          id: 1,
          type: 'appeal',
          attributes: {
            active: false,
            events: [
              {
                type: 'claim_decision',
                date: '2020-01-01',
              },
              {
                type: 'bva_decision',
                date: getISOString(closeDate),
              },
            ],
          },
        },
      ];

      const screen = render(<ClosedClaimMessage claims={claims} />);

      // Check that the component was rendered
      expect(screen.getByText('Recently closed:')).to.exist;

      // Check that the dates match up with what we would expect
      expect(
        screen.getByText('Your Compensation Appeal Received January 1, 2020'),
      ).to.exist;

      const closeDateText = format(closeDate, formatString);
      expect(screen.getByText(`has been closed as of ${closeDateText}`)).to
        .exist;
    });

    it('should not render closed claims at 60 days', () => {
      const closeDate = subDays(new Date(), 60);
      const claims = [
        {
          id: 2,
          type: 'appeal',
          attributes: {
            active: false,
            events: [
              {
                type: 'claim_decision',
                date: '2021-05-10',
              },
              {
                type: 'bva_decision',
                date: getISOString(closeDate),
              },
            ],
          },
        },
      ];

      const screen = render(<ClosedClaimMessage claims={claims} />);

      // Check that the component was rendered
      expect(screen.queryByText('Recently closed:')).to.not.exist;
    });
  });

  context('Benefits claims', () => {
    it('should render closed claims within 30 days', () => {
      const closeDate = subDays(new Date(), 29);
      const claims = [
        {
          id: 1,
          type: 'claim',
          attributes: {
            claimDate: '2023-01-01',
            closeDate: getISOString(closeDate),
            status: 'COMPLETE',
          },
        },
      ];

      const screen = render(<ClosedClaimMessage claims={claims} />);

      // Check that the component rendered
      expect(screen.getByText('Recently closed:')).to.exist;

      // Check that the dates match up with what we would expect
      expect(
        screen.getByText(
          'Your disability compensation Received January 1, 2023',
        ),
      ).to.exist;

      const closeDateText = format(closeDate, formatString);
      expect(screen.getByText(`has been closed as of ${closeDateText}`)).to
        .exist;
    });

    it('should not render closed claims at 30 days', () => {
      const closeDate = subDays(new Date(), 30);
      const claims = [
        {
          id: 1,
          type: 'claim',
          attributes: {
            claimDate: '2023-01-01',
            closeDate: getISOString(closeDate),
            status: 'COMPLETE',
          },
        },
      ];

      const screen = render(<ClosedClaimMessage claims={claims} />);
      expect(screen.queryByText('Recently closed:')).to.not.exist;
    });

    it('should render nothing when no closed claims', () => {
      const claims = [
        {
          id: 1,
          type: 'claim',
          attributes: {
            claimDate: '2023-01-01',
            closeDate: null,
            status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          },
        },
      ];

      const screen = render(<ClosedClaimMessage claims={claims} />);
      expect(screen.queryByText('Recently closed:')).to.not.exist;
    });
  });
});
