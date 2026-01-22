import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { FilesPage } from '../../containers/FilesPage';
import * as AdditionalEvidencePage from '../../components/claim-files-tab/AdditionalEvidencePage';
import { renderWithRouter, rerenderWithRouter } from '../utils';
import * as helpers from '../../utils/helpers';

const FEATURE_FLAG_KEY = 'cst_show_document_upload_status';

const getStore = (featureToggles = {}, notifications = {}, claim = null) =>
  createStore(() => ({
    featureToggles,
    disability: {
      status: {
        claimDetail: {
          detail: claim,
          loading: false,
        },
        uploads: {
          uploading: false,
          progress: 0,
          uploadError: false,
          uploadComplete: false,
        },
        notifications: {
          message: null,
          additionalEvidenceMessage: null,
          type1UnknownErrors: null,
          ...notifications,
        },
      },
    },
  }));

// Base claim object for testing
const baseClaim = {
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
    evidenceSubmissions: [],
  },
};

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
      <Provider store={getStore()}>
        <FilesPage
          {...props}
          loading
          message={{ title: 'Test', body: 'Body' }}
        />
      </Provider>,
    );
    expect(container.querySelector('.claim-files')).to.not.exist;
    expect(container.querySelector('va-loading-indicator')).to.exist;
  });

  it('should render error heading and ServiceUnavailableAlert when claim empty', () => {
    const { container, getByText } = renderWithRouter(
      <Provider store={getStore()}>
        <FilesPage {...props} message={{ title: 'Test', body: 'Body' }} />
      </Provider>,
    );

    expect(container.querySelector('.claim-files')).to.not.exist;
    getByText('We encountered a problem');

    const alertHeading = $('va-alert h2', container);
    expect(alertHeading.textContent).to.equal(
      "We can't access your claim right now",
    );

    const alertBody = $('va-alert p', container);
    expect(alertBody.textContent).to.include(
      "We're sorry. There's a problem with our system.",
    );
  });

  it('should render error heading and ServiceUnavailableAlert when claim null', () => {
    const { container, getByText } = renderWithRouter(
      <Provider store={getStore()}>
        <FilesPage
          {...props}
          claim={null}
          message={{ title: 'Test', body: 'Body' }}
        />
      </Provider>,
    );

    expect(container.querySelector('.claim-files')).to.not.exist;
    getByText('We encountered a problem');

    const alertHeading = $('va-alert h2', container);
    expect(alertHeading.textContent).to.equal(
      "We can't access your claim right now",
    );

    const alertBody = $('va-alert p', container);
    expect(alertBody.textContent).to.include(
      "We're sorry. There's a problem with our system.",
    );
  });

  describe('pageFocus', () => {
    const claim = { ...baseClaim };

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

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      const headline = alert.querySelector('h2');
      await waitFor(() => {
        expect(document.activeElement).to.equal(headline);
      });
    });
  });

  describe('hash navigation', () => {
    const claim = { ...baseClaim };

    beforeEach(() => {
      // Restore the AdditionalEvidencePage stub from the outer describe block
      // We need the REAL component to render so the focusable elements exist in the DOM
      // (The outer beforeEach stubs it out with an empty div for other tests)
      if (stub && stub.restore) {
        stub.restore();
      }
    });

    afterEach(() => {
      // Re-stub AdditionalEvidencePage for other tests in the outer describe block
      // This ensures tests outside this describe block still get the stubbed version
      stub = sinon.stub(AdditionalEvidencePage, 'default');
      stub.returns(<div data-testid="additional-evidence-page" />);
    });

    // Test different hash anchors to verify scrollToSection focuses the correct element
    const testCases = [
      ['should focus on add-files section', '#add-files', 'add-files', true],
      [
        'should focus on file-submissions-in-progress section (feature flag enabled)',
        '#file-submissions-in-progress',
        'file-submissions-in-progress',
        true,
      ],
      [
        'should focus on documents-filed section (feature flag disabled)',
        '#documents-filed',
        'documents-filed',
        false,
      ],
    ];

    testCases.forEach(([description, hash, elementId, featureFlagEnabled]) => {
      it(description, async () => {
        const location = { hash };
        // Render FilesPage with hash location and feature flag
        renderWithRouter(
          <Provider
            store={getStore(
              { [FEATURE_FLAG_KEY]: featureFlagEnabled },
              {},
              claim,
            )}
          >
            <FilesPage
              {...props}
              claim={claim}
              loading={false}
              location={location}
            />
          </Provider>,
        );
        // Verify scrollToSection focused the correct element
        await waitFor(() => {
          expect(document.activeElement.id).to.equal(elementId);
        });
      });
    });
  });

  describe('document.title', () => {
    // Minimum data needed for these test cases.
    const claim = { ...baseClaim };
    claim.attributes.claimDate = '2024-09-04';
    claim.attributes.claimType = 'Compensation';
    claim.attributes.claimPhaseDates = { previousPhases: {} };
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
        const claim = { ...baseClaim };
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
      const claim = { ...baseClaim };

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
      const filesPage = container.querySelector('#tabPanelFiles');

      expect(filesPage).to.exist;
      expect(container.querySelector('.claim-file-header-container')).to.exist;
      expect(getByTestId('additional-evidence-page')).to.exist;
      expect(container.querySelector('.documents-filed-container')).to.exist;
      expect(container.querySelector('.claims-requested-files-container')).not
        .to.exist;
    });

    it('should render files page, showing additional evidence section with alerts, and docs filed section when using lighthouse', () => {
      const claim = { ...baseClaim };
      claim.attributes.documentsNeeded = true;
      claim.attributes.trackedItems = [
        {
          id: 1,
          status: 'NEEDED_FROM_YOU',
          displayName: 'Test',
          description: 'Test',
          suspenseDate: '2024-02-01',
          date: '2023-01-01',
        },
      ];
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
      const filesPage = container.querySelector('#tabPanelFiles');

      expect(filesPage).to.exist;
      expect(container.querySelector('.claim-file-header-container')).to.exist;
      expect(getByTestId('additional-evidence-page')).to.exist;
      expect(container.querySelector('.documents-filed-container')).to.exist;
      expect(container.querySelector('.claims-requested-files-container')).not
        .to.exist;
    });
    it('should not render ask va to decide component', () => {
      const claim = { ...baseClaim };
      claim.id = 1;
      claim.attributes.claimPhaseDates = {
        currentPhaseBack: false,
        phaseChangeDate: '2023-03-04',
        latestPhaseType: 'GATHERING_OF_EVIDENCE',
        previousPhases: {
          phase1CompleteDate: '2023-02-08',
          phase2CompleteDate: '2023-03-04',
        },
      };
      claim.attributes.evidenceWaiverSubmitted5103 = false;
      claim.attributes.status = 'EVIDENCE_GATHERING_REVIEW_DECISION';

      const { queryByText } = renderWithRouter(
        <Provider store={getStore()}>
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

  context('when claim is closed', () => {
    it('should render files page, showing additional evidence section, and docs filed section', () => {
      const claim = { ...baseClaim };
      claim.attributes.claimPhaseDates = {
        currentPhaseBack: false,
        phaseChangeDate: '2023-01-31',
        latestPhaseType: 'COMPLETE',
        previousPhases: {
          phase7CompleteDate: '2023-02-08',
        },
      };
      claim.attributes.closeDate = '2023-01-31';
      claim.attributes.status = 'COMPLETE';

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
      const filesPage = container.querySelector('#tabPanelFiles');

      expect(filesPage).to.exist;
      expect(container.querySelector('.claim-file-header-container')).to.exist;
      expect(getByTestId('additional-evidence-page')).to.exist;
      expect(container.querySelector('.documents-filed-container')).to.exist;
      expect(container.querySelector('.claims-requested-files-container')).not
        .to.exist;
    });
  });

  describe('OtherWaysToSendYourDocuments feature toggle', () => {
    it('should render OtherWaysToSendYourDocuments when feature toggle is enabled', () => {
      const featureToggles = { [FEATURE_FLAG_KEY]: true };
      const { getByTestId, getByText } = renderWithRouter(
        <Provider store={getStore(featureToggles)}>
          <FilesPage {...props} claim={baseClaim} />
        </Provider>,
      );

      // Should render OtherWaysToSendYourDocuments component
      expect(getByTestId('other-ways-to-send-documents')).to.exist;
      expect(getByText('Other ways to send your documents')).to.exist;
      expect(getByText('Option 1: By mail')).to.exist;
      expect(getByText('Option 2: In person')).to.exist;
      expect(getByText('How to confirm we\u2019ve received your documents')).to
        .exist;

      // Should render new components that are only present when toggle is enabled
      expect(getByTestId('file-submissions-in-progress')).to.exist;

      // AdditionalEvidencePage should still be present (it's rendered in both toggle states)
      expect(getByTestId('additional-evidence-page')).to.exist;
    });

    it('should render old content when feature toggle is disabled', () => {
      const { getByTestId, queryByTestId } = renderWithRouter(
        <Provider store={getStore()}>
          <FilesPage {...props} claim={baseClaim} />
        </Provider>,
      );

      // Should render old components
      expect(getByTestId('additional-evidence-page')).to.exist;

      // Should NOT render OtherWaysToSendYourDocuments component
      expect(queryByTestId('other-ways-to-send-documents')).to.not.exist;
    });
  });
});
