import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import CustomReviewTopContent from '../../components/CustomReviewTopContent';
import * as utils from '../../utils';

const SHA_ATTACHMENT_ID = 'L023';

const shaDocument = {
  name: 'SHA-PartA.pdf',
  confirmationCode: 'abc-123',
  attachmentId: SHA_ATTACHMENT_ID,
};

const nonShaDocument = {
  name: 'other-evidence.pdf',
  confirmationCode: 'def-456',
  attachmentId: 'L015',
};

const buildState = ({
  featureFlagEnabled = true,
  additionalDocuments = [],
} = {}) => ({
  form: {
    data: {
      disability526NewBddShaEnforcementWorkflowEnabled: featureFlagEnabled,
      additionalDocuments,
    },
  },
});

const renderComponent = state => {
  const store = createStore(() => state);
  return render(
    <Provider store={store}>
      <CustomReviewTopContent />
    </Provider>,
  );
};

describe('CustomReviewTopContent', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders the SHA alert when isBDD, feature flag enabled, and no SHA document uploaded', () => {
    sandbox.stub(utils, 'isBDD').returns(true);
    const state = buildState({
      additionalDocuments: [],
    });

    const { container, getByText } = renderComponent(state);

    expect(container.querySelector('va-alert')).to.exist;
    getByText('A Separation Health Assessment (SHA) Part A is required');
    getByText(/If you do not include a SHA Part A/);
    getByText("Check if you've uploaded a SHA Part A document");
  });

  it('renders the SHA alert when only non-SHA documents are uploaded', () => {
    sandbox.stub(utils, 'isBDD').returns(true);
    const state = buildState({
      additionalDocuments: [nonShaDocument],
    });

    const { container } = renderComponent(state);

    expect(container.querySelector('va-alert')).to.exist;
  });

  it('does not render when SHA document has been uploaded', () => {
    sandbox.stub(utils, 'isBDD').returns(true);
    const state = buildState({
      additionalDocuments: [shaDocument],
    });

    const { container } = renderComponent(state);

    expect(container.querySelector('va-alert')).to.not.exist;
  });

  it('does not render when isBDD is false', () => {
    sandbox.stub(utils, 'isBDD').returns(false);
    const state = buildState({
      additionalDocuments: [],
    });

    const { container } = renderComponent(state);

    expect(container.querySelector('va-alert')).to.not.exist;
  });

  it('does not render when the feature flag is disabled', () => {
    sandbox.stub(utils, 'isBDD').returns(true);
    const state = buildState({
      featureFlagEnabled: false,
      additionalDocuments: [],
    });

    const { container } = renderComponent(state);

    expect(container.querySelector('va-alert')).to.not.exist;
  });

  it('does not render when all conditions are false', () => {
    sandbox.stub(utils, 'isBDD').returns(false);
    const state = buildState({
      featureFlagEnabled: false,
      additionalDocuments: [shaDocument],
    });

    const { container } = renderComponent(state);

    expect(container.querySelector('va-alert')).to.not.exist;
  });
});
