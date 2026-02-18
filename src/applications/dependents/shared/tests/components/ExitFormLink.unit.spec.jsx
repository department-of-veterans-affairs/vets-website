import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import * as utils from '../../utils/api';
import ExitForm from '../../components/ExitFormLink';

describe('ExitForm', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    if (sandbox) {
      sandbox.restore();
    }
  });

  it('should render an exit form action link with correct text', () => {
    const { container } = render(<ExitForm text="exit test" href="/test" />);

    const linkAction = $('va-link-action', container);
    expect(linkAction).to.exist;
    expect(linkAction.getAttribute('text')).to.eq('exit test');
    expect(linkAction.getAttribute('href')).to.eq('/test');
  });

  it('should render an exit form button with correct title and subtitle', () => {
    const { container } = render(
      <ExitForm text="exit test" href="/test" useButton />,
    );

    const button = $('va-button[continue]', container);
    expect(button).to.exist;
    expect(button.getAttribute('text')).to.eq('exit test');
    expect(button.getAttribute('submit')).to.eq('prevent');
  });

  it('should delete the in-progress form & redirect', async () => {
    const deleteInProgressFormStub = sandbox
      .stub(utils, 'deleteInProgressForm')
      .resolves();
    const assignSpy = sinon.spy();
    const { container } = render(
      <ExitForm
        formId="test123"
        location={{ assign: assignSpy }}
        href="/test"
        useButton
      />,
    );

    fireEvent.click($('va-button.exit-form', container));

    await waitFor(() => {
      expect(deleteInProgressFormStub.calledWith('test123')).to.be.true;
      expect(assignSpy.calledWith('/test')).to.be.true;
    });
  });

  it('should only redirect (not delete in progress form) when no formId is present', async () => {
    const deleteInProgressFormStub = sandbox
      .stub(utils, 'deleteInProgressForm')
      .resolves();
    const assignSpy = sinon.spy();
    const { container } = render(
      <ExitForm location={{ assign: assignSpy }} href="/test" />,
    );

    fireEvent.click($('va-link-action.exit-form', container));

    await waitFor(() => {
      expect(assignSpy.calledWith('/test')).to.be.true;
      expect(deleteInProgressFormStub.called).to.be.false;
    });
  });
});
