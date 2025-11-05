import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { waitFor } from '@testing-library/react';
import { createStore } from 'redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { uploadStore } from '~/platform/forms-system/test/config/helpers';

import { DocumentRequestPage } from '../../containers/DocumentRequestPage';
import {
  renderWithRouter,
  rerenderWithRouter,
  renderWithCustomStore,
} from '../utils';

const claim = {
  id: 1,
  attributes: {
    description: 'Test',
    displayName: 'Test description',
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    closeDate: null,
    claimPhaseDates: {
      latestPhaseType: 'GATHERING_OF_EVIDENCE',
    },
    trackedItem: [],
  },
};

const params = { id: 1, trackedItemId: 467558 };

const defaultProps = {
  claim,
  params,
  resetUploads: () => {},
  clearNotification: () => {},
  loading: false,
  navigate: () => {},
};

describe('<DocumentRequestPage>', () => {
  const getStore = () =>
    createStore(() => ({
      disability: {
        status: {
          claimAsk: {
            decisionRequested: false,
            decisionRequestError: false,
            loadingDecisionRequest: false,
          },
        },
      },
    }));

  const createBasicTrackedItem = overrides => ({
    status: 'NEEDED_FROM_YOU',
    displayName: 'Testing',
    suspenseDate: '2024-12-31',
    requestedDate: '2024-01-01',
    ...overrides,
  });

  const createTestMessage = overrides => ({
    title: 'Test',
    body: 'Testing',
    ...overrides,
  });

  const renderPage = (props = {}, store = getStore()) => {
    return renderWithCustomStore(
      <DocumentRequestPage {...defaultProps} {...props} />,
      store,
    );
  };

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
    expect($('#default-5103-notice-page', container)).to.exist;
    const breadcrumbs = $('va-breadcrumbs', container);
    expect(breadcrumbs.breadcrumbList[3].href).to.equal(
      `../needed-from-you/${trackedItem.id}`,
    );
    expect(breadcrumbs.breadcrumbList[3].label).to.equal(
      'Review evidence list (5103 notice)',
    );
    expect(document.title).to.equal(
      'Review evidence list (5103 notice) | Veterans Affairs',
    );
  });

  it('should not render Default5103EvidenceNotice component when item is a not a 5103 notice', () => {
    const trackedItem = {
      closedDate: null,
      description: 'Buddy statement text',
      displayName: 'Submit buddy statement(s)',
      friendlyName: 'Buddy statement',
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
    expect($('#default-5103-notice-page', container)).to.not.exist;
    const breadcrumbs = $('va-breadcrumbs', container);
    expect(breadcrumbs.breadcrumbList[3].href).to.equal(
      `../needed-from-you/${trackedItem.id}`,
    );
    expect(breadcrumbs.breadcrumbList[3].label).to.equal(
      trackedItem.friendlyName,
    );
    expect(document.title).to.equal(
      `${trackedItem.friendlyName} | Veterans Affairs`,
    );
  });

  it('when loading is true should set document title to Document Request | Veterans Affairs', () => {
    renderWithRouter(
      <Provider store={getStore()}>
        <DocumentRequestPage {...defaultProps} loading />,
      </Provider>,
    );

    expect(document.title).to.equal('Document Request | Veterans Affairs');
  });
  it('when component mounts should scroll to h1', async () => {
    const trackedItem = {
      status: 'NEEDED_FROM_YOU',
      displayName: 'Testing',
    };

    const { container, rerender } = renderWithRouter(
      <Provider store={getStore()}>
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
      <Provider store={getStore()}>
        <DocumentRequestPage {...defaultProps} trackedItem={trackedItem} />,
      </Provider>,
    );

    await waitFor(() => {
      expect(document.activeElement).to.equal($('h1', container));
    });
  });
  it('when component mounts without sessionStorage previousPage value should set previous breadcrumb to status', () => {
    const trackedItem = {
      status: 'NEEDED_FROM_YOU',
      displayName: 'Testing',
    };

    const { container } = renderWithRouter(
      <Provider store={getStore()}>
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
      <Provider store={getStore()}>
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
      <Provider store={getStore()}>
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
      <Provider store={getStore()}>
        <DocumentRequestPage {...defaultProps} loading />,
      </Provider>,
    );

    expect($('va-loading-indicator', context)).to.exist;
    expect($('.claim-container', context)).to.not.exist;
  });
  it('should render upload error alert', () => {
    const trackedItem = createBasicTrackedItem();
    const message = createTestMessage();

    const { context } = renderPage({ trackedItem, message });
    expect($('.claims-alert', context)).to.exist;
  });
  it('should render upload error alert when rerendered', () => {
    const trackedItem = createBasicTrackedItem();

    const { container, rerender } = renderPage({ trackedItem });
    expect($('.claims-alert', container)).not.to.exist;

    const message = createTestMessage();

    rerenderWithRouter(
      rerender,
      <Provider store={getStore()}>
        <DocumentRequestPage
          {...defaultProps}
          trackedItem={trackedItem}
          message={message}
        />
        ,
      </Provider>,
    );
    expect($('.claims-alert', container)).to.exist;
    expect($('.claims-alert h2', container).textContent).to.equal(
      message.title,
    );
  });
  it('should not clear notification after completed upload', () => {
    const trackedItem = createBasicTrackedItem();
    const message = createTestMessage({
      title: 'test',
      body: 'test',
      type: 'error',
    });
    const clearNotification = sinon.spy();

    const { context } = renderPage({
      trackedItem,
      clearNotification,
      message,
    });

    expect($('.claims-alert', context)).to.exist;
    expect(clearNotification.called).to.be.false;
  });
  it('should render optional upload alert', () => {
    const trackedItem = {
      status: 'NEEDED_FROM_OTHERS',
      suspenseDate: '2010-05-10',
      displayName: 'test item',
    };
    const { context } = renderWithRouter(
      <Provider store={getStore()}>
        <DocumentRequestPage {...defaultProps} trackedItem={trackedItem} />,
      </Provider>,
    );

    expect($('.optional-upload', context)).to.exist;
  });

  it('should render file upload form when trackedItem.canUploadFile is true', () => {
    const trackedItem = {
      status: 'NEEDED_FROM_YOU',
      suspenseDate: '2010-05-10',
      displayName: 'Testing',
      canUploadFile: true,
    };
    const { container } = renderWithRouter(
      <Provider store={getStore()}>
        <DocumentRequestPage {...defaultProps} trackedItem={trackedItem} />,
      </Provider>,
    );

    // Verify the file upload form components are rendered
    expect($('va-file-input-multiple', container)).to.exist;
    expect($('va-button', container)).to.exist;
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

    expect(document.title).to.equal('Request for evidence | Veterans Affairs');
    expect(resetUploads.called).to.be.true;
  });

  it('should set details and go to status page if complete when feature flag is enabled', () => {
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
      <Provider store={getStore()}>
        <DocumentRequestPage
          {...defaultProps}
          trackedItem={trackedItem}
          navigate={navigate}
          params={parameters}
          getClaim={getClaim}
          showDocumentUploadStatus
        />
      </Provider>,
    );

    rerenderWithRouter(
      rerender,
      <Provider store={getStore()}>
        <DocumentRequestPage
          {...defaultProps}
          uploadComplete
          trackedItem={trackedItem}
          navigate={navigate}
          params={parameters}
          getClaim={getClaim}
          showDocumentUploadStatus
        />
        ,
      </Provider>,
    );

    expect(getClaim.calledWith(1)).to.be.true;
    expect(navigate.calledWith('../status')).to.be.true;
  });

  it('should set details and go to files page if complete when feature flag is disabled', () => {
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
      <Provider store={getStore()}>
        <DocumentRequestPage
          {...defaultProps}
          trackedItem={trackedItem}
          navigate={navigate}
          params={parameters}
          getClaim={getClaim}
          showDocumentUploadStatus={false}
        />
      </Provider>,
    );

    rerenderWithRouter(
      rerender,
      <Provider store={getStore()}>
        <DocumentRequestPage
          {...defaultProps}
          uploadComplete
          trackedItem={trackedItem}
          navigate={navigate}
          params={parameters}
          getClaim={getClaim}
          showDocumentUploadStatus={false}
        />
        ,
      </Provider>,
    );

    expect(getClaim.calledWith(1)).to.be.true;
    expect(navigate.calledWith('../files')).to.be.true;
  });

  context('when friendlyName exists in track Item', () => {
    it('should render friendlyName in  breadcrumb', () => {
      const item = {
        closedDate: null,
        description: '21-4142 text',
        displayName: '21-4142/21-4142a',
        friendlyName: 'Authorization to Disclose Information',
        activityDescription: 'good description',
        canUploadFile: true,
        supportAliases: ['VA Form 21-4142'],
        id: 467558,
        overdue: true,
        receivedDate: null,
        requestedDate: '2024-03-07',
        status: 'NEEDED_FROM_YOU',
        suspenseDate: '2024-05-07',
        uploadsAllowed: true,
        documents: [],
        date: '2024-03-07',
      };

      const { container } = renderWithRouter(
        <Provider store={getStore()}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={item}
            friendlyEvidenceRequests
          />
          ,
        </Provider>,
      );
      const breadcrumbs = $('va-breadcrumbs', container);
      expect(breadcrumbs.breadcrumbList[3].href).to.equal(
        `../needed-from-you/${item.id}`,
      );
      expect(breadcrumbs.breadcrumbList[3].label).to.equal(
        'Authorization to Disclose Information',
      );
      expect(document.title).to.equal(
        'Authorization to Disclose Information | Veterans Affairs',
      );
    });

    it('should render Your {friendlyName} in breadcrumb for third party request', () => {
      const item = {
        closedDate: null,
        description: 'reserve record',
        displayName: 'RV1 - Reserve Records Request',
        friendlyName: 'Reserve records',
        activityDescription: 'good description',
        canUploadFile: true,
        supportAliases: ['RV1 - Reserve Records Request'],
        id: 467558,
        overdue: true,
        receivedDate: null,
        requestedDate: '2024-03-07',
        status: 'NEEDED_FROM_OTHERS',
        suspenseDate: '2024-05-07',
        uploadsAllowed: true,
        documents: [],
        date: '2024-03-07',
      };

      const { container } = renderWithRouter(
        <Provider store={getStore()}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={item}
            friendlyEvidenceRequests
          />
          ,
        </Provider>,
      );
      const breadcrumbs = $('va-breadcrumbs', container);
      expect(breadcrumbs.breadcrumbList[3].href).to.equal(
        `../needed-from-others/${item.id}`,
      );
      expect(breadcrumbs.breadcrumbList[3].label).to.equal(
        'Your reserve records',
      );
      expect(document.title).to.equal(
        'Your reserve records | Veterans Affairs',
      );
    });
    it('should render Request for evidence in breadcrumb for first party request with default content', () => {
      const item = {
        closedDate: null,
        description: 'default content',
        displayName: 'First party default request',
        id: 467558,
        overdue: true,
        receivedDate: null,
        requestedDate: '2024-03-21',
        status: 'NEEDED_FROM_YOU',
        suspenseDate: '2024-05-07',
        uploadsAllowed: true,
        documents: [],
        date: '2024-03-21',
      };

      const { container } = renderWithRouter(
        <Provider store={getStore()}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={item}
            friendlyEvidenceRequests
          />
          ,
        </Provider>,
      );
      const breadcrumbs = $('va-breadcrumbs', container);
      expect(breadcrumbs.breadcrumbList[3].href).to.equal(
        `../needed-from-you/${item.id}`,
      );
      expect(breadcrumbs.breadcrumbList[3].label).to.equal(
        'Request for evidence',
      );
      expect(document.title).to.equal(
        'Request for evidence | Veterans Affairs',
      );
    });
    it('should render Request for evidence outside VA in breadcrumb for third party non DBQ request with default content', () => {
      const item = {
        closedDate: null,
        description: 'default content',
        displayName: 'Third party default request',
        id: 467558,
        overdue: true,
        receivedDate: null,
        requestedDate: '2024-03-28',
        status: 'NEEDED_FROM_OTHERS',
        suspenseDate: '2024-05-07',
        uploadsAllowed: true,
        documents: [],
        date: '2024-03-21',
      };

      const { container } = renderWithRouter(
        <Provider store={getStore()}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={item}
            friendlyEvidenceRequests
          />
          ,
        </Provider>,
      );
      const breadcrumbs = $('va-breadcrumbs', container);
      expect(breadcrumbs.breadcrumbList[3].href).to.equal(
        `../needed-from-others/${item.id}`,
      );
      expect(breadcrumbs.breadcrumbList[3].label).to.equal(
        'Request for evidence outside VA',
      );
      expect(document.title).to.equal(
        'Request for evidence outside VA | Veterans Affairs',
      );
    });
    it('should render Request for an exam in breadcrumb for third party DBQ request with default content', () => {
      const item = {
        closedDate: null,
        description: 'default content',
        displayName: 'Third party DBQ default request',
        id: 467558,
        overdue: true,
        receivedDate: null,
        requestedDate: '2024-03-28',
        status: 'NEEDED_FROM_OTHERS',
        suspenseDate: '2024-05-07',
        uploadsAllowed: true,
        documents: [],
        date: '2024-03-21',
      };

      const { container } = renderWithRouter(
        <Provider store={getStore()}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={item}
            friendlyEvidenceRequests
          />
          ,
        </Provider>,
      );
      const breadcrumbs = $('va-breadcrumbs', container);
      expect(breadcrumbs.breadcrumbList[3].href).to.equal(
        `../needed-from-others/${item.id}`,
      );
      expect(breadcrumbs.breadcrumbList[3].label).to.equal(
        'Request for an exam',
      );
      expect(document.title).to.equal('Request for an exam | Veterans Affairs');
    });
    it('should render Request for an exam in breadcrumb for third party DBQ request with override content', () => {
      const item = {
        closedDate: null,
        description: 'default content',
        displayName: 'Third party DBQ override request',
        friendlyName: 'Friendly DBQ',
        id: 467558,
        overdue: true,
        receivedDate: null,
        requestedDate: '2024-03-28',
        status: 'NEEDED_FROM_OTHERS',
        suspenseDate: '2024-05-07',
        uploadsAllowed: true,
        documents: [],
        date: '2024-03-21',
      };

      const { container } = renderWithRouter(
        <Provider store={getStore()}>
          <DocumentRequestPage
            {...defaultProps}
            trackedItem={item}
            friendlyEvidenceRequests
          />
          ,
        </Provider>,
      );
      const breadcrumbs = $('va-breadcrumbs', container);
      expect(breadcrumbs.breadcrumbList[3].href).to.equal(
        `../needed-from-others/${item.id}`,
      );
      expect(breadcrumbs.breadcrumbList[3].label).to.equal(
        'Request for an exam',
      );
      expect(document.title).to.equal('Request for an exam | Veterans Affairs');
    });
  });
});
