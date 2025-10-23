/**
 * Note: Most functional testing is in E2E tests (10.va-file-input-multiple.cypress.spec.js)
 * due to va-file-input-multiple web component using shadow DOM.
 * These unit tests focus on basic component structure and static content.
 */

import React from 'react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import sinon from 'sinon';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import {
  SUBMIT_TEXT,
  SUBMIT_FILES_FOR_REVIEW_TEXT,
  SEND_YOUR_DOCUMENTS_TEXT,
  ANCHOR_LINKS,
} from '../../../constants';

import AddFilesForm from '../../../components/claim-files-tab/AddFilesForm';

// Updated props for va-file-input-multiple implementation
const fileFormProps = {
  onSubmit: () => {},
  onCancel: () => {},
  uploading: false,
  progress: 0,
};

describe('<AddFilesForm>', () => {
  it('should render component', () => {
    const initialState = {
      featureToggles: {
        // eslint-disable-next-line camelcase
        cst_show_document_upload_status: false,
        loading: false,
      },
    };

    const { container } = renderInReduxProvider(
      <AddFilesForm {...fileFormProps} />,
      { initialState },
    );

    expect($('.add-files-form', container)).to.exist;
    expect($('va-file-input-multiple', container)).to.exist;
  });

  describe('cstShowDocumentUploadStatus is false', () => {
    const initialState = {
      featureToggles: {
        // eslint-disable-next-line camelcase
        cst_show_document_upload_status: false,
        loading: false,
      },
    };

    it('should render submit button', () => {
      const { container } = renderInReduxProvider(
        <AddFilesForm {...fileFormProps} />,
        { initialState },
      );
      const submitButton = $('va-button', container);
      expect(submitButton).to.exist;
      expect(submitButton.getAttribute('text')).to.equal(SUBMIT_TEXT);
    });

    it('should render upload modal when uploading', () => {
      const { container } = renderInReduxProvider(
        <AddFilesForm {...fileFormProps} uploading />,
        { initialState },
      );
      expect($('va-modal', container)).to.exist;
    });

    it('should include mail info additional info', () => {
      const { container } = renderInReduxProvider(
        <AddFilesForm {...fileFormProps} />,
        { initialState },
      );
      // Check for the va-additional-info component
      const additionalInfo = $('va-additional-info', container);
      expect(additionalInfo).to.exist;
      expect(additionalInfo.getAttribute('trigger')).to.equal(
        'Need to mail your documents?',
      );

      // Check for the mail info content (which is in slot content)
      const mailContent = $('.vads-u-margin-y--3', container);
      expect(mailContent).to.exist;
    });

    it('should handle submit button click', () => {
      const onSubmit = sinon.spy();
      const { container } = renderInReduxProvider(
        <AddFilesForm {...fileFormProps} onSubmit={onSubmit} />,
        { initialState },
      );

      const submitButton = $('va-button', container);
      submitButton.click();
      // Since no files are present, onSubmit should not be called
      expect(onSubmit.called).to.be.false;
    });

    it('should render updated file input section ui', () => {
      const { getByText } = renderInReduxProvider(
        <AddFilesForm {...fileFormProps} />,
        { initialState },
      );
      getByText('Upload documents');
      getByText('If you have a document to upload, you can do that here.');
    });

    it('should not render heading section when it is rendered in file tab', () => {
      const { queryByText } = renderInReduxProvider(
        <AddFilesForm {...fileFormProps} fileTab />,
        { initialState },
      );
      expect(queryByText('Upload documents')).to.be.null;
      expect(
        queryByText('If you have a document to upload, you can do that here.'),
      ).to.be.null;
    });
  });

  describe('cstShowDocumentUploadStatus is true', () => {
    const initialState = {
      featureToggles: {
        // eslint-disable-next-line camelcase
        cst_show_document_upload_status: true,
        loading: false,
      },
    };

    it('should render submit button', () => {
      const { container } = renderInReduxProvider(
        <AddFilesForm {...fileFormProps} />,
        { initialState },
      );
      const submitButton = $('va-button', container);
      expect(submitButton).to.exist;
      expect(submitButton.getAttribute('text')).to.equal(
        SUBMIT_FILES_FOR_REVIEW_TEXT,
      );
    });

    it('should render va-link with correct href and text rather than va-additional-info', () => {
      const { container } = renderInReduxProvider(
        <AddFilesForm {...fileFormProps} />,
        { initialState },
      );
      const additionalInfo = $('va-additional-info', container);
      expect(additionalInfo).to.be.null;
      const vaLink = $('va-link', container);
      expect(vaLink).to.exist;
      expect(vaLink.getAttribute('href')).to.equal(
        `#${ANCHOR_LINKS.otherWaysToSendDocuments}`,
      );
      expect(vaLink.getAttribute('text')).to.equal(SEND_YOUR_DOCUMENTS_TEXT);
    });
  });
});
