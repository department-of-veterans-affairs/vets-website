import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';

import { uploadStore } from 'platform/forms-system/test/config/helpers';

import { DocumentRequestPage } from '../../containers/DocumentRequestPage';

const claim = {
  id: 1,
  attributes: {},
};

const params = { id: 1 };

const getRouter = () => ({
  push: sinon.spy(),
  replace: sinon.spy(),
});

describe('<DocumentRequestPage>', () => {
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

  it('should reset uploads and set title on mount', () => {
    const trackedItem = {
      status: 'NEEDED_FROM_YOU',
      displayName: 'Testing',
    };
    const resetUploads = sinon.spy();
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('va-nav-breadcrumbs');
    document.body.appendChild(mainDiv);
    ReactTestUtils.renderIntoDocument(
      <Provider store={uploadStore}>
        <DocumentRequestPage
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
    const router = getRouter();
    const parameters = {
      id: 339,
    };
    const getClaim = sinon.spy();
    const resetUploads = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <DocumentRequestPage
        claim={claim}
        files={[]}
        uploadComplete
        uploadField={{ value: null, dirty: false }}
        trackedItem={trackedItem}
        router={router}
        params={parameters}
        getClaim={getClaim}
        resetUploads={resetUploads}
      />,
    );

    tree
      .getMountedInstance()
      .UNSAFE_componentWillReceiveProps({ uploadComplete: true });
    expect(getClaim.calledWith(1)).to.be.true;
    expect(router.push.calledWith('your-claims/1/files')).to.be.true;
  });
});
