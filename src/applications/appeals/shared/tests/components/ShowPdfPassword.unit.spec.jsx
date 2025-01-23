import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { ShowPdfPassword } from '../../components/ShowPdfPassword';

import errorMessages from '../../content/errorMessages';

describe('ShowPdfPassword', () => {
  const buttonClick = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  });

  const cancelButton = (callback = () => {}) => (
    <va-button class="cancel" text="Cancel" onClick={callback} />
  );

  const getProps = (
    onSubmitPassword = () => {},
    cancelCallback = () => {},
  ) => ({
    file: { name: 'foo' },
    index: 0,
    onSubmitPassword,
    cancelButton: cancelButton(cancelCallback),
  });

  it('should render', () => {
    const props = getProps();
    const { container } = render(<ShowPdfPassword {...props} />);
    expect($('va-text-input', container)).to.exist;
    expect($('va-button.add-password', container)).to.exist;
    expect($('va-button.cancel', container)).to.exist;
    expect($('va-text-input', container)).to.exist;
    expect($$('va-button', container).length).to.eq(2);
  });

  it('should show validation error', () => {
    const props = getProps();
    const { container } = render(<ShowPdfPassword {...props} />);
    fireEvent.click($('va-button.add-password', container), buttonClick);

    expect($('va-text-input', container)).to.have.attr(
      'error',
      errorMessages.upload,
    );
  });

  it('should call cancel', () => {
    let undef;
    const cancelSpy = sinon.spy();
    const props = getProps(undef, cancelSpy);
    const { container } = render(<ShowPdfPassword {...props} />);
    fireEvent.click($('va-button.cancel', container), buttonClick);

    expect(cancelSpy.called).to.be.true;
  });

  it('should not call onSubmitPassword', () => {
    const submitSpy = sinon.spy();
    const props = getProps(submitSpy);
    const { container } = render(<ShowPdfPassword {...props} />);

    fireEvent.click($('va-button', container), buttonClick);

    expect($('va-text-input', container)).to.have.attr('error');
    expect(props.onSubmitPassword.called).to.be.false;
  });

  it('should call input & blur', async () => {
    const props = getProps();
    const { container } = render(<ShowPdfPassword {...props} />);

    const input = $('va-text-input', container);

    input.value = 'name';
    await fireEvent.input(input, { target: { name: 'name' } });
    await fireEvent.blur(input); // code coverage
  });

  it('should call onSubmitPassword', () => {
    const submitSpy = sinon.spy();
    const props = getProps(submitSpy);
    const { container } = render(<ShowPdfPassword {...props} testVal="1234" />);

    fireEvent.click($('va-button', container), buttonClick);

    expect($('va-text-input', container)).to.not.have.attr('error');
    expect(props.onSubmitPassword.calledOnce).to.be.true;
    expect(props.onSubmitPassword.args[0]).to.deep.equal([
      { name: 'foo' },
      0,
      '1234',
    ]);
  });
});
