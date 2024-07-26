import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { createStore } from 'redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { fileTypeSignatures } from '~/platform/forms-system/src/js/utilities/file';
import { uploadStore } from '~/platform/forms-system/test/config/helpers';

import { DocumentRequestPage } from '../../containers/DocumentRequestPage';
import { renderWithRouter, rerenderWithRouter } from '../utils';

const claim = {
  id: 1,
  attributes: {},
};

const params = { id: 1, trackedItemId: 467558 };

const defaultProps = {
  claim,
  params,
  resetUploads: () => {},
  clearNotification: () => {},
  loading: false,
  navigate: () => {},
  uploadField: { value: null, dirty: false },
  files: [],
  addFile: () => {},
  cancelUpload: () => {},
  setFieldsDirty: () => {},
  updateField: () => {},
  removeFile: () => {},
};

describe('<DocumentRequestPage>', () => {
  const getStore = (cst5103UpdateEnabled = true) =>
    createStore(() => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        cst_5103_update_enabled: cst5103UpdateEnabled,
      },
    }));

  context('when cst5103UpdateEnabled is true', () => {
    it('should render Default5103EvidenceNotice component when item is a 5103 notice', () => {
      const trackedItem = {
        closedDate: null,
        description: 'Automated 5103 Notice Response',
        displayName: 'Automated 5103 Notice Response',
        id: 467558,
        overdue: true,
        receivedDate: null,
        requestedDate: '2024-03-07',
        status: 'NEEDED_FROM_YOU',
        suspenseDate: '2024-04-07',
        uploadsAllowed: true,
        documents: '[]',
        date: '2024-03-07',
      };

      const { container } = renderWithRouter(
        <Provider store={getStore()}>
          <DocumentRequestPage {...defaultProps} trackedItem={trackedItem} />,
        </Provider>,
      );
      expect($('#automated-5103-notice-page', container)).to.exist;
      const breadcrumbs = $('va-breadcrumbs', container);
      expect(breadcrumbs.breadcrumbList[3].href).to.equal(
        `../document-request/${trackedItem.id}`,
      );
      expect(breadcrumbs.breadcrumbList[3].label).to.equal(
        '5103 Evidence Notice',
      );
      expect(document.title).to.equal(
        '5103 Evidence Notice | Veterans Affairs',
      );
    });

    it('should not render Default5103EvidenceNotice component when item is a not a 5103 notice', () => {
      const trackedItem = {
        closedDate: null,
        description: 'Buddy statement text',
        displayName: 'Submit buddy statement(s)',
        id: 467558,
        overdue: true,
        receivedDate: null,
        requestedDate: '2024-03-07',
        status: 'NEEDED_FROM_YOU',
        suspenseDate: '2024-04-07',
        uploadsAllowed: true,
        documents: '[]',
        date: '2024-03-07',
      };

      const { container } = renderWithRouter(
        <Provider store={getStore()}>
          <DocumentRequestPage {...defaultProps} trackedItem={trackedItem} />,
        </Provider>,
      );
      expect($('#automated-5103-notice-page', container)).to.not.exist;
      const breadcrumbs = $('va-breadcrumbs', container);
      expect(breadcrumbs.breadcrumbList[3].href).to.equal(
        `../document-request/${trackedItem.id}`,
      );
      expect(breadcrumbs.breadcrumbList[3].label).to.equal(
        `Request for ${trackedItem.displayName}`,
      );
      expect(document.title).to.equal(
        `Request for ${trackedItem.displayName} | Veterans Affairs`,
      );
    });
  });

  context('when cst5103UpdateEnabled is false', () => {
    it('when component mounts should set document title', () => {
      renderWithRouter(
        <Provider store={getStore(false)}>
          <DocumentRequestPage {...defaultProps} loading />,
        </Provider>,
      );

      expect(document.title).to.equal('Document Request | Veterans Affairs');
    });

    it('when component mounts should scroll to breadcrumbs', async () => {
      const trackedItem = {
        status: 'NEEDED_FROM_YOU',
        displayName: 'Testing',
      };

      const { container, rerender } = renderWithRouter(
        <Provider store={getStore(false)}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={trackedItem}
            loading
          />
          ,
        </Provider>,
      );

      rerenderWithRouter(
        rerender,
        <Provider store={getStore(false)}>
          <DocumentRequestPage {...defaultProps} trackedItem={trackedItem} />,
        </Provider>,
      );

      await waitFor(() => {
        expect(document.activeElement).to.equal($('va-breadcrumbs', container));
      });
    });

    it('when component mounts without sessionStorage previousPage value should set previous breadcrumb to status', () => {
      const trackedItem = {
        status: 'NEEDED_FROM_YOU',
        displayName: 'Testing',
      };

      const { container } = renderWithRouter(
        <Provider store={getStore(false)}>
          <DocumentRequestPage {...defaultProps} trackedItem={trackedItem} />,
        </Provider>,
      );
      const breadcrumbs = $('va-breadcrumbs', container);
      expect(breadcrumbs.breadcrumbList[2].href).to.equal('../status');
      expect(breadcrumbs.breadcrumbList[2].label).to.equal(
        'Status of your disability compensation claim',
      );
    });

    it('when component mounts with sessionStorage previousPage value of files should set previous breadcrumb', () => {
      const trackedItem = {
        status: 'NEEDED_FROM_YOU',
        displayName: 'Testing',
      };

      sessionStorage.setItem('previousPage', 'files');

      const { container } = renderWithRouter(
        <Provider store={getStore(false)}>
          <DocumentRequestPage {...defaultProps} trackedItem={trackedItem} />,
        </Provider>,
      );
      const breadcrumbs = $('va-breadcrumbs', container);
      expect(breadcrumbs.breadcrumbList[2].href).to.equal('../files');
      expect(breadcrumbs.breadcrumbList[2].label).to.equal(
        'Files for your disability compensation claim',
      );
    });

    it('when component mounts with sessionStorage previousPage value of status should set previous breadcrumb', () => {
      const trackedItem = {
        status: 'NEEDED_FROM_YOU',
        displayName: 'Testing',
      };

      sessionStorage.setItem('previousPage', 'status');

      const { container } = renderWithRouter(
        <Provider store={getStore(false)}>
          <DocumentRequestPage {...defaultProps} trackedItem={trackedItem} />,
        </Provider>,
      );
      const breadcrumbs = $('va-breadcrumbs', container);
      expect(breadcrumbs.breadcrumbList[2].href).to.equal('../status');
      expect(breadcrumbs.breadcrumbList[2].label).to.equal(
        'Status of your disability compensation claim',
      );
    });

    it('should render loading div', () => {
      const { context } = renderWithRouter(
        <Provider store={getStore(false)}>
          <DocumentRequestPage {...defaultProps} loading />,
        </Provider>,
      );

      expect($('va-loading-indicator', context)).to.exist;
      expect($('.claim-container', context)).to.not.exist;
    });

    it('should render upload error alert', () => {
      const trackedItem = {
        status: 'NEEDED_FROM_YOU',
      };
      const message = {
        title: 'Test',
        body: 'Testing',
      };

      const { context } = renderWithRouter(
        <Provider store={getStore(false)}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={trackedItem}
            message={message}
          />
          ,
        </Provider>,
      );
      expect($('va-alert', context)).to.exist;
    });

    it('should render upload error alert when rerendered', () => {
      const trackedItem = {
        status: 'NEEDED_FROM_YOU',
      };

      const { container, rerender } = renderWithRouter(
        <Provider store={getStore(false)}>
          <DocumentRequestPage {...defaultProps} trackedItem={trackedItem} />,
        </Provider>,
      );
      expect($('va-alert', container)).not.to.exist;

      const message = {
        title: 'Test',
        body: 'Testing',
      };

      rerenderWithRouter(
        rerender,
        <Provider store={getStore(false)}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={trackedItem}
            message={message}
          />
          ,
        </Provider>,
      );
      expect($('va-alert', container)).to.exist;
      expect($('va-alert h2', container).textContent).to.equal(message.title);
    });

    it('should clear upload error when leaving', () => {
      const trackedItem = {
        status: 'NEEDED_FROM_YOU',
      };

      const message = {
        title: 'test',
        body: 'test',
        type: 'error',
      };
      const clearNotification = sinon.spy();

      const { container, unmount } = renderWithRouter(
        <Provider store={getStore(false)}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={trackedItem}
            clearNotification={clearNotification}
            message={message}
          />
          ,
        </Provider>,
      );

      expect($('va-alert', container)).to.exist;
      unmount();
      expect(clearNotification.called).to.be.true;
    });

    it('should not clear notification after completed upload', () => {
      const trackedItem = {
        status: 'NEEDED_FROM_YOU',
      };
      const message = {
        title: 'test',
        body: 'test',
        type: 'error',
      };
      const clearNotification = sinon.spy();
      const { context } = renderWithRouter(
        <Provider store={getStore(false)}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={trackedItem}
            clearNotification={clearNotification}
            message={message}
          />
          ,
        </Provider>,
      );

      expect($('va-alert', context)).to.exist;
      expect(clearNotification.called).to.be.false;
    });

    it('should render due date info', () => {
      const trackedItem = {
        status: 'NEEDED_FROM_YOU',
        suspenseDate: '2010-05-10',
      };

      const { context } = renderWithRouter(
        <Provider store={getStore(false)}>
          <DocumentRequestPage {...defaultProps} trackedItem={trackedItem} />,
        </Provider>,
      );

      expect($('.due-date-header', context)).to.exist;
    });

    it('should render optional upload alert', () => {
      const trackedItem = {
        status: 'NEEDED_FROM_OTHERS',
        suspenseDate: '2010-05-10',
      };
      const { context } = renderWithRouter(
        <Provider store={getStore(false)}>
          <DocumentRequestPage {...defaultProps} trackedItem={trackedItem} />,
        </Provider>,
      );

      expect($('.optional-upload', context)).to.exist;
    });

    it('should handle submit files', () => {
      const trackedItem = {
        status: 'NEEDED_FROM_YOU',
        suspenseDate: '2010-05-10',
      };
      const onSubmit = sinon.spy();
      const { container, rerender } = renderWithRouter(
        <Provider store={getStore(false)}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={trackedItem}
            submitFiles={onSubmit}
          />
          ,
        </Provider>,
      );

      // Check the checkbox
      $('va-checkbox', container).__events.vaChange({
        detail: { checked: true },
      });

      // Create a file
      const file = {
        file: new File(['hello'], 'hello.jpg', {
          name: 'hello.jpg',
          type: fileTypeSignatures.jpg.mime,
          size: 9999,
        }),
        docType: { value: 'L029', dirty: true },
        password: { value: '', dirty: false },
        isEncrypted: false,
      };

      rerenderWithRouter(
        rerender,
        <Provider store={getStore(false)}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={trackedItem}
            files={[file]}
            submitFiles={onSubmit}
          />
          ,
        </Provider>,
      );

      fireEvent.click($('.submit-files-button', container));
      expect(onSubmit.called).to.be.true;
    });

    it('should handle submit files lighthouse and navigate to files page', () => {
      const submitFilesLighthouse = sinon.spy();
      const trackedItem = {
        status: 'NEEDED_FROM_YOU',
        suspenseDate: '2010-05-10',
        displayName: 'Testing',
      };
      const { container, rerender } = renderWithRouter(
        <Provider store={getStore(false)}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={trackedItem}
            submitFilesLighthouse={submitFilesLighthouse}
            documentsUseLighthouse
          />
          ,
        </Provider>,
      );

      // Check the checkbox
      $('va-checkbox', container).__events.vaChange({
        detail: { checked: true },
      });

      // Create a file
      const file = {
        file: new File(['hello'], 'hello.jpg', {
          name: 'hello.jpg',
          type: fileTypeSignatures.jpg.mime,
          size: 9999,
        }),
        docType: { value: 'L029', dirty: true },
        password: { value: '', dirty: false },
        isEncrypted: false,
      };

      rerenderWithRouter(
        rerender,
        <Provider store={getStore(false)}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={trackedItem}
            submitFilesLighthouse={submitFilesLighthouse}
            files={[file]}
            documentsUseLighthouse
          />
          ,
        </Provider>,
      );

      fireEvent.click($('.submit-files-button', container));
      expect(submitFilesLighthouse.called).to.be.true;
    });

    it('should reset uploads and set title on mount', () => {
      const trackedItem = {
        status: 'NEEDED_FROM_YOU',
        displayName: 'Testing',
      };
      const resetUploads = sinon.spy();
      const mainDiv = document.createElement('div');
      mainDiv.classList.add('va-nav-breadcrumbs');
      document.body.appendChild(mainDiv);
      renderWithRouter(
        <Provider store={uploadStore}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={trackedItem}
            resetUploads={resetUploads}
          />
        </Provider>,
      );

      expect(document.title).to.equal('Request for Testing | Veterans Affairs');
      expect(resetUploads.called).to.be.true;
    });

    it('should set details and go to files page if complete', () => {
      const trackedItem = {
        status: 'NEEDED_FROM_YOU',
        displayName: 'Testing',
      };
      const parameters = {
        id: 339,
      };
      const getClaim = sinon.spy();
      const navigate = sinon.spy();

      const { rerender } = renderWithRouter(
        <Provider store={getStore(false)}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={trackedItem}
            navigate={navigate}
            params={parameters}
            getClaim={getClaim}
          />
        </Provider>,
      );

      rerenderWithRouter(
        rerender,
        <Provider store={getStore(false)}>
          <DocumentRequestPage
            {...defaultProps}
            uploadComplete
            trackedItem={trackedItem}
            navigate={navigate}
            params={parameters}
            getClaim={getClaim}
          />
          ,
        </Provider>,
      );

      expect(getClaim.calledWith(1)).to.be.true;
      expect(navigate.calledWith('../files')).to.be.true;
    });
  });
});
