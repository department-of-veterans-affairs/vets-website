import React from 'react';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { uploadStore } from '~/platform/forms-system/test/config/helpers';

import { AdditionalEvidencePage } from '../../../components/claim-files-tab/AdditionalEvidencePage';
import { renderWithReduxAndRouter } from '../../utils';

const getRouter = () => ({ push: sinon.spy() });

const fileFormProps = {
  params: { id: 1 },
  cancelUpload: () => {},
  filesNeeded: [],
  filesOptional: [],
  resetUploads: () => {},
  clearAdditionalEvidenceNotification: () => {},
  location: {
    hash: '',
  },
};

// Needed for the rendering of the AddFilesForm child component
const initialState = {
  featureToggles: {
    // eslint-disable-next-line camelcase
    cst_show_document_upload_status: false,
  },
};

describe('<AdditionalEvidencePage>', () => {
  let originalSetInterval;
  let intervalIds = [];

  beforeEach(() => {
    // Mock setInterval to prevent hanging tests
    originalSetInterval = global.setInterval;
    global.setInterval = (fn, delay) => {
      const id = originalSetInterval(() => {}, delay); // Create a dummy interval
      intervalIds.push(id);
      return id;
    };
  });

  afterEach(() => {
    // Clear all intervals and restore original
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];
    global.setInterval = originalSetInterval;
  });

  context('when claim is open', () => {
    const claim = {
      id: 1,
      attributes: {
        status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
        closeDate: null,
        claimPhaseDates: {
          latestPhaseType: 'GATHERING_OF_EVIDENCE',
        },
      },
    };

    it('should render loading div', () => {
      const { container } = renderInReduxProvider(
        <AdditionalEvidencePage {...fileFormProps} claim={claim} loading />,
        { initialState },
      );

      expect($('va-loading-indicator', container)).to.exist;
      expect($('additional-evidence-container', container)).not.to.exist;
    });

    it('should render upload error alert', () => {
      const message = {
        title: 'test',
        body: 'test',
        type: 'error',
      };
      const { container } = renderInReduxProvider(
        <AdditionalEvidencePage
          {...fileFormProps}
          claim={claim}
          message={message}
        />,
        { initialState },
      );

      expect($('.claims-alert', container)).to.exist;
      expect($('.claims-alert h2', container).textContent).to.equal(
        message.title,
      );
    });

    it('should render upload error alert when rerendered', () => {
      const { container, rerender } = renderInReduxProvider(
        <AdditionalEvidencePage {...fileFormProps} claim={claim} />,
        { initialState },
      );
      expect($('.claims-alert', container)).not.to.exist;

      const message = {
        title: 'Error uploading',
        body: 'Internal server error',
        type: 'error',
      };

      rerender(
        <AdditionalEvidencePage
          {...fileFormProps}
          claim={claim}
          message={message}
        />,
      );
      expect($('.claims-alert', container)).to.exist;
      expect($('.claims-alert h2', container).textContent).to.equal(
        message.title,
      );
    });

    it('should clear upload error when leaving', () => {
      const message = {
        title: 'test',
        body: 'test',
        type: 'error',
      };
      const clearAdditionalEvidenceNotification = sinon.spy();

      const { container, unmount } = renderInReduxProvider(
        <AdditionalEvidencePage
          {...fileFormProps}
          claim={claim}
          clearAdditionalEvidenceNotification={
            clearAdditionalEvidenceNotification
          }
          message={message}
        />,
        { initialState },
      );

      expect($('.claims-alert', container)).to.exist;
      expect($('.claims-alert h2', container).textContent).to.equal(
        message.title,
      );
      unmount();
      expect(clearAdditionalEvidenceNotification.called).to.be.true;
    });

    it('should not clear notification after completed upload', () => {
      const message = {
        title: 'test',
        body: 'test',
        type: 'error',
      };
      const clearAdditionalEvidenceNotification = sinon.spy();

      const { container, unmount } = renderInReduxProvider(
        <AdditionalEvidencePage
          {...fileFormProps}
          claim={claim}
          uploadComplete
          clearAdditionalEvidenceNotification={
            clearAdditionalEvidenceNotification
          }
          message={message}
        />,
        { initialState },
      );

      expect($('.claims-alert', container)).to.exist;
      expect($('.claims-alert h2', container).textContent).to.equal(
        message.title,
      );
      unmount();
      expect(clearAdditionalEvidenceNotification.called).to.be.false;
    });

    it('should reset uploads on mount', () => {
      const resetUploads = sinon.spy();
      const mainDiv = document.createElement('div');
      mainDiv.classList.add('va-nav-breadcrumbs');
      document.body.appendChild(mainDiv);

      try {
        ReactTestUtils.renderIntoDocument(
          <Provider store={uploadStore}>
            <AdditionalEvidencePage
              {...fileFormProps}
              claim={claim}
              resetUploads={resetUploads}
            />
          </Provider>,
        );

        expect(resetUploads.called).to.be.true;
      } finally {
        // Clean up DOM element
        document.body.removeChild(mainDiv);
      }
    });

    it('should set details and go to files page if complete', () => {
      const getClaim = sinon.spy();
      const resetUploads = sinon.spy();
      const navigate = sinon.spy();
      const { rerender } = renderInReduxProvider(
        <AdditionalEvidencePage
          {...fileFormProps}
          claim={claim}
          navigate={navigate}
          getClaim={getClaim}
          resetUploads={resetUploads}
        />,
        { initialState },
      );

      rerender(
        <AdditionalEvidencePage
          {...fileFormProps}
          claim={claim}
          uploadComplete
          navigate={navigate}
          getClaim={getClaim}
          resetUploads={resetUploads}
        />,
      );

      expect(getClaim.calledWith(1)).to.be.true;
      expect(navigate.calledWith('../files')).to.be.true;
    });

    it('shows va-alerts when files are needed', () => {
      const filesNeeded = [
        {
          id: 1,
          status: 'NEEDED_FROM_YOU',
          displayName: 'Test',
          description: 'Test',
          suspenseDate: '2024-02-01',
        },
      ];
      const filesOptional = [
        {
          id: 2,
          status: 'NEEDED_FROM_OTHERS',
          displayName: 'Test',
          description: 'Test',
        },
      ];

      const { container } = renderWithReduxAndRouter(
        <AdditionalEvidencePage
          {...fileFormProps}
          claim={claim}
          router={getRouter()}
          filesNeeded={filesNeeded}
          filesOptional={filesOptional}
        />,
        { initialState },
      );

      expect($('.primary-alert', container)).to.exist;
      expect($('.optional-alert', container)).to.exist;
    });

    it('doesnt show va-alerts when no files are needed', () => {
      const { container } = renderWithReduxAndRouter(
        <AdditionalEvidencePage
          {...fileFormProps}
          claim={claim}
          router={getRouter()}
        />,
        { initialState },
      );

      expect($('.primary-alert', container)).not.to.exist;
      expect($('.optional-alert', container)).not.to.exist;
    });

    it('should render default title when additionalEvidenceTitle prop is not provided', () => {
      const { container } = renderInReduxProvider(
        <AdditionalEvidencePage {...fileFormProps} claim={claim} />,
        { initialState },
      );

      const titleElement = $('#add-files', container);
      expect(titleElement).to.exist;
      expect(titleElement.textContent).to.equal('Additional evidence');
    });

    it('should render custom title when additionalEvidenceTitle prop is provided', () => {
      const customTitle = 'Upload additional evidence';
      const { container } = renderInReduxProvider(
        <AdditionalEvidencePage
          {...fileFormProps}
          claim={claim}
          additionalEvidenceTitle={customTitle}
        />,
        { initialState },
      );

      const titleElement = $('#add-files', container);
      expect(titleElement).to.exist;
      expect(titleElement.textContent).to.equal(customTitle);
    });

    it('should pass showDocumentUploadStatus toggle to submitFiles when toggle is enabled', () => {
      const submitFiles = sinon.spy();

      const page = new AdditionalEvidencePage({
        ...fileFormProps,
        claim,
        submitFiles,
        showDocumentUploadStatus: true,
      });

      const files = [
        { file: {}, docType: { value: 'test' }, password: { value: '' } },
      ];
      page.onSubmitFiles(claim.id, files);

      expect(submitFiles.calledWith(claim.id, null, files, true)).to.be.true;
    });

    it('should pass showDocumentUploadStatus as false to submitFiles when toggle is disabled', () => {
      const submitFiles = sinon.spy();

      const page = new AdditionalEvidencePage({
        ...fileFormProps,
        claim,
        submitFiles,
        showDocumentUploadStatus: false,
      });

      const files = [
        { file: {}, docType: { value: 'test' }, password: { value: '' } },
      ];
      page.onSubmitFiles(claim.id, files);

      expect(submitFiles.calledWith(claim.id, null, files, false)).to.be.true;
    });
  });

  context('when claim is open with automated 5103 and standard 5103', () => {
    const claim = {
      id: 1,
      attributes: {
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
      },
    };

    it('shows va-alert for automated 5103 notice when files are needed', () => {
      const filesNeeded = [
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
      ];

      const { container, getByText, getByTestId } = renderWithReduxAndRouter(
        <AdditionalEvidencePage
          {...fileFormProps}
          claim={claim}
          router={getRouter()}
          filesNeeded={filesNeeded}
        />,
        { initialState },
      );

      expect($('.primary-alert', container)).to.exist;
      expect(getByTestId(`item-${claim.attributes.trackedItems[0].id}`)).to
        .exist;
      getByText('Review evidence list (5103 notice)');
    });
  });
  context('when claim is open with only standard 5103', () => {
    const claim = {
      id: 1,
      attributes: {
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
      },
    };

    it('doesnt show va-alert for standard 5103 notice', () => {
      const { queryByText, queryByTestId } = renderWithReduxAndRouter(
        <AdditionalEvidencePage
          {...fileFormProps}
          claim={claim}
          router={getRouter()}
        />,
        { initialState },
      );

      expect(queryByTestId('standard-5103-notice-alert')).to.not.exist;
      expect(queryByText('5103 Evidence Notice')).to.be.null;
      expect(queryByText('Automated 5103 Notice Response')).to.be.null;
    });
  });

  context('when claim is closed', () => {
    const claim = {
      id: 1,
      attributes: {
        status: 'COMPLETE',
        closeDate: '01-01-2024',
        claimPhaseDates: {
          latestPhaseType: 'COMPLETE',
        },
      },
    };

    const resetUploads = sinon.spy();

    it('should render loading div', () => {
      const { container } = renderInReduxProvider(
        <AdditionalEvidencePage
          {...fileFormProps}
          claim={claim}
          resetUploads={resetUploads}
          uploadComplete
          loading
        />,
        { initialState },
      );
      const additionalEvidenceSection = $(
        '.additional-evidence-container',
        container,
      );
      expect(additionalEvidenceSection).to.not.exist;
      expect($('va-loading-indicator', container)).to.exist;
    });

    it('should render closed message', () => {
      const { container, getByText } = renderInReduxProvider(
        <AdditionalEvidencePage
          {...fileFormProps}
          claim={claim}
          resetUploads={resetUploads}
          uploadComplete
        />,
        { initialState },
      );
      const additionalEvidenceSection = $(
        '.additional-evidence-container',
        container,
      );
      expect(additionalEvidenceSection).to.exist;

      const text =
        'The claim is closed so you can no longer submit any additional evidence.';
      expect(getByText(text)).to.exist;
    });
  });
});
