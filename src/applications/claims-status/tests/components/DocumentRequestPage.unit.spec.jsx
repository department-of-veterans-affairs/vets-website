import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { fileTypeSignatures } from '~/platform/forms-system/src/js/utilities/file';
import { uploadStore } from '~/platform/forms-system/test/config/helpers';

import { DocumentRequestPage } from '../../containers/DocumentRequestPage';
import { renderWithRouter, rerenderWithRouter } from '../utils';

const claim = {
  id: 1,
  attributes: {},
};

const params = { id: 1 };

describe('<DocumentRequestPage>', () => {
  it('when component mounts should set document title', () => {
    renderWithRouter(
      <DocumentRequestPage
        params={params}
        resetUploads={() => {}}
        clearNotification={() => {}}
        loading
      />,
    );

    expect(document.title).to.equal('Document Request');
  });

  it('when component mounts should set document title', async () => {
    const trackedItem = {
      status: 'NEEDED_FROM_YOU',
      displayName: 'Testing',
    };

    const { container, rerender } = renderWithRouter(
      <DocumentRequestPage
        params={params}
        trackedItem={trackedItem}
        resetUploads={() => {}}
        clearNotification={() => {}}
        loading
        navigate={() => {}}
        uploadField={{ value: null, dirty: false }}
        files={[]}
      />,
    );

    rerenderWithRouter(
      rerender,
      <DocumentRequestPage
        params={params}
        trackedItem={trackedItem}
        resetUploads={() => {}}
        clearNotification={() => {}}
        loading={false}
        navigate={() => {}}
        uploadField={{ value: null, dirty: false }}
        files={[]}
      />,
    );

    await waitFor(() => {
      expect(document.activeElement).to.equal($('va-breadcrumbs', container));
    });
  });

  it('should render loading div', () => {
    const tree = SkinDeep.shallowRender(
      <DocumentRequestPage params={params} loading />,
    );
    expect(tree.everySubTree('va-loading-indicator')).not.to.be.empty;
    expect(tree.everySubTree('.claim-container')).to.be.empty;
  });

  it('should render upload error alert', () => {
    const trackedItem = {
      status: 'NEEDED_FROM_YOU',
    };
    const message = {
      title: 'Test',
      body: 'Testing',
    };

    const tree = SkinDeep.shallowRender(
      <DocumentRequestPage
        params={params}
        trackedItem={trackedItem}
        claim={claim}
        message={message}
      />,
    );
    expect(tree.subTree('Notification')).not.to.be.false;
  });

  it('should render upload error alert when rerendered', () => {
    const trackedItem = {
      status: 'NEEDED_FROM_YOU',
    };

    const { container, rerender } = renderWithRouter(
      <DocumentRequestPage
        params={params}
        trackedItem={trackedItem}
        claim={claim}
        uploadField={{ value: null, dirty: false }}
        files={[]}
        resetUploads={() => {}}
        clearNotification={() => {}}
      />,
    );
    expect($('va-alert', container)).not.to.exist;

    const message = {
      title: 'Test',
      body: 'Testing',
    };

    rerenderWithRouter(
      rerender,
      <DocumentRequestPage
        params={params}
        trackedItem={trackedItem}
        claim={claim}
        uploadField={{ value: null, dirty: false }}
        resetUploads={() => {}}
        files={[]}
        message={message}
        clearNotification={() => {}}
      />,
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

    const tree = SkinDeep.shallowRender(
      <DocumentRequestPage
        params={params}
        trackedItem={trackedItem}
        claim={claim}
        clearNotification={clearNotification}
        message={message}
      />,
    );
    expect(tree.subTree('Notification')).not.to.be.false;
    tree.getMountedInstance().componentWillUnmount();
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

    const tree = SkinDeep.shallowRender(
      <DocumentRequestPage
        params={params}
        trackedItem={trackedItem}
        claim={claim}
        uploadComplete
        clearNotification={clearNotification}
        message={message}
      />,
    );
    expect(tree.subTree('Notification')).not.to.be.false;
    tree.getMountedInstance().componentWillUnmount();
    expect(clearNotification.called).to.be.false;
  });

  it('should render due date info', () => {
    const trackedItem = {
      status: 'NEEDED_FROM_YOU',
      suspenseDate: '2010-05-10',
    };

    const tree = SkinDeep.shallowRender(
      <DocumentRequestPage
        params={params}
        claim={claim}
        trackedItem={trackedItem}
      />,
    );

    expect(tree.subTree('DueDateOld')).not.to.be.false;
    expect(tree.subTree('DueDateOld').props.date).to.eql(
      trackedItem.suspenseDate,
    );
  });

  it('should render optional upload alert', () => {
    const trackedItem = {
      status: 'NEEDED_FROM_OTHERS',
      suspenseDate: '2010-05-10',
    };

    const tree = SkinDeep.shallowRender(
      <DocumentRequestPage
        params={params}
        claim={claim}
        trackedItem={trackedItem}
      />,
    );

    expect(tree.subTree('.optional-upload')).not.to.be.false;
  });

  it('should handle submit files', () => {
    const trackedItem = {
      status: 'NEEDED_FROM_YOU',
      suspenseDate: '2010-05-10',
    };
    const onSubmit = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <DocumentRequestPage
        params={params}
        claim={claim}
        trackedItem={trackedItem}
        submitFiles={onSubmit}
      />,
    );
    tree.subTree('AddFilesFormOld').props.onSubmit();
    expect(onSubmit.called).to.be.true;
  });

  it('should handle submit files lighthouse', () => {
    const submitFilesLighthouse = sinon.spy();

    const trackedItem = {
      status: 'NEEDED_FROM_YOU',
      suspenseDate: '2010-05-10',
    };
    const { container, rerender } = renderWithRouter(
      <DocumentRequestPage
        params={params}
        claim={claim}
        trackedItem={trackedItem}
        submitFilesLighthouse={submitFilesLighthouse}
        uploadField={{ value: null, dirty: false }}
        documentsUseLighthouse
        files={[]}
        clearNotification={() => {}}
        resetUploads={() => {}}
      />,
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
      <DocumentRequestPage
        params={params}
        claim={claim}
        trackedItem={trackedItem}
        submitFilesLighthouse={submitFilesLighthouse}
        uploadField={{ value: null, dirty: false }}
        resetUploads={() => {}}
        files={[file]}
        documentsUseLighthouse
        clearNotification={() => {}}
      />,
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
          clearNotification={() => {}}
          params={params}
          claim={claim}
          files={[]}
          uploadField={{ value: null, dirty: false }}
          trackedItem={trackedItem}
          resetUploads={resetUploads}
        />
      </Provider>,
    );

    expect(document.title).to.equal('Request for Testing');
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

    const tree = SkinDeep.shallowRender(
      <DocumentRequestPage
        claim={claim}
        files={[]}
        uploadComplete
        uploadField={{ value: null, dirty: false }}
        trackedItem={trackedItem}
        navigate={navigate}
        params={parameters}
        getClaim={getClaim}
        resetUploads={() => {}}
      />,
    );

    tree
      .getMountedInstance()
      .UNSAFE_componentWillReceiveProps({ uploadComplete: true });
    expect(getClaim.calledWith(1)).to.be.true;
    expect(navigate.calledWith('../files')).to.be.true;
  });
});
