import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { FilesPage } from '../../containers/FilesPage';
import * as AdditionalEvidencePage from '../../components/claim-files-tab/AdditionalEvidencePage';
import {
  renderWithRouter,
  rerenderWithRouter,
  renderWithReduxAndRouter,
} from '../utils';
import * as helpers from '../../utils/helpers';

// cst_show_document_upload_status false for old behavior)
const defaultReduxState = {
  initialState: {
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_show_document_upload_status: false,
    },
  },
};

// cst_show_document_upload_status true for new component testing
const enabledReduxState = {
  initialState: {
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_show_document_upload_status: true,
    },
  },
};

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
    const claim = { ...baseClaim };

    it('should call setPageFocus when location.hash is empty', async () => {
      renderWithReduxAndRouter(
        <FilesPage {...props} claim={claim} location={{ hash: '' }} />,
        defaultReduxState,
      );

      await waitFor(() => {
        expect(setPageFocusSpy.calledOnce).to.be.true;
      });
    });

    it('should not call setPageFocus when location.hash is not empty', async () => {
      renderWithReduxAndRouter(
        <FilesPage {...props} location={{ hash: '#add-files' }} />,
        defaultReduxState,
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

      const { container } = renderWithReduxAndRouter(
        <FilesPage
          {...props}
          claim={claim}
          message={message}
          location={{ hash: '' }}
        />,
        defaultReduxState,
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
    const claim = { ...baseClaim };
    claim.attributes.claimDate = '2024-09-04';
    claim.attributes.claimType = 'Compensation';
    claim.attributes.claimPhaseDates = { previousPhases: {} };
    it('should not update document title at mount-time if claim is not available', () => {
      renderWithRouter(<FilesPage {...props} />);
      expect(document.title).to.equal('');
    });
    it('should update document title with claim details at mount-time if claim is already loaded', () => {
      renderWithReduxAndRouter(
        <FilesPage {...props} claim={claim} />,
        defaultReduxState,
      );
      expect(document.title).to.equal(
        'Files for September 4, 2024 Compensation Claim | Veterans Affairs',
      );
    });
    it('should update document title with claim details after mount once the claim has loaded', () => {
      const { rerender } = renderWithReduxAndRouter(
        <FilesPage {...props} loading />,
        defaultReduxState,
      );
      rerenderWithRouter(rerender, <FilesPage {...props} claim={claim} />);
      expect(document.title).to.equal(
        'Files for September 4, 2024 Compensation Claim | Veterans Affairs',
      );
    });
    it('should update document title with a default message after mount once the claim fails to load', () => {
      const { rerender } = renderWithRouter(<FilesPage {...props} loading />);
      rerenderWithRouter(rerender, <FilesPage {...props} claim={null} />);
      expect(document.title).to.equal(
        'Files for Your Claim | Veterans Affairs',
      );
    });
    it('should not update document title after mount if the loading status has not changed', () => {
      const { rerender } = renderWithRouter(<FilesPage {...props} loading />);
      rerenderWithRouter(
        rerender,
        <FilesPage
          {...props}
          loading
          message={{ title: 'Test', body: 'Body' }}
        />,
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
        const { unmount } = renderWithReduxAndRouter(
          <FilesPage
            {...props}
            clearNotification={clearNotification}
            message={message}
            claim={claim}
          />,
          defaultReduxState,
        );
        unmount();
        expect(clearNotification.called).to.be.true;
      });
    });
  });

  context('when claim is open', () => {
    it('should render files page, showing additional evidence section without alerts, and docs filed section', () => {
      const claim = { ...baseClaim };

      const { container, getByTestId } = renderWithReduxAndRouter(
        <FilesPage
          {...props}
          claim={claim}
          message={{ title: 'Test', body: 'Body' }}
          clearNotification={() => {}}
        />,
      );
      const filesPage = $('#tabPanelFiles', container);

      expect(filesPage).to.exist;
      expect($('.claim-file-header-container', container)).to.exist;
      expect(getByTestId('additional-evidence-page')).to.exist;
      expect($('.documents-filed-container', container)).to.exist;
      expect($('.claims-requested-files-container', container)).not.to.exist;
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
      const { container, getByTestId } = renderWithReduxAndRouter(
        <FilesPage
          {...props}
          claim={claim}
          message={{ title: 'Test', body: 'Body' }}
          clearNotification={() => {}}
        />,
      );
      const filesPage = $('#tabPanelFiles', container);

      expect(filesPage).to.exist;
      expect($('.claim-file-header-container', container)).to.exist;
      expect(getByTestId('additional-evidence-page')).to.exist;
      expect($('.documents-filed-container', container)).to.exist;
      expect($('.claims-requested-files-container', container)).to.not.exist;
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

      const { queryByText } = renderWithReduxAndRouter(
        <FilesPage
          {...props}
          claim={claim}
          message={{ title: 'Test', body: 'Body' }}
          clearNotification={() => {}}
        />,
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

      const { container, getByTestId } = renderWithReduxAndRouter(
        <FilesPage
          {...props}
          claim={claim}
          message={{ title: 'Test', body: 'Body' }}
          clearNotification={() => {}}
        />,
      );
      const filesPage = $('#tabPanelFiles', container);

      expect(filesPage).to.exist;
      expect($('.claim-file-header-container', container)).to.exist;
      expect(getByTestId('additional-evidence-page')).to.exist;
      expect($('.documents-filed-container', container)).to.exist;
      expect($('.claims-requested-files-container', container)).not.to.exist;
    });
  });

  describe('OtherWaysToSendYourDocuments feature toggle', () => {
    it('should render OtherWaysToSendYourDocuments when feature toggle is enabled', () => {
      const { getByTestId, getByText } = renderWithReduxAndRouter(
        <FilesPage {...props} claim={baseClaim} />,
        enabledReduxState,
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
      const { getByTestId, queryByTestId } = renderWithReduxAndRouter(
        <FilesPage {...props} claim={baseClaim} />,
        defaultReduxState,
      );

      // Should render old components
      expect(getByTestId('additional-evidence-page')).to.exist;

      // Should NOT render OtherWaysToSendYourDocuments component
      expect(queryByTestId('other-ways-to-send-documents')).to.not.exist;
    });
  });
});
