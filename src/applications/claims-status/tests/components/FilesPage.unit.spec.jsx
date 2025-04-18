import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { waitFor } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { FilesPage } from '../../containers/FilesPage';
import * as AdditionalEvidencePage from '../../components/claim-files-tab/AdditionalEvidencePage';
import { renderWithRouter, rerenderWithRouter } from '../utils';
import * as helpers from '../../utils/helpers';

const getStore = (cst5103UpdateEnabled = false) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_5103_update_enabled: cst5103UpdateEnabled,
    },
  }));

const props = {
  claim: {},
  clearNotification: () => {},
  lastPage: '/overview',
  loading: false,
  location: { hash: '' },
  message: {},
};

describe('<FilesPage>', () => {
  let stub;
  let setPageFocusSpy;
  beforeEach(() => {
    // Stubbing out AdditionalEvidencePage because we're not interested
    // in setting up all of the redux state needed to test it
    stub = sinon.stub(AdditionalEvidencePage, 'default');
    stub.returns(<div data-testid="additional-evidence-page" />);
    setPageFocusSpy = sinon.spy(helpers, 'setPageFocus');
  });

  afterEach(() => {
    stub.restore();
    setPageFocusSpy.restore();
  });

  it('should render loading state', () => {
    const { container } = renderWithRouter(
      <FilesPage
        {...props}
        loading
        message={{ title: 'Test', body: 'Body' }}
      />,
    );
    expect($('.claim-files', container)).to.not.exist;
    expect($('va-loading-indicator', container)).to.exist;
  });

  it('should render null when claim empty', () => {
    const { container, getByText } = renderWithRouter(
      <FilesPage {...props} message={{ title: 'Test', body: 'Body' }} />,
    );

    expect($('.claim-files', container)).to.not.exist;
    getByText('Claim status is unavailable');
  });

  it('should render null when claim null', () => {
    const { container, getByText } = renderWithRouter(
      <FilesPage
        {...props}
        claim={null}
        message={{ title: 'Test', body: 'Body' }}
      />,
    );

    expect($('.claim-files', container)).to.not.exist;
    getByText('Claim status is unavailable');
  });

  describe('pageFocus', () => {
    const claim = {
      id: '1',
      type: 'claim',
      attributes: {
        claimDate: '2023-01-01',
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2023-02-08',
          latestPhaseType: 'INITIAL_REVIEW',
          previousPhases: {
            phase1CompleteDate: '2023-02-08',
          },
        },
        closeDate: null,
        documentsNeeded: false,
        decisionLetterSent: false,
        status: 'INITIAL_REVIEW',
        supportingDocuments: [],
        trackedItems: [],
      },
    };

    it('should call setPageFocus when location.hash is empty', async () => {
      renderWithRouter(
        <Provider store={getStore()}>
          <FilesPage {...props} claim={claim} location={{ hash: '' }} />
        </Provider>,
      );

      await waitFor(() => {
        expect(setPageFocusSpy.calledOnce).to.be.true;
      });
    });

    it('should not call setPageFocus when location.hash is not empty', async () => {
      renderWithRouter(
        <Provider store={getStore()}>
          <FilesPage {...props} location={{ hash: '#add-files' }} />
        </Provider>,
      );

      await waitFor(() => {
        expect(setPageFocusSpy.calledOnce).to.be.false;
      });
    });

    it('should focus on the Notification Alert when one exists', async () => {
      const message = {
        title: 'Test',
        body: 'Testing',
      };

      const { container } = renderWithRouter(
        <Provider store={getStore()}>
          <FilesPage
            {...props}
            claim={claim}
            message={message}
            location={{ hash: '' }}
          />
        </Provider>,
      );

      const selector = container.querySelector('va-alert');
      expect(selector).to.exist;
      await waitFor(() => {
        expect(document.activeElement).to.equal(selector);
      });
    });
  });

  describe('document.title', () => {
    // Minimum data needed for these test cases.
    const claim = {
      attributes: {
        claimDate: '2024-09-04',
        claimType: 'Compensation',
        claimPhaseDates: {
          previousPhases: {},
        },
        trackedItems: [],
        supportingDocuments: [],
      },
    };
    it('should not update document title at mount-time if claim is not available', () => {
      renderWithRouter(
        <Provider store={getStore()}>
          <FilesPage {...props} />
        </Provider>,
      );
      expect(document.title).to.equal('');
    });
    it('should update document title with claim details at mount-time if claim is already loaded', () => {
      renderWithRouter(
        <Provider store={getStore()}>
          <FilesPage {...props} claim={claim} />
        </Provider>,
      );
      expect(document.title).to.equal(
        'Files for September 4, 2024 Compensation Claim | Veterans Affairs',
      );
    });
    it('should update document title with claim details after mount once the claim has loaded', () => {
      const { rerender } = renderWithRouter(
        <Provider store={getStore()}>
          <FilesPage {...props} loading />
        </Provider>,
      );
      rerenderWithRouter(
        rerender,
        <Provider store={getStore()}>
          <FilesPage {...props} claim={claim} />
        </Provider>,
      );
      expect(document.title).to.equal(
        'Files for September 4, 2024 Compensation Claim | Veterans Affairs',
      );
    });
    it('should update document title with a default message after mount once the claim fails to load', () => {
      const { rerender } = renderWithRouter(
        <Provider store={getStore()}>
          <FilesPage {...props} loading />
        </Provider>,
      );
      rerenderWithRouter(
        rerender,
        <Provider store={getStore()}>
          <FilesPage {...props} claim={null} />
        </Provider>,
      );
      expect(document.title).to.equal(
        'Files for Your Claim | Veterans Affairs',
      );
    });
    it('should not update document title after mount if the loading status has not changed', () => {
      const { rerender } = renderWithRouter(
        <Provider store={getStore()}>
          <FilesPage {...props} loading />
        </Provider>,
      );
      rerenderWithRouter(
        rerender,
        <Provider store={getStore()}>
          <FilesPage
            {...props}
            loading
            message={{ title: 'Test', body: 'Body' }}
          />
        </Provider>,
      );
      expect(document.title).to.equal('');
    });
  });

  describe('alert', () => {
    context('when component unmounts', () => {
      it('should clear alert when component unmounts', () => {
        const claim = {
          id: '1',
          type: 'claim',
          attributes: {
            claimDate: '2023-01-01',
            claimPhaseDates: {
              currentPhaseBack: false,
              phaseChangeDate: '2023-02-08',
              latestPhaseType: 'INITIAL_REVIEW',
              previousPhases: {
                phase1CompleteDate: '2023-02-08',
              },
            },
            closeDate: null,
            documentsNeeded: false,
            decisionLetterSent: false,
            status: 'INITIAL_REVIEW',
            supportingDocuments: [],
            trackedItems: [],
          },
        };
        const message = {
          title: 'Test',
          body: 'Test',
        };
        const clearNotification = sinon.spy();
        const { unmount } = renderWithRouter(
          <Provider store={getStore()}>
            <FilesPage
              {...props}
              clearNotification={clearNotification}
              message={message}
              claim={claim}
            />
          </Provider>,
        );
        unmount();
        expect(clearNotification.called).to.be.true;
      });
    });
  });

  context('when claim is open', () => {
    it('should render files page, showing additional evidence section without alerts, and docs filed section', () => {
      const claim = {
        id: '1',
        type: 'claim',
        attributes: {
          claimDate: '2023-01-01',
          claimPhaseDates: {
            currentPhaseBack: false,
            phaseChangeDate: '2023-02-08',
            latestPhaseType: 'INITIAL_REVIEW',
            previousPhases: {
              phase1CompleteDate: '2023-02-08',
            },
          },
          closeDate: null,
          documentsNeeded: false,
          decisionLetterSent: false,
          status: 'INITIAL_REVIEW',
          supportingDocuments: [],
          trackedItems: [],
        },
      };

      const { container, getByTestId } = renderWithRouter(
        <Provider store={getStore()}>
          <FilesPage
            {...props}
            claim={claim}
            message={{ title: 'Test', body: 'Body' }}
            clearNotification={() => {}}
          />
        </Provider>,
      );
      const filesPage = $('#tabPanelFiles', container);

      expect(filesPage).to.exist;
      expect($('.claim-file-header-container', container)).to.exist;
      expect(getByTestId('additional-evidence-page')).to.exist;
      expect($('.documents-filed-container', container)).to.exist;
      expect($('.claims-requested-files-container', container)).not.to.exist;
    });

    it('should render files page, showing additional evidence section with alerts, and docs filed section when using lighthouse', () => {
      const claim = {
        id: '1',
        type: 'claim',
        attributes: {
          claimDate: '2023-01-01',
          claimPhaseDates: {
            currentPhaseBack: false,
            phaseChangeDate: '2023-02-08',
            latestPhaseType: 'INITIAL_REVIEW',
            previousPhases: {
              phase1CompleteDate: '2023-02-08',
            },
          },
          closeDate: null,
          documentsNeeded: true,
          decisionLetterSent: false,
          status: 'INITIAL_REVIEW',
          supportingDocuments: [],
          trackedItems: [
            {
              id: 1,
              status: 'NEEDED_FROM_YOU',
              displayName: 'Test',
              description: 'Test',
              suspenseDate: '2024-02-01',
              date: '2023-01-01',
            },
          ],
        },
      };
      const { container, getByTestId } = renderWithRouter(
        <Provider store={getStore()}>
          <FilesPage
            {...props}
            claim={claim}
            message={{ title: 'Test', body: 'Body' }}
            clearNotification={() => {}}
          />
        </Provider>,
      );
      const filesPage = $('#tabPanelFiles', container);

      expect(filesPage).to.exist;
      expect($('.claim-file-header-container', container)).to.exist;
      expect(getByTestId('additional-evidence-page')).to.exist;
      expect($('.documents-filed-container', container)).to.exist;
      expect($('.claims-requested-files-container', container)).to.not.exist;
    });

    context('when cst5103UpdateEnabled feature flag is disabled', () => {
      it('should render ask va to decide component', () => {
        const claim = {
          id: 1,
          type: 'claim',
          attributes: {
            claimPhaseDates: {
              currentPhaseBack: false,
              phaseChangeDate: '2023-03-04',
              latestPhaseType: 'GATHERING_OF_EVIDENCE',
              previousPhases: {
                phase1CompleteDate: '2023-02-08',
                phase2CompleteDate: '2023-03-04',
              },
            },
            documentsNeeded: false,
            decisionLetterSent: false,
            evidenceWaiverSubmitted5103: false,
            status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
            supportingDocuments: [],
            trackedItems: [],
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <FilesPage
              {...props}
              claim={claim}
              message={{ title: 'Test', body: 'Body' }}
              clearNotification={() => {}}
            />
          </Provider>,
        );

        getByText('Ask for your Claim Decision');
      });
    });

    context('when cst5103UpdateEnabled feature flag is enabled', () => {
      it('should not render ask va to decide component', () => {
        const claim = {
          id: 1,
          type: 'claim',
          attributes: {
            claimPhaseDates: {
              currentPhaseBack: false,
              phaseChangeDate: '2023-03-04',
              latestPhaseType: 'GATHERING_OF_EVIDENCE',
              previousPhases: {
                phase1CompleteDate: '2023-02-08',
                phase2CompleteDate: '2023-03-04',
              },
            },
            documentsNeeded: false,
            decisionLetterSent: false,
            evidenceWaiverSubmitted5103: false,
            status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
            supportingDocuments: [],
            trackedItems: [],
          },
        };

        const { queryByText } = renderWithRouter(
          <Provider store={getStore(true)}>
            <FilesPage
              {...props}
              claim={claim}
              message={{ title: 'Test', body: 'Body' }}
              clearNotification={() => {}}
            />
          </Provider>,
        );

        expect(queryByText('Ask for your Claim Decision')).to.not.exist;
      });
    });
  });

  context('when claim is closed', () => {
    it('should render files page, showing additional evidence section, and docs filed section', () => {
      const claim = {
        id: '1',
        type: 'claim',
        attributes: {
          claimDate: '2023-01-01',
          claimPhaseDates: {
            currentPhaseBack: false,
            phaseChangeDate: '2023-01-31',
            latestPhaseType: 'COMPLETE',
            previousPhases: {
              phase7CompleteDate: '2023-02-08',
            },
          },
          closeDate: '2023-01-31',
          documentsNeeded: false,
          decisionLetterSent: false,
          status: 'COMPLETE',
          supportingDocuments: [],
          trackedItems: [],
        },
      };

      const { container, getByTestId } = renderWithRouter(
        <Provider store={getStore()}>
          <FilesPage
            {...props}
            claim={claim}
            message={{ title: 'Test', body: 'Body' }}
            clearNotification={() => {}}
          />
        </Provider>,
      );
      const filesPage = $('#tabPanelFiles', container);

      expect(filesPage).to.exist;
      expect($('.claim-file-header-container', container)).to.exist;
      expect(getByTestId('additional-evidence-page')).to.exist;
      expect($('.documents-filed-container', container)).to.exist;
      expect($('.claims-requested-files-container', container)).not.to.exist;
    });
  });
});
