import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import uploadRequiredDocuments from '../../../../../config/chapters/00-required-documents/uploadRequiredDocuments';

const { uiSchema, schema } = uploadRequiredDocuments;

// Validation function extracted directly from uiSchema
const validate = uiSchema['view:noUploadWarning']['ui:validations'][0];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const makeErrors = () => ({ addError: sinon.spy() });

const makeStore = (formData = {}) =>
  createStore(() => ({
    form: { data: formData },
    featureToggles: { survivorsBenefitsIdp: false },
    user: { login: { currentlyLoggedIn: false } },
  }));

// ---------------------------------------------------------------------------
// Validation function unit tests (pure, no React needed)
// ---------------------------------------------------------------------------

describe('uploadRequiredDocuments — ui:validations', () => {
  it('calls addError when no files and warningShown is absent', () => {
    const errors = makeErrors();
    validate(errors, {}, { files: [] });
    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.include('upload at least one');
  });

  it('calls addError when files is undefined and warningShown is absent', () => {
    const errors = makeErrors();
    validate(errors, {}, {});
    expect(errors.addError.calledOnce).to.be.true;
  });

  it('does NOT call addError when files are present', () => {
    const errors = makeErrors();
    validate(errors, {}, { files: [{ name: 'dd214.pdf' }] });
    expect(errors.addError.called).to.be.false;
  });

  it('does NOT call addError when warningShown is true even without files', () => {
    const errors = makeErrors();
    validate(errors, { warningShown: true }, { files: [] });
    expect(errors.addError.called).to.be.false;
  });

  it('does NOT call addError when fieldValue is null and files are present', () => {
    const errors = makeErrors();
    validate(errors, null, { files: [{ name: 'doc.pdf' }] });
    expect(errors.addError.called).to.be.false;
  });
});

// ---------------------------------------------------------------------------
// Page render tests
// ---------------------------------------------------------------------------

describe('uploadRequiredDocuments — page render', () => {
  it('renders the page heading', () => {
    const store = makeStore();
    const screen = render(
      <Provider store={store}>
        <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />
      </Provider>,
    );
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: "Submit Veteran's DD214 and death certificate",
      }),
    ).to.exist;
  });

  it('renders a file input element', () => {
    const store = makeStore();
    const { container } = render(
      <Provider store={store}>
        <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />
      </Provider>,
    );
    // The file upload web component renders in some form in the container
    const hasFileInput =
      container.querySelector('va-file-input-multiple') ||
      container.querySelector('[name="root_files"]') ||
      container.querySelector('input[type="file"]');
    expect(hasFileInput).to.exist;
  });
});
