import React from 'react';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { uploadStore } from 'platform/forms-system/test/config/helpers';
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
    const getClaimEVSS = sinon.spy();
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
        getClaimEVSS={getClaimEVSS}
        resetUploads={resetUploads}
      />,
    );

    tree
      .getMountedInstance()
      .UNSAFE_componentWillReceiveProps({ uploadComplete: true });
    expect(getClaimEVSS.calledWith(1)).to.be.true;
    expect(router.push.calledWith('your-claims/1/files')).to.be.true;
  });

  // START lighthouse_migration
  context('cst_use_lighthouse feature toggle', () => {
    const props = {
      claim,
      files: [],
      params,
      resetUploads: () => {},
      router: getRouter(),
      uploadField: { value: null, dirty: false },
    };

    it('calls getClaimLighthouse when enabled', () => {
      // Reset sinon spies / set up props
      props.getClaimEVSS = sinon.spy();
      props.getClaimLighthouse = sinon.spy();
      props.useLighthouse = true;

      const { rerender } = render(<AdditionalEvidencePageOld {...props} />);

      // We want to trigger the 'UNSAFE_componentWillReceiveProps' method
      // which requires rerendering
      rerender(<AdditionalEvidencePageOld {...props} uploadComplete />);

      expect(props.getClaimEVSS.called).to.be.false;
      expect(props.getClaimLighthouse.called).to.be.true;
    });

    it('calls getClaimEVSS when disabled', () => {
      // Reset sinon spies / set up props
      props.getClaimEVSS = sinon.spy();
      props.getClaimLighthouse = sinon.spy();
      props.useLighthouse = false;

      const { rerender } = render(<AdditionalEvidencePageOld {...props} />);

      // We want to trigger the 'UNSAFE_componentWillReceiveProps' method
      // which requires rerendering
      rerender(<AdditionalEvidencePageOld {...props} uploadComplete />);

      expect(props.getClaimEVSS.called).to.be.true;
      expect(props.getClaimLighthouse.called).to.be.false;
    });
  });
  // END lighthouse_migration
});
