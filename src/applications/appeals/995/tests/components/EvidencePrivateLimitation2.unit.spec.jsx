import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import EvidencePrivateLimitation2 from '../../components/EvidencePrivateLimitation2';
import { content } from '../../content/evidencePrivateLimitation';

describe('<EvidencePrivateLimitation>', () => {
  const setup = ({
    data = {},
    goBack = () => {},
    goForward = () => {},
    setFormData = () => {},
  } = {}) =>
    render(
      <div>
        <EvidencePrivateLimitation2
          data={data}
          goBack={goBack}
          goForward={goForward}
          setFormData={setFormData}
          contentAfterButtons="before"
          contentBeforeButtons="after"
        />
      </div>,
    );

  it('should render', () => {
    const { container } = setup();

    expect($('va-textarea', container)).to.exist;
    expect($('va-additional-info', container)).to.not.exist;
    expect($$('button', container).length).to.eq(2);
  });

  it('should submit page without error', () => {
    const goSpy = sinon.spy();
    const { container } = setup({
      goForward: goSpy,
      data: { limitedConsent: 'lorem ipsum' },
    });

    // Can't pass a value with event, we see an error:
    // "The given element does not have a value setter"
    fireEvent.input($('va-textarea', container));
    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.true;
  });

  it('should submit with some textarea content', () => {
    const setFormDataSpy = sinon.spy();
    const { container } = setup({
      setFormData: setFormDataSpy,
      data: { limitedConsent: 'lorem ipsum' },
    });

    fireEvent.input($('va-textarea', container));
    expect(setFormDataSpy.called).to.be.true;
  });

  it('should not submit and show an error with no textarea content', async () => {
    const goSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const { container } = setup({
      setFormData: setFormDataSpy,
      goForward: goSpy,
      data: { limitedConsent: '' },
    });

    fireEvent.input($('va-textarea', container));
    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.false;

    await waitFor(() => {
      expect($('va-textarea').getAttribute('error')).to.eq(
        content.errorMessage,
      );
    });
  });

  it('should call goBack', () => {
    const goSpy = sinon.spy();
    const { container } = setup({
      goBack: goSpy,
      data: { limitedConsent: '' },
    });

    fireEvent.click($('button.usa-button-secondary', container));
    expect(goSpy.called).to.be.true;
  });
});
