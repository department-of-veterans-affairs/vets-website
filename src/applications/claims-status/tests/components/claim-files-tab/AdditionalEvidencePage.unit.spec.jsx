import React from 'react';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { createStore } from 'redux';
import { fireEvent } from '@testing-library/dom';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { uploadStore } from '~/platform/forms-system/test/config/helpers';

import { fileTypeSignatures } from 'platform/forms-system/src/js/utilities/file';
import { AdditionalEvidencePage } from '../../../components/claim-files-tab/AdditionalEvidencePage';
import { renderWithRouter } from '../../utils';

const getRouter = () => ({ push: sinon.spy() });

const fileFormProps = {
  params: { id: 1 },
  addFile: () => {},
  cancelUpload: () => {},
  setFieldsDirty: () => {},
  updateField: () => {},
  removeFile: () => {},
  uploadField: {},
  files: [],
  filesNeeded: [],
  filesOptional: [],
  resetUploads: () => {},
  clearAdditionalEvidenceNotification: () => {},
  location: {
    hash: '',
  },
};

describe('<AdditionalEvidencePage>', () => {
  const getStore = createStore(() => ({}));

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
      const { container } = render(
        <Provider store={getStore}>
          <AdditionalEvidencePage {...fileFormProps} claim={claim} loading />,
        </Provider>,
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
      const { container } = render(
        <Provider store={getStore}>
          <AdditionalEvidencePage
            {...fileFormProps}
            claim={claim}
            message={message}
          />
          ,
        </Provider>,
      );

      expect($('va-alert', container)).to.exist;
      expect($('va-alert h2', container).textContent).to.equal(message.title);
    });

    it('should render upload error alert when rerendered', () => {
      const { container, rerender } = render(
        <Provider store={getStore}>
          <AdditionalEvidencePage {...fileFormProps} claim={claim} />,
        </Provider>,
      );
      expect($('va-alert', container)).not.to.exist;

      const message = {
        title: 'Error uploading',
        body: 'Internal server error',
        type: 'error',
      };

      rerender(
        <Provider store={getStore}>
          <AdditionalEvidencePage
            {...fileFormProps}
            claim={claim}
            message={message}
          />
          ,
        </Provider>,
      );
      expect($('va-alert', container)).to.exist;
      expect($('va-alert h2', container).textContent).to.equal(message.title);
    });

    it('should clear upload error when leaving', () => {
      const message = {
        title: 'test',
        body: 'test',
        type: 'error',
      };
      const clearAdditionalEvidenceNotification = sinon.spy();

      const { container, unmount } = render(
        <Provider store={getStore}>
          <AdditionalEvidencePage
            {...fileFormProps}
            claim={claim}
            clearAdditionalEvidenceNotification={
              clearAdditionalEvidenceNotification
            }
            message={message}
          />
          ,
        </Provider>,
      );

      expect($('va-alert', container)).to.exist;
      expect($('va-alert h2', container).textContent).to.equal(message.title);
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

      const { container, unmount } = render(
        <Provider store={getStore}>
          <AdditionalEvidencePage
            {...fileFormProps}
            claim={claim}
            uploadComplete
            clearAdditionalEvidenceNotification={
              clearAdditionalEvidenceNotification
            }
            message={message}
          />
          ,
        </Provider>,
      );

      expect($('va-alert', container)).to.exist;
      expect($('va-alert h2', container).textContent).to.equal(message.title);
      unmount();
      expect(clearAdditionalEvidenceNotification.called).to.be.false;
    });

    it('should focus on header when location has equals #add-files', () => {
      const location = { hash: '#add-files' };

      render(
        <Provider store={getStore}>
          <AdditionalEvidencePage
            {...fileFormProps}
            claim={claim}
            location={location}
          />
        </Provider>,
      );
      expect(document.activeElement.id).to.equal('add-files');
    });

    it('should handle submit files', () => {
      const file = {
        file: new File(['hello'], 'hello.jpg', {
          type: fileTypeSignatures.jpg.mime,
        }),
        size: 40,
        name: 'hello.jpg',
        docType: { value: 'L029', dirty: true },
        password: { value: '', dirty: false },
        isEncrypted: false,
      };
      const submitFilesSpy = sinon.spy();

      const { container } = render(
        <Provider store={getStore}>
          <AdditionalEvidencePage
            {...fileFormProps}
            claim={claim}
            files={[file]}
            documentsUseLighthouse={false}
            submitFiles={submitFilesSpy}
          />
          ,
        </Provider>,
      );

      fireEvent.click($('#submit', container));

      expect(submitFilesSpy.called).to.be.true;
      expect(submitFilesSpy.calledWith(1, null, [file])).to.be.true;
    });

    it('should reset uploads on mount', () => {
      const resetUploads = sinon.spy();
      const mainDiv = document.createElement('div');
      mainDiv.classList.add('va-nav-breadcrumbs');
      document.body.appendChild(mainDiv);
      ReactTestUtils.renderIntoDocument(
        <Provider store={uploadStore}>
          <AdditionalEvidencePage
            {...fileFormProps}
            claim={claim}
            uploadField={{ value: null, dirty: false }}
            resetUploads={resetUploads}
          />
        </Provider>,
      );

      expect(resetUploads.called).to.be.true;
    });

    it('should set details and go to files page if complete', () => {
      const getClaim = sinon.spy();
      const resetUploads = sinon.spy();
      const navigate = sinon.spy();
      const { rerender } = render(
        <Provider store={getStore}>
          <AdditionalEvidencePage
            {...fileFormProps}
            claim={claim}
            navigate={navigate}
            getClaim={getClaim}
            resetUploads={resetUploads}
          />
          ,
        </Provider>,
      );

      rerender(
        <Provider store={getStore}>
          <AdditionalEvidencePage
            {...fileFormProps}
            claim={claim}
            uploadComplete
            navigate={navigate}
            getClaim={getClaim}
            resetUploads={resetUploads}
          />
          ,
        </Provider>,
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

      const { container } = renderWithRouter(
        <Provider store={getStore}>
          <AdditionalEvidencePage
            {...fileFormProps}
            claim={claim}
            router={getRouter()}
            filesNeeded={filesNeeded}
            filesOptional={filesOptional}
          />
          ,
        </Provider>,
      );

      expect($('.primary-alert', container)).to.exist;
      expect($('.optional-alert', container)).to.exist;
    });

    it('doesn’t show va-alerts when no files are needed', () => {
      const { container } = render(
        <Provider store={getStore}>
          <AdditionalEvidencePage
            {...fileFormProps}
            claim={claim}
            router={getRouter()}
          />
        </Provider>,
      );

      expect($('.primary-alert', container)).not.to.exist;
      expect($('.optional-alert', container)).not.to.exist;
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

      const { container, getByText, getByTestId } = renderWithRouter(
        <Provider store={getStore}>
          <AdditionalEvidencePage
            {...fileFormProps}
            claim={claim}
            router={getRouter()}
            filesNeeded={filesNeeded}
          />
          ,
        </Provider>,
      );

      expect($('.primary-alert', container)).to.exist;
      expect(getByTestId(`item-${claim.attributes.trackedItems[0].id}`)).to
        .exist;
      getByText('Automated 5103 Notice Response');
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
      const { queryByText, queryByTestId } = renderWithRouter(
        <Provider store={getStore}>
          <AdditionalEvidencePage
            {...fileFormProps}
            claim={claim}
            router={getRouter()}
          />
          ,
        </Provider>,
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
      const { container } = render(
        <AdditionalEvidencePage
          {...fileFormProps}
          claim={claim}
          resetUploads={resetUploads}
          uploadComplete
          loading
        />,
      );
      const additionalEvidenceSection = $(
        '.additional-evidence-container',
        container,
      );
      expect(additionalEvidenceSection).to.not.exist;
      expect($('va-loading-indicator', container)).to.exist;
    });

    it('should render closed message', () => {
      const { container, getByText } = render(
        <Provider store={getStore}>
          <AdditionalEvidencePage
            {...fileFormProps}
            claim={claim}
            resetUploads={resetUploads}
            uploadComplete
          />
          ,
        </Provider>,
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
