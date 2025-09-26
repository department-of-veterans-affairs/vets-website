import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import * as sinon from 'sinon';
import { ShowPdfPassword } from 'platform/forms-system/src/js/utilities/file/ShowPdfPassword';
import * as validatePdfPasswordModule from 'platform/forms-system/src/js/utilities/file/validatePdfPassword';

const clickAdd = container => {
  const btn = container.querySelector('va-button');
  btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
};

const buildFile = () => ({
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
});

describe('ShowPdfPassword component', () => {
  let stub;

  afterEach(() => {
    if (stub) stub.restore();
    if (typeof sinon.restore === 'function') {
      sinon.restore();
    }
  });

  it('shows validation error for empty submission', async () => {
    stub = sinon.stub(validatePdfPasswordModule, 'default');

    const onSubmitPassword = sinon.spy();
    const { container } = render(
      <ShowPdfPassword
        file={buildFile()}
        index={0}
        onSubmitPassword={onSubmitPassword}
      />,
    );

    clickAdd(container);

    await waitFor(() => {
      const wc = container.querySelector('va-text-input');
      expect(wc).to.exist;
      expect(wc.getAttribute('error')).to.eq(
        'Please provide a password to decrypt this file',
      );
    });
    expect(onSubmitPassword.called).to.be.false;
    expect(stub.called).to.be.false;
  });

  it('accepts correct password (client validated)', async () => {
    stub = sinon
      .stub(validatePdfPasswordModule, 'default')
      .resolves({ valid: true });

    const onSubmitPassword = sinon.spy();
    const { container } = render(
      <ShowPdfPassword
        file={buildFile()}
        index={1}
        onSubmitPassword={onSubmitPassword}
        testVal="secret"
      />,
    );

    clickAdd(container);

    await waitFor(() => {
      expect(onSubmitPassword.calledOnce).to.be.true;
    });
    expect(stub.calledOnce).to.be.true;
  });

  it('shows incorrect password error', async () => {
    stub = sinon
      .stub(validatePdfPasswordModule, 'default')
      .resolves({ valid: false, error: 'Incorrect password' });

    const onSubmitPassword = sinon.spy();
    const { container } = render(
      <ShowPdfPassword
        file={buildFile()}
        index={2}
        onSubmitPassword={onSubmitPassword}
        testVal="bad"
      />,
    );

    clickAdd(container);

    await waitFor(() => {
      const wc = container.querySelector('va-text-input');
      expect(wc).to.exist;
      expect(wc.getAttribute('error')).to.eq('Incorrect password');
    });
    expect(onSubmitPassword.called).to.be.false;
    expect(stub.calledOnce).to.be.true;
  });

  it('skips client validation on generic error (treated as valid)', async () => {
    stub = sinon
      .stub(validatePdfPasswordModule, 'default')
      .resolves({ valid: true, skipped: true });

    const onSubmitPassword = sinon.spy();
    const { container } = render(
      <ShowPdfPassword
        file={buildFile()}
        index={3}
        onSubmitPassword={onSubmitPassword}
        testVal="pw"
      />,
    );

    clickAdd(container);

    await waitFor(() => {
      expect(onSubmitPassword.calledOnce).to.be.true;
    });
    expect(stub.calledOnce).to.be.true;
  });
});
