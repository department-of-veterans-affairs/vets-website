/**
 * Note: Most functional testing is in E2E tests (10.va-file-input-multiple.cypress.spec.js)
 * due to va-file-input-multiple web component using shadow DOM.
 * These unit tests focus on basic component structure and static content.
 */

import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import sinon from 'sinon';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import AddFilesForm from '../../../components/claim-files-tab/AddFilesForm';

// Updated props for va-file-input-multiple implementation
const fileFormProps = {
  onSubmit: () => {},
  onCancel: () => {},
  uploading: false,
  progress: 0,
};

describe('<AddFilesForm>', () => {
  const getStore = (cstFriendlyEvidenceRequests = true) =>
    createStore(() => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        cst_friendly_evidence_requests: cstFriendlyEvidenceRequests,
      },
    }));

  it('should render component', () => {
    const { container } = render(
      <Provider store={getStore(false)}>
        <AddFilesForm {...fileFormProps} />
      </Provider>,
    );

    expect($('.add-files-form', container)).to.exist;
    expect($('va-file-input-multiple', container)).to.exist;
  });

  it('should render submit button', () => {
    const { container } = render(
      <Provider store={getStore(false)}>
        <AddFilesForm {...fileFormProps} />
      </Provider>,
    );

    const submitButton = $('va-button', container);
    expect(submitButton).to.exist;
    expect(submitButton.getAttribute('text')).to.equal(
      'Submit documents for review',
    );
  });

  it('should render upload modal when uploading', () => {
    const { container } = render(
      <Provider store={getStore(false)}>
        <AddFilesForm {...fileFormProps} uploading />
      </Provider>,
    );
    expect($('va-modal', container)).to.exist;
  });

  it('should include mail info additional info', () => {
    const { container } = render(
      <Provider store={getStore(false)}>
        <AddFilesForm {...fileFormProps} />
      </Provider>,
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
    const { container } = render(
      <Provider store={getStore(false)}>
        <AddFilesForm {...fileFormProps} onSubmit={onSubmit} />
      </Provider>,
    );

    const submitButton = $('va-button', container);
    submitButton.click();
    // Since no files are present, onSubmit should not be called
    expect(onSubmit.called).to.be.false;
  });

  context('when cstFriendlyEvidenceRequests is true', () => {
    it('should render updated file input section ui', () => {
      const { getByText } = render(
        <Provider store={getStore()}>
          <AddFilesForm {...fileFormProps} />
        </Provider>,
      );
      getByText('Upload documents');
      getByText('If you have a document to upload, you can do that here.');
    });
    it('should not render heading section when it is rendered in file tab', () => {
      const { queryByText } = render(
        <Provider store={getStore()}>
          <AddFilesForm {...fileFormProps} fileTab />
        </Provider>,
      );
      expect(queryByText('Upload documents')).to.be.null;
      expect(
        queryByText('If you have a document to upload, you can do that here.'),
      ).to.be.null;
    });
  });
});
