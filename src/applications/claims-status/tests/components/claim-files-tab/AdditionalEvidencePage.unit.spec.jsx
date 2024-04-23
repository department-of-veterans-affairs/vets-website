import React from 'react';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { uploadStore } from '~/platform/forms-system/test/config/helpers';

import { AdditionalEvidencePage } from '../../../components/claim-files-tab/AdditionalEvidencePage';
import * as AddFilesForm from '../../../components/claim-files-tab/AddFilesForm';
import { renderWithRouter } from '../../utils';

const getRouter = () => ({ push: sinon.spy() });

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

  context('when claim is open', () => {
    const params = { id: 1 };

    const claim = {
      id: 1,
      attributes: {
        status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
        closeDate: null,
      },
    };

    it('should render loading div', () => {
      const tree = SkinDeep.shallowRender(
        <AdditionalEvidencePage params={params} claim={claim} loading />,
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

    it('should render upload error alert when rerendered', () => {
      const { container, rerender } = render(
        <AdditionalEvidencePage
          params={params}
          claim={claim}
          filesNeeded={[]}
          filesOptional={[]}
          resetUploads={() => {}}
          clearAdditionalEvidenceNotification={() => {}}
        />,
      );
      expect($('va-alert', container)).not.to.exist;

      const message = {
        title: 'Error uploading',
        body: 'Internal server error',
        type: 'error',
      };

      rerender(
        <AdditionalEvidencePage
          params={params}
          claim={claim}
          message={message}
          filesNeeded={[]}
          filesOptional={[]}
          resetUploads={() => {}}
          clearAdditionalEvidenceNotification={() => {}}
        />,
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

      expect(resetUploads.called).to.be.true;
    });

    it('should set details and go to files page if complete', () => {
      const getClaim = sinon.spy();
      const resetUploads = sinon.spy();
      const navigate = sinon.spy();

      const tree = SkinDeep.shallowRender(
        <AdditionalEvidencePage
          params={params}
          claim={claim}
          files={[]}
          uploadComplete
          uploadField={{ value: null, dirty: false }}
          navigate={navigate}
          getClaim={getClaim}
          resetUploads={resetUploads}
          filesNeeded={[]}
          filesOptional={[]}
        />,
      );

      tree
        .getMountedInstance()
        .UNSAFE_componentWillReceiveProps({ uploadComplete: true });
      expect(getClaim.calledWith(1)).to.be.true;
      expect(navigate.calledWith('../files')).to.be.true;
    });

    it('shows va-alerts when files are needed', () => {
      const props = {
        claim,
        clearAdditionalEvidenceNotification: () => {},
        files: [],
        getClaim: () => {},
        params,
        resetUploads: () => {},
        router: getRouter(),
        uploadField: { value: null, dirty: false },
        filesNeeded: [],
        filesOptional: [],
      };
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

      const { container } = renderWithRouter(
        <AdditionalEvidencePage {...props} {...fileFormProps} />,
      );

      expect($('.primary-alert', container)).to.exist;
      expect($('.optional-alert', container)).to.exist;
    });

    it('doesn’t show va-alerts when no files are needed', () => {
      const props = {
        claim,
        clearAdditionalEvidenceNotification: () => {},
        files: [],
        getClaim: () => {},
        params,
        resetUploads: () => {},
        router: getRouter(),
        uploadField: { value: null, dirty: false },
        filesNeeded: [],
        filesOptional: [],
      };

      const { container } = render(<AdditionalEvidencePage {...props} />);

      expect($('.primary-alert', container)).not.to.exist;
      expect($('.optional-alert', container)).not.to.exist;
    });
  });

  context('when claim is closed', () => {
    const params = { id: 1 };

    const claim = {
      id: 1,
      attributes: {
        status: 'COMPLETE',
        closeDate: '01-01-2024',
      },
    };

    const resetUploads = sinon.spy();

    it('should render loading div', () => {
      const { container } = render(
        <AdditionalEvidencePage
          params={params}
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
        <AdditionalEvidencePage
          params={params}
          claim={claim}
          resetUploads={resetUploads}
          uploadComplete
        />,
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
