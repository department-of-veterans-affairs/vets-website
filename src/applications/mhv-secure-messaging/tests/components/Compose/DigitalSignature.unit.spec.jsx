import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import DigitalSignature from '../../../components/ComposeForm/DigitalSignature';
import { inputVaTextInput } from '../../../util/testUtils';

describe('DigitalSignature', () => {
  it('renders without errors', () => {
    const screen = render(<DigitalSignature />);
    expect(screen).to.exist;
  });

  it('displays the correct heading', () => {
    const screen = render(<DigitalSignature />);
    const heading = screen.findByText('Digital signature', { selector: 'h2' });
    expect(heading).to.exist;
  });

  it('renders a text input with the label "Your full name"', () => {
    render(<DigitalSignature />);
    const textInput = document.querySelector('va-text-input');
    expect(textInput).to.have.attribute('label', 'Your full name');
  });

  it('calls a function when the text input value changes', async () => {
    const onChange = sinon.spy();
    const screen = render(<DigitalSignature onChange={onChange} />);
    const val = 'John Doe';
    inputVaTextInput(screen.container, val);
    await waitFor(() => {
      expect(document.querySelector('va-text-input')).to.have.value(val);
    });
  });
});
