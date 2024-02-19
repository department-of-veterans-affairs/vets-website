import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import RecentActivity from '../../components/RecentActivity';

describe('<RecentActivity>', () => {
  context('when claim doesnt have trackedItems', () => {
    const claim = {
      attributes: {
        open: false,
        trackedItems: [],
      },
    };
    it('should render empty recent activities section', () => {
      const { container, getByText } = render(<RecentActivity claim={claim} />);
      getByText('Recent activity');
      expect($('ol', container)).not.to.exist;
      expect($('va-pagination', container)).not.to.exist;
    });
  });

  context('when claim has trackedItems', () => {
    it('should render list with NEEDED_FROM_YOU list item with no pagination', () => {
      const claim = {
        attributes: {
          open: true,
          trackedItems: [
            {
              id: 1,
              requestedDate: '2023-02-01',
              status: 'NEEDED_FROM_YOU',
              displayName: 'Needed from you Request',
            },
          ],
        },
      };
      const { container, getByText } = render(<RecentActivity claim={claim} />);
      getByText('Recent activity');
      getByText('We opened a request for "Needed from you Request"');
      expect($('ol', container)).to.exist;
      expect($('va-pagination', container)).not.to.exist;
    });

    it('should render list with NEEDED_FROM_OTHERS list item, an alert and no pagination', () => {
      const claim = {
        attributes: {
          open: true,
          trackedItems: [
            {
              id: 1,
              requestedDate: '2023-01-01',
              status: 'NEEDED_FROM_OTHERS',
              displayName: 'Needed from others Request',
            },
          ],
        },
      };
      const { container, getByText } = render(<RecentActivity claim={claim} />);
      getByText('Recent activity');
      getByText('We opened a request for "Needed from others Request"');
      expect($('ol', container)).to.exist;
      expect($('va-alert', container)).to.exist;
      expect($('va-pagination', container)).not.to.exist;
    });

    it('should render list with NO_LONGER_REQUIRED list item with no pagination', () => {
      const claim = {
        attributes: {
          open: true,
          trackedItems: [
            {
              id: 1,
              closedDate: '2023-01-11',
              status: 'NO_LONGER_REQUIRED',
              displayName: 'No longer required Request',
            },
          ],
        },
      };
      const { container, getByText } = render(<RecentActivity claim={claim} />);
      getByText('Recent activity');
      getByText('We closed a request for "No longer required Request"');
      expect($('ol', container)).to.exist;
      expect($('va-pagination', container)).not.to.exist;
    });

    it('should render list with SUBMITTED_AWAITING_REVIEW list item with no pagination', () => {
      const claim = {
        attributes: {
          open: true,
          trackedItems: [
            {
              id: 1,
              status: 'SUBMITTED_AWAITING_REVIEW',
              displayName: 'Submitted awaiting Request',
              documents: [
                {
                  uploadDate: '2023-07-01',
                },
              ],
            },
          ],
        },
      };
      const { container, getByText } = render(<RecentActivity claim={claim} />);
      getByText('Recent activity');
      getByText(
        'We received your document(s) for "Submitted awaiting Request"',
      );
      expect($('ol', container)).to.exist;
      expect($('va-pagination', container)).not.to.exist;
    });

    it('should render list with INITIAL_REVIEW_COMPLETE list item with no pagination', () => {
      const claim = {
        attributes: {
          open: true,
          trackedItems: [
            {
              id: 1,
              receivedDate: '2023-02-12',
              status: 'INITIAL_REVIEW_COMPLETE',
              displayName: 'Initial review complete Request',
            },
          ],
        },
      };
      const { container, getByText } = render(<RecentActivity claim={claim} />);
      getByText('Recent activity');
      getByText('We completed a review for "Initial review complete Request"');
      expect($('ol', container)).to.exist;
      expect($('va-pagination', container)).not.to.exist;
    });

    it('should render list with ACCEPTED list item with no pagination', () => {
      const claim = {
        attributes: {
          open: true,
          trackedItems: [
            {
              id: 1,
              requestedDate: '2022-12-01',
              status: 'ACCEPTED',
              displayName: 'Accepted Request',
            },
          ],
        },
      };
      const { container, getByText } = render(<RecentActivity claim={claim} />);
      getByText('Recent activity');
      getByText('We completed a review for "Accepted Request"');
      expect($('ol', container)).to.exist;
      expect($('va-pagination', container)).not.to.exist;
    });

    it('should render list with pagination', () => {
      const claim = {
        attributes: {
          open: true,
          trackedItems: [
            {
              id: 1,
              requestedDate: '2023-02-01',
              status: 'NEEDED_FROM_YOU',
              displayName: 'Needed from you Request',
            },
            {
              id: 2,
              requestedDate: '2023-02-01',
              status: 'NEEDED_FROM_YOU',
              displayName: 'Needed from you Request 2',
            },
            {
              id: 3,
              requestedDate: '2023-01-01',
              status: 'NEEDED_FROM_OTHERS',
              displayName: 'Needed from others Request',
            },
            {
              id: 4,
              requestedDate: '2023-06-01',
              status: 'NEEDED_FROM_OTHERS',
              displayName: 'Needed from others Request 2',
            },
            {
              id: 5,
              closedDate: '2023-01-11',
              status: 'NO_LONGER_REQUIRED',
              displayName: 'No longer required Request',
            },
            {
              id: 6,
              status: 'SUBMITTED_AWAITING_REVIEW',
              displayName: 'Submitted awaiting Request',
              documents: [
                {
                  uploadDate: '2023-07-01',
                },
              ],
            },
            {
              id: 7,
              requestedDate: '2023-02-14',
              status: 'NEEDED_FROM_YOU',
              displayName: 'Needed from you Request 3',
            },
            {
              id: 8,
              receivedDate: '2023-02-12',
              status: 'INITIAL_REVIEW_COMPLETE',
              displayName: 'Initial review complete Request',
            },
            {
              id: 9,
              receivedDate: '2023-08-01',
              status: 'INITIAL_REVIEW_COMPLETE',
              displayName: 'Initial review complete Request',
            },
            {
              id: 10,
              requestedDate: '2022-12-01',
              status: 'ACCEPTED',
              displayName: 'Accepted Request',
            },
            {
              id: 11,
              requestedDate: '2023-03-01',
              status: 'ACCEPTED',
              displayName: 'Accepted Request',
            },
          ],
        },
      };
      const { container, getByText } = render(<RecentActivity claim={claim} />);
      getByText('Recent activity');
      expect($('ol', container)).to.exist;
      expect($('va-pagination', container)).to.exist;
    });
  });
});
