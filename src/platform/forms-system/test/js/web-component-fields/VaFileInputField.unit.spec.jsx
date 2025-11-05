import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import VaFileInputField from '../../../src/js/web-component-fields/VaFileInputField';
import * as helpers from '../../../src/js/web-component-fields/vaFileInputFieldHelpers';

// Basic Redux store mock
const makeStore = dispatchStub => ({
  getState: () => ({ form: { formId: 'TEST-FORM', data: {} } }),
  subscribe: () => {},
  dispatch: dispatchStub || (() => {}),
});

const makeProps = () => ({
  uiOptions: {
    accept: '.pdf,.jpeg,.png',
    fileUploadUrl: 'https://api.va.test/upload',
    formNumber: 'TEST-FORM',
  },
  childrenProps: {
    idSchema: { $id: 'root_uploadedFile' },
    formData: {},
    errorSchema: {},
    schema: { type: 'object', maxLength: 100, minLength: 0 },
    onChange: sinon.spy(),
    onBlur: sinon.spy(),
  },
});

const makeFile = (name = 'encrypted.pdf', type = 'application/pdf') => {
  const blob = new Blob(['%PDF-1.7'], { type });
  return new File([blob], name, { type, lastModified: Date.now() });
};

// Allow time for debounced password handler (component uses 500ms debounce)
const DEBOUNCE_WAIT = 600;

describe('VaFileInputField - encrypted PDF password flow', () => {
  let getFileErrorStub;
  const stubs = [];

  beforeEach(() => {
    getFileErrorStub = sinon.stub(helpers, 'getFileError').resolves({
      fileError: null,
      encryptedCheck: true,
    });
    stubs.push(getFileErrorStub);

    // We do NOT stub uploadScannedForm; component instrumentation (lastUpload) records intent pre-dispatch
  });

  afterEach(() => {
    stubs.forEach(s => s.restore && s.restore());
  });

  function waitForAddPasswordButton() {
    return new Promise(resolve => {
      const check = () => {
        if (document.querySelector('va-button[text="Add password"]')) {
          resolve();
          return;
        }
        setTimeout(check, 10);
      };
      check();
    });
  }

  it('does not upload while typing; uploads after Add password click', async () => {
    const store = makeStore(action => {
      if (typeof action === 'function') action(() => {});
    });
    const props = makeProps();
    let harness = {};
    props.uiOptions.testHarness = a => {
      harness = a;
    };

    render(
      <Provider store={store}>
        <VaFileInputField {...props} />
      </Provider>,
    );

    harness.triggerFile(makeFile());
    await waitForAddPasswordButton();
    harness.triggerPassword(' secret ');
    await new Promise(r => setTimeout(r, DEBOUNCE_WAIT));
    if (harness.getState) {
      const st = harness.getState();
      expect(st.hasFileWithPassword, 'Harness state: file not flagged').to.be
        .true;
      expect(st.pendingPassword).to.equal(' secret ');
    }
    const stateBefore = harness.getState();
    expect(stateBefore.lastUpload, 'Upload executed before confirmation').to.be
      .null;
    harness.clickAddPassword();
    await new Promise(r => setTimeout(r, 120));
    const stateAfter = harness.getState();
    expect(stateAfter.lastUpload, 'Upload did not execute after confirmation')
      .to.not.be.null;
    expect(stateAfter.lastUpload.password).to.equal(' secret ');
  });

  it('shows error (no upload) when Add password clicked with empty value', async () => {
    const dispatchSpy = sinon.spy();
    const store = makeStore(dispatchSpy);
    const props = makeProps();
    let harness = {};
    props.uiOptions.testHarness = a => {
      harness = a;
    };

    render(
      <Provider store={store}>
        <VaFileInputField {...props} />
      </Provider>,
    );
    harness.triggerFile(makeFile());
    await waitForAddPasswordButton();
    harness.clickAddPassword();
    await new Promise(r => setTimeout(r, 0));
    expect(dispatchSpy.called, 'Upload dispatched despite missing password').to
      .be.false;
  });
});
