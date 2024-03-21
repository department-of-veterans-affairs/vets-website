import React from 'react';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import { Provider } from 'react-redux';

import { uploadStore } from '~/platform/forms-system/test/config/helpers';

import { AdditionalEvidencePageOld } from '../../containers/AdditionalEvidencePageOld';

const getRouter = () => ({ push: sinon.spy() });

const params = { id: 1 };

const claim = {
  id: 1,
  attributes: {},
};

describe('<AdditionalEvidencePageOld>', () => {
  it('should render loading div', () => {
    const tree = SkinDeep.shallowRender(
      <AdditionalEvidencePageOld params={params} loading />,
    );
    expect(tree.everySubTree('va-loading-indicator')).not.to.be.empty;
  });

  it('should render upload error alert', () => {
    const message = {
      title: 'test',
      body: 'test',
      type: 'error',
    };

    const tree = SkinDeep.shallowRender(
      <AdditionalEvidencePageOld
        params={params}
        claim={claim}
        message={message}
      />,
    );
    expect(tree.subTree('Notification')).not.to.be.false;
  });

  it('should clear upload error when leaving', () => {
    const message = {
      title: 'test',
      body: 'test',
      type: 'error',
    };
    const clearAdditionalEvidenceNotification = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AdditionalEvidencePageOld
        params={params}
        claim={claim}
        clearAdditionalEvidenceNotification={
          clearAdditionalEvidenceNotification
        }
        message={message}
      />,
    );
    expect(tree.subTree('Notification')).not.to.be.false;
    tree.getMountedInstance().componentWillUnmount();
    expect(clearAdditionalEvidenceNotification.called).to.be.true;
  });

  it('should not clear notification after completed upload', () => {
    const message = {
      title: 'test',
      body: 'test',
      type: 'error',
    };
    const clearAdditionalEvidenceNotification = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <AdditionalEvidencePageOld
        params={params}
        claim={claim}
        uploadComplete
        clearAdditionalEvidenceNotification={
          clearAdditionalEvidenceNotification
        }
        message={message}
      />,
    );
    expect(tree.subTree('Notification')).not.to.be.false;
    tree.getMountedInstance().componentWillUnmount();
    expect(clearAdditionalEvidenceNotification.called).to.be.false;
  });

  it('should handle submit files', () => {
    const files = [];
    const onSubmit = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <AdditionalEvidencePageOld
        params={params}
        claim={claim}
        files={files}
        submitFiles={onSubmit}
      />,
    );
    tree.subTree('AddFilesFormOld').props.onSubmit();
    expect(onSubmit.calledWith(1, null, files)).to.be.true;
  });

  it('should reset uploads and set title on mount', () => {
    const resetUploads = sinon.spy();
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('va-nav-breadcrumbs');
    document.body.appendChild(mainDiv);
    ReactTestUtils.renderIntoDocument(
      <Provider store={uploadStore}>
        <AdditionalEvidencePageOld
          params={params}
          claim={claim}
          files={[]}
          uploadField={{ value: null, dirty: false }}
          resetUploads={resetUploads}
        />
      </Provider>,
    );

    expect(document.title).to.equal('Additional Evidence');
    expect(resetUploads.called).to.be.true;
  });

  it('should set details and go to files page if complete', () => {
    const getClaim = sinon.spy();
    const resetUploads = sinon.spy();
    const router = getRouter();

    const tree = SkinDeep.shallowRender(
      <AdditionalEvidencePageOld
        params={params}
        claim={claim}
        files={[]}
        uploadComplete
        uploadField={{ value: null, dirty: false }}
        router={router}
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
