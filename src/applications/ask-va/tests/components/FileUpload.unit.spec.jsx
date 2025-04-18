import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import FileUpload from '../../components/FileUpload';
import * as StorageAdapterModule from '../../utils/StorageAdapter';
import { createMockStore } from '../common';

describe('<FileUpload />', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox
      .stub(StorageAdapterModule.StorageAdapter.prototype, 'get')
      .resolves([]);
    sandbox
      .stub(StorageAdapterModule.StorageAdapter.prototype, 'set')
      .resolves([]);
    sandbox.stub(StorageAdapterModule, 'askVAAttachmentStorage').value({
      get: () => Promise.resolve([]),
      set: () => Promise.resolve(),
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('allows the user to add a file', async () => {
    const store = createMockStore();
    const screen = render(
      <Provider store={store}>
        <FileUpload />
      </Provider>,
    );

    const file = new File(['hello'], 'hello.png', {
      type: 'image/png',
      size: 1024,
    });
    const input = screen.getByTestId(/askVA_upload_/);

    input.__events.vaChange({
      detail: { files: [file] },
      srcElement: {
        'data-testid': input.getAttribute('data-testid'),
      },
    });
    input.uploadedFile = file;

    await waitFor(() => {
      expect(input.uploadedFile.name).to.equal('hello.png');
    });
  });
});
