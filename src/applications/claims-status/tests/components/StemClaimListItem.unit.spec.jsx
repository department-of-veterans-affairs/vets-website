import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import * as recordEventModule from '~/platform/monitoring/record-event';
import { renderWithRouter } from '../utils';
import StemClaimListItem from '../../components/StemClaimListItem';

const getStore = (cstShowDocumentUploadStatus = false) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_show_document_upload_status: cstShowDocumentUploadStatus,
    },
  }));

const createFailedSubmission = (acknowledgementDate, failedDate) => ({
  acknowledgementDate,
  id: 1,
  claimId: 1,
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  deleteDate: null,
  documentType: 'STEM Scholarship Supporting Documents',
  failedDate,
  fileName: 'stem-documents.pdf',
  lighthouseUpload: true,
  trackedItemId: null,
  trackedItemDisplayName: null,
  uploadStatus: 'FAILED',
  vaNotifyStatus: 'SENT',
});

describe('<StemClaimListItem>', () => {
  const defaultClaim = {
    id: 1,
    attributes: {
      automatedDenial: true,
      deniedAt: '2021-03-02',
      submittedAt: '2021-03-01',
    },
  };

  it('should render a denied STEM claim', () => {
    const { getByText } = renderWithRouter(
      <Provider store={getStore()}>
        <StemClaimListItem claim={defaultClaim} />
      </Provider>,
    );
    getByText('Edith Nourse Rogers STEM Scholarship application');
    getByText('Received on March 1, 2021');
    getByText('Status: Denied');
    getByText('Last updated on: March 2, 2021');
  });

  it('when click claimCardLink, should call record event', () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');
    const { container } = renderWithRouter(
      <Provider store={getStore()}>
        <StemClaimListItem claim={defaultClaim} />
      </Provider>,
    );
    const claimCardLink = container.querySelector('va-link[text="Details"]');
    expect(claimCardLink).to.exist;
    fireEvent.click(claimCardLink);

    expect(
      recordEventStub.calledWith({
        event: 'cta-action-link-click',
        'action-link-type': 'secondary',
        'action-link-click-label': 'Details',
        'action-link-icon-color': 'blue',
        'claim-type': 'STEM Scholarship',
        'claim-last-updated-date': 'March 2, 2021',
        'claim-submitted-date': 'March 1, 2021',
        'claim-status': 'Denied',
      }),
    ).to.be.true;
    recordEventStub.restore();
  });

  it('should not render a non-denied STEM claim', () => {
    const claim = {
      ...defaultClaim,
      attributes: {
        automatedDenial: false,
      },
    };

    const { queryByText } = renderWithRouter(
      <Provider store={getStore()}>
        <StemClaimListItem claim={claim} />
      </Provider>,
    );
    expect(queryByText('Edith Nourse Rogers STEM Scholarship application')).to
      .not.exist;
    expect(queryByText('Received on March 1, 2021')).to.not.exist;
  });

  context(
    'when the cst_show_document_upload_status feature toggle is disabled',
    () => {
      it('should not render a slim alert', () => {
        const claim = {
          ...defaultClaim,
          attributes: {
            ...defaultClaim.attributes,
            evidenceSubmissions: [
              createFailedSubmission(
                new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
                new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              ),
            ],
          },
        };

        const { container } = renderWithRouter(
          <Provider store={getStore()}>
            <StemClaimListItem claim={claim} />
          </Provider>,
        );
        const alert = container.querySelector('va-alert[status="error"]');

        expect(alert).to.not.exist;
      });
    },
  );

  context(
    'when the cst_show_document_upload_status feature toggle is enabled',
    () => {
      context(
        'when there are no failed evidence submissions within the last 30 days',
        () => {
          it('should not render a slim alert', () => {
            const claim = {
              ...defaultClaim,
              attributes: {
                ...defaultClaim.attributes,
                evidenceSubmissions: [
                  createFailedSubmission(
                    new Date(
                      Date.now() - 1 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                    new Date(
                      Date.now() + 31 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                  ),
                ],
              },
            };

            const { container } = renderWithRouter(
              <Provider store={getStore(true)}>
                <StemClaimListItem claim={claim} />
              </Provider>,
            );
            const alert = container.querySelector('va-alert[status="error"]');

            expect(alert).to.not.exist;
          });
        },
      );

      context(
        'when there are failed evidence submissions within the last 30 days',
        () => {
          it('should render a slim alert', () => {
            const claim = {
              ...defaultClaim,
              attributes: {
                ...defaultClaim.attributes,
                evidenceSubmissions: [
                  createFailedSubmission(
                    new Date(
                      Date.now() + 28 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                    new Date(
                      Date.now() - 2 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                  ),
                ],
              },
            };

            const { container } = renderWithRouter(
              <Provider store={getStore(true)}>
                <StemClaimListItem claim={claim} />
              </Provider>,
            );
            const alert = container.querySelector('va-alert[status="error"]');

            expect(alert).to.exist;
            expect(alert.querySelector('p')).to.have.text(
              'We need you to resubmit files for this claim.',
            );
          });
        },
      );
    },
  );
});
