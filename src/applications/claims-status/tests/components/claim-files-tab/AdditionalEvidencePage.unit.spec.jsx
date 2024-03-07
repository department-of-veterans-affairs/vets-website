import React from 'react';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { uploadStore } from 'platform/forms-system/test/config/helpers';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { AdditionalEvidencePage } from '../../../components/claim-files-tab/AdditionalEvidencePage';
import * as AddFilesForm from '../../../components/claim-files-tab/AddFilesForm';

const getRouter = () => ({ push: sinon.spy() });

const params = { id: 1 };

const claim = {
  id: 1,
  attributes: {},
};

const fileFormProps = {
  addFile: () => {},
  cancelUpload: () => {},
  setFieldsDirty: () => {},
  updateField: () => {},
  removeFile: () => {},
  uploadField: {},
  files: [],
};

let stub;

describe('<AdditionalEvidencePage>', () => {
  beforeEach(() => {
    // Stubbing out AddFilesForm because we're not interested
    // in setting up all of the redux state needed to test it
    stub = sinon.stub(AddFilesForm, 'default');
    stub.returns(<div data-testid="add-files-form" />);
    stub.propTypes = {};
  });

  afterEach(() => {
    stub.restore();
  });
  it('should render loading div', () => {
    const tree = SkinDeep.shallowRender(
      <AdditionalEvidencePage params={params} loading />,
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
      <AdditionalEvidencePage
        params={params}
        claim={claim}
        message={message}
        filesNeeded={[]}
        filesOptional={[]}
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
      <AdditionalEvidencePage
        params={params}
        claim={claim}
        clearAdditionalEvidenceNotification={
          clearAdditionalEvidenceNotification
        }
        message={message}
        filesNeeded={[]}
        filesOptional={[]}
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
      <AdditionalEvidencePage
        params={params}
        claim={claim}
        uploadComplete
        clearAdditionalEvidenceNotification={
          clearAdditionalEvidenceNotification
        }
        message={message}
        filesNeeded={[]}
        filesOptional={[]}
      />,
    );
    expect(tree.subTree('Notification')).not.to.be.false;
    tree.getMountedInstance().componentWillUnmount();
    expect(clearAdditionalEvidenceNotification.called).to.be.false;
  });

  it('should handle submit files', () => {
    stub.restore();
    const files = [];
    const onSubmit = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <AdditionalEvidencePage
        params={params}
        claim={claim}
        files={files}
        submitFiles={onSubmit}
        filesNeeded={[]}
        filesOptional={[]}
        {...fileFormProps}
      />,
    );
    tree.subTree('AddFilesForm').props.onSubmit();
    expect(onSubmit.calledWith(1, null, files)).to.be.true;
  });

  it('should reset uploads and set title on mount', () => {
    const resetUploads = sinon.spy();
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('va-nav-breadcrumbs');
    document.body.appendChild(mainDiv);
    ReactTestUtils.renderIntoDocument(
      <Provider store={uploadStore}>
        <AdditionalEvidencePage
          params={params}
          claim={claim}
          files={[]}
          uploadField={{ value: null, dirty: false }}
          resetUploads={resetUploads}
          filesNeeded={[]}
          filesOptional={[]}
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
      <AdditionalEvidencePage
        params={params}
        claim={claim}
        files={[]}
        uploadComplete
        uploadField={{ value: null, dirty: false }}
        router={router}
        getClaimEVSS={getClaimEVSS}
        resetUploads={resetUploads}
        filesNeeded={[]}
        filesOptional={[]}
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
      filesNeeded: [],
      filesOptional: [],
    };

    it('calls getClaimLighthouse when enabled, doesnt show va-alerts', () => {
      // Reset sinon spies / set up props
      props.getClaimEVSS = sinon.spy();
      props.getClaimLighthouse = sinon.spy();
      props.useLighthouse = true;
      props.filesNeeded = [];
      props.filesOptional = [];

      const { rerender, container } = render(
        <AdditionalEvidencePage {...props} />,
      );

      // We want to trigger the 'UNSAFE_componentWillReceiveProps' method
      // which requires rerendering
      rerender(<AdditionalEvidencePage {...props} uploadComplete />);

      expect(props.getClaimEVSS.called).to.be.false;
      expect(props.getClaimLighthouse.called).to.be.true;
      expect($('.primary-alert', container)).not.to.exist;
      expect($('.optional-alert', container)).not.to.exist;
    });

    it('calls getClaimLighthouse when enabled, shows va-alerts', () => {
      // Reset sinon spies / set up props
      props.getClaimEVSS = sinon.spy();
      props.getClaimLighthouse = sinon.spy();
      props.useLighthouse = true;
      props.filesNeeded = [
        {
          id: 1,
          status: 'NEEDED_FROM_YOU',
          displayName: 'Test',
          description: 'Test',
          suspenseDate: '2024-02-01',
        },
      ];
      props.filesOptional = [
        {
          id: 2,
          status: 'NEEDED_FROM_OTHERS',
          displayName: 'Test',
          description: 'Test',
        },
      ];

      const { rerender, container } = render(
        <AdditionalEvidencePage {...props} {...fileFormProps} />,
      );

      // We want to trigger the 'UNSAFE_componentWillReceiveProps' method
      // which requires rerendering
      rerender(<AdditionalEvidencePage {...props} uploadComplete />);

      expect(props.getClaimEVSS.called).to.be.false;
      expect(props.getClaimLighthouse.called).to.be.true;
      // expect($('va-alert', container)).to.exist;
      expect($('.primary-alert', container)).to.exist;
      expect($('.optional-alert', container)).to.exist;
    });

    it('calls getClaimEVSS when disabled, doesnt show va-alerts', () => {
      // Reset sinon spies / set up props
      props.getClaimEVSS = sinon.spy();
      props.getClaimLighthouse = sinon.spy();
      props.useLighthouse = false;
      props.filesNeeded = [];
      props.filesOptional = [];

      const { rerender, container } = render(
        <AdditionalEvidencePage {...props} {...fileFormProps} />,
      );

      // We want to trigger the 'UNSAFE_componentWillReceiveProps' method
      // which requires rerendering
      rerender(<AdditionalEvidencePage {...props} uploadComplete />);

      expect(props.getClaimEVSS.called).to.be.true;
      expect(props.getClaimLighthouse.called).to.be.false;
      expect($('.primary-alert', container)).not.to.exist;
      expect($('.optional-alert', container)).not.to.exist;
    });

    it('calls getClaimEVSS when disabled, shows va-alerts', () => {
      // Reset sinon spies / set up props
      props.getClaimEVSS = sinon.spy();
      props.getClaimLighthouse = sinon.spy();
      props.useLighthouse = false;
      props.filesNeeded = [
        {
          id: 1,
          status: 'NEEDED',
          type: 'still_need_from_you_list',
          displayName: 'Test',
          description: 'Test',
          suspenseDate: '2024-02-01',
        },
      ];
      props.filesOptional = [
        {
          id: 2,
          status: 'NEEDED',
          type: 'still_need_from_others_list',
          displayName: 'Test',
          description: 'Test',
        },
      ];

      const { rerender, container } = render(
        <AdditionalEvidencePage {...props} {...fileFormProps} />,
      );

      // We want to trigger the 'UNSAFE_componentWillReceiveProps' method
      // which requires rerendering
      rerender(<AdditionalEvidencePage {...props} uploadComplete />);

      expect(props.getClaimEVSS.called).to.be.true;
      expect(props.getClaimLighthouse.called).to.be.false;
      expect($('.primary-alert', container)).to.exist;
      expect($('.optional-alert', container)).to.exist;
    });
  });
  // END lighthouse_migration
});
