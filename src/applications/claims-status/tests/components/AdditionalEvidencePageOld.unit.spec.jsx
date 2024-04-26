import React from 'react';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { uploadStore } from '~/platform/forms-system/test/config/helpers';

import { AdditionalEvidencePageOld } from '../../containers/AdditionalEvidencePageOld';
import { renderWithRouter, rerenderWithRouter } from '../utils';

describe('<AdditionalEvidencePageOld>', () => {
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
        <AdditionalEvidencePageOld params={params} claim={claim} loading />,
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

    it('should render upload error alert when rerendered', () => {
      const { container, rerender } = renderWithRouter(
        <AdditionalEvidencePageOld
          params={params}
          claim={claim}
          files={[]}
          filesNeeded={[]}
          filesOptional={[]}
          resetUploads={() => {}}
          clearAdditionalEvidenceNotification={() => {}}
          setFieldsDirty={() => {}}
          uploadField={{ value: null, dirty: false }}
        />,
      );
      // Displays warning alert saying "Please only submit additional evidence that supports this claim"
      expect($$('va-alert', container).length).to.equal(1);

      const message = {
        title: 'Error uploading',
        body: 'Internal server error',
        type: 'error',
      };

      rerenderWithRouter(
        rerender,
        <AdditionalEvidencePageOld
          params={params}
          claim={claim}
          files={[]}
          message={message}
          filesNeeded={[]}
          filesOptional={[]}
          resetUploads={() => {}}
          clearAdditionalEvidenceNotification={() => {}}
          setFieldsDirty={() => {}}
          uploadField={{ value: null, dirty: false }}
        />,
      );
      expect($$('va-alert', container).length).to.equal(2);
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
      renderWithRouter(
        <Provider store={uploadStore}>
          <AdditionalEvidencePageOld
            clearAdditionalEvidenceNotification={() => {}}
            params={params}
            claim={claim}
            files={[]}
            resetUploads={resetUploads}
            uploadField={{ value: null, dirty: false }}
          />
        </Provider>,
      );

      expect(resetUploads.called).to.be.true;
    });

    it('should set details and go to files page if complete', () => {
      const getClaim = sinon.spy();
      const navigate = sinon.spy();

      const tree = SkinDeep.shallowRender(
        <AdditionalEvidencePageOld
          params={params}
          claim={claim}
          files={[]}
          uploadComplete
          uploadField={{ value: null, dirty: false }}
          getClaim={getClaim}
          navigate={navigate}
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
});
