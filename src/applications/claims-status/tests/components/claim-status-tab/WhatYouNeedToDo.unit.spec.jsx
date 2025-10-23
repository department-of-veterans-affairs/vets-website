import React from 'react';
import { expect } from 'chai';
import { renderWithReduxAndRouter } from '../../utils';
import WhatYouNeedToDo from '../../../components/claim-status-tab/WhatYouNeedToDo';

const nothingNeededText =
  'There’s nothing we need from you right now. We’ll let you know when there’s an update.';
// cst_show_document_upload_status false for old behavior
const defaultReduxState = {
  initialState: {
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_show_document_upload_status: false,
    },
  },
};
const enabledReduxState = {
  initialState: {
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_show_document_upload_status: true,
    },
  },
};
const createClaimAttributes = (overrides = {}) => ({
  status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
  closeDate: null,
  evidenceWaiverSubmitted5103: false,
  claimPhaseDates: {
    latestPhaseType: 'GATHERING_OF_EVIDENCE',
    previousPhases: {
      phase1CompleteDate: '2024-01-17',
      phase2CompleteDate: '2024-01-18',
    },
  },
  trackedItems: [],
  evidenceSubmissions: [],
  ...overrides,
});
const createClaim = (attributeOverrides = {}, claimOverrides = {}) => ({
  id: 1,
  attributes: createClaimAttributes(attributeOverrides),
  ...claimOverrides,
});

describe('<WhatYouNeedToDo>', () => {
  it('shows va-alert when there is a tracked item', () => {
    const claim = createClaim({
      trackedItems: [
        {
          id: 123,
          status: 'NEEDED_FROM_YOU',
        },
      ],
    });

    const { container, queryByText } = renderWithReduxAndRouter(
      <WhatYouNeedToDo claim={claim} />,
      defaultReduxState,
    );

    expect(queryByText(nothingNeededText)).not.to.exist;
    expect(container.querySelector('va-alert')).to.exist;
  });

  it("shouldn't indicate that nothing is needed when files are needed", () => {
    const claim = createClaim({
      trackedItems: [
        {
          id: 123,
          status: 'NEEDED_FROM_YOU',
        },
      ],
    });

    const { container, queryByText } = renderWithReduxAndRouter(
      <WhatYouNeedToDo claim={claim} />,
      defaultReduxState,
    );

    expect(queryByText(nothingNeededText)).not.to.exist;
    expect(container.querySelector('va-alert')).to.exist;
  });

  context(
    'when claim has a tracked item with an automated 5103 and a standard 5103',
    () => {
      it('shows va-alert for automated 5103 notice when files are needed', () => {
        const claim = createClaim({
          trackedItems: [
            {
              description: 'Automated 5103 Notice Response',
              displayName: 'Automated 5103 Notice Response',
              id: 467558,
              overdue: true,
              requestedDate: '2024-01-19',
              status: 'NEEDED_FROM_YOU',
              suspenseDate: '2024-03-07',
              uploadsAllowed: true,
            },
          ],
        });

        const {
          container,
          queryByText,
          getByTestId,
          getByText,
        } = renderWithReduxAndRouter(
          <WhatYouNeedToDo claim={claim} />,
          defaultReduxState,
        );

        expect(queryByText(nothingNeededText)).not.to.exist;
        expect(container.querySelector('va-alert')).to.exist;
        expect(getByTestId(`item-${claim.attributes.trackedItems[0].id}`)).to
          .exist;
        getByText('Review evidence list (5103 notice)');
      });
    },
  );

  describe('UploadType2ErrorAlert', () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const fiveDaysAgo = new Date(
      Date.now() - 5 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const tenDaysAgo = new Date(
      Date.now() - 10 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const createEvidenceSubmission = (overrides = {}) => ({
      id: 1,
      fileName: 'failed-document.pdf',
      documentType: 'L023',
      uploadStatus: 'FAILED',
      acknowledgementDate: tomorrow,
      ...overrides,
    });

    context(
      "when the 'cst_show_document_upload_status' feature toggle is disabled",
      () => {
        it('should NOT render the alert', () => {
          const claim = createClaim({
            evidenceWaiverSubmitted5103: true,
            evidenceSubmissions: [createEvidenceSubmission()],
          });
          const {
            container,
            getByText,
            queryByText,
          } = renderWithReduxAndRouter(
            <WhatYouNeedToDo claim={claim} />,
            defaultReduxState,
          );

          expect(container.querySelector('va-alert[status="error"]')).not.to
            .exist;
          expect(
            queryByText('We need you to submit files by mail or in person'),
          ).not.to.exist;
          // Should show "nothing needed" message (since no tracked items)
          getByText(nothingNeededText);
        });

        it('should render no-documents description when there are no tracked items or standard 5103', () => {
          const claim = createClaim({
            evidenceWaiverSubmitted5103: true,
          });
          const { container, getByText } = renderWithReduxAndRouter(
            <WhatYouNeedToDo claim={claim} />,
            defaultReduxState,
          );

          getByText(nothingNeededText);
          expect(container.querySelector('va-alert')).not.to.exist;
        });
      },
    );

    context(
      "when the 'cst_show_document_upload_status' feature toggle is enabled",
      () => {
        it('should render the alert when there are failed submissions within the last 30 days', () => {
          const claim = createClaim({
            evidenceWaiverSubmitted5103: true,
            evidenceSubmissions: [
              createEvidenceSubmission({
                id: 1,
                fileName: 'first-file.pdf',
                failedDate: fiveDaysAgo,
                trackedItemId: 1,
                trackedItemDisplayName: 'Medical records',
              }),
              createEvidenceSubmission({
                id: 2,
                fileName: 'second-file.pdf',
                failedDate: tenDaysAgo,
              }),
            ],
          });
          const {
            container,
            getByText,
            queryByText,
          } = renderWithReduxAndRouter(
            <WhatYouNeedToDo claim={claim} />,
            enabledReduxState,
          );

          expect(container.querySelector('va-alert[status="error"]')).to.exist;
          getByText('We need you to submit files by mail or in person');

          const listItems = container.querySelectorAll('ul li');
          // The failures should be in chronological order (most recent first)
          expect(listItems).to.have.length(2);
          expect(listItems[0].textContent).to.include('first-file.pdf');
          expect(listItems[0].textContent).to.include(
            'Request type: Medical records',
          );
          expect(listItems[1].textContent).to.include('second-file.pdf');
          expect(listItems[1].textContent).to.include(
            'You submitted this file as additional evidence',
          );
          // Should not show "nothing needed" message
          expect(queryByText(nothingNeededText)).not.to.exist;
        });

        it('should not render alert when there are no failed submissions within the last 30 days', () => {
          const claim = createClaim({
            evidenceWaiverSubmitted5103: true,
            evidenceSubmissions: [
              createEvidenceSubmission({
                fileName: 'successful-document.pdf',
                uploadStatus: 'SUCCESS',
              }),
              createEvidenceSubmission({
                id: 2,
                acknowledgementDate: fiveDaysAgo,
              }),
            ],
          });
          const { container, getByText } = renderWithReduxAndRouter(
            <WhatYouNeedToDo claim={claim} />,
            enabledReduxState,
          );
          // Should not show error alert
          expect(container.querySelector('va-alert[status="error"]')).not.to
            .exist;
          // Should show "nothing needed" message
          getByText(nothingNeededText);
        });

        it('should render no-documents description when there are no failed submissions within the last 30 days and no tracked items or standard 5103', () => {
          const claim = createClaim({
            evidenceWaiverSubmitted5103: true,
            evidenceSubmissions: [
              createEvidenceSubmission({ acknowledgementDate: fiveDaysAgo }),
            ],
          });
          const { container, getByText } = renderWithReduxAndRouter(
            <WhatYouNeedToDo claim={claim} />,
            enabledReduxState,
          );

          getByText(nothingNeededText);
          expect(container.querySelector('va-alert')).not.to.exist;
        });
      },
    );
  });
});
