import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import * as utils from '../../utils/api';
import ExitFormLink from '../../components/ExitFormLink';

describe('ExitFormLink', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    if (sandbox) {
      sandbox.restore();
    }
  });

  it('should render the exit form with correct title and subtitle', () => {
    const { container } = render(
      <ExitFormLink text="exit test" href="/test" />,
    );

    const linkAction = $('va-link-action', container);
    expect(linkAction).to.exist;
    expect(linkAction.getAttribute('text')).to.eq('exit test');
    expect(linkAction.getAttribute('href')).to.eq('/test');
  });

  it('should delete the in-progress form & redirect', async () => {
    const deleteInProgressFormStub = sandbox
      .stub(utils, 'deleteInProgressForm')
      .resolves();
    const assignSpy = sinon.spy();
    const { container } = render(
      <ExitFormLink
        formId="test123"
        location={{ assign: assignSpy }}
        href="/test"
      />,
    );

    fireEvent.click($('.exit-form', container));

    await waitFor(() => {
      expect(deleteInProgressFormStub.calledWith('test123')).to.be.true;
      expect(assignSpy.calledWith('/test')).to.be.true;
    });
  });

  it('should only redirect when no formId is present', async () => {
    const deleteInProgressFormStub = sandbox
      .stub(utils, 'deleteInProgressForm')
      .resolves();
    const assignSpy = sinon.spy();
    const { container } = render(
      <ExitFormLink location={{ assign: assignSpy }} href="/test" />,
    );

    fireEvent.click($('.exit-form', container));

    await waitFor(() => {
      expect(assignSpy.calledWith('/test')).to.be.true;
      expect(deleteInProgressFormStub.called).to.be.false;
    });
  });
});
