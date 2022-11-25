import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';

import SignatureInput from '../../../components/PreSubmitInfo/SignatureInput';

describe('CG <SignatureInput>', () => {
  const fullName = {
    first: 'John',
    middle: '',
    last: 'Smith',
  };

  it('should render Signature Input for representative', () => {
    const view = render(
      <SignatureInput
        fullName={fullName}
        label=""
        showError={false}
        isRepresentative
        setSignatures={() => {}}
        isChecked={false}
      />,
    );

    expect(view.container.querySelector('va-text-input')).to.have.attribute(
      'label',
      'Enter your name to sign as the Veteran’s representative',
    );
  });

  it('should render Signature Input for veteran', () => {
    const view = render(
      <SignatureInput
        fullName={fullName}
        label="Veteran’s"
        showError={false}
        isRepresentative={false}
        setSignatures={() => {}}
        isChecked={false}
      />,
    );

    expect(view.container.querySelector('va-text-input')).to.have.attribute(
      'label',
      'Veteran’s full name',
    );
  });

  it.skip('should show error without a matching representative signature', () => {
    const view = render(
      <SignatureInput
        fullName={fullName}
        label="Veteran’s"
        showError
        isRepresentative
        setSignatures={() => {}}
        isChecked={false}
      />,
    );

    userEvent.type(
      view.container.querySelector('va-text-imput.signature-input'),
      'Mary Jane',
    );

    expect(view.container.querySelector('va-text-input')).to.have.attribute(
      'error',
      'You must sign as representative.',
    );
  });

  it.skip('should show error without a matching veteran signature', () => {
    const view = render(
      <SignatureInput
        fullName={fullName}
        label="Veteran’s"
        showError
        isRepresentative={false}
        setSignatures={() => {}}
        isChecked={false}
      />,
    );

    userEvent.type(
      view.container.querySelector('va-text-imput.signature-input'),
      'Mary Jane',
    );

    // Note: when testing, the literal string seems to put an extra space for no middleName,
    // hence John  Smith in the test and not John Smith.
    // When running the application it shows with only one space.

    expect(view.container.querySelector('va-text-input')).to.have.attribute(
      'error',
      'Your signature must match previously entered name: John  Smith',
    );
  });
});
