import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ElectronicSignature from '../../../components/ComposeForm/ElectronicSignature';
import { ElectronicSignatureBox } from '../../../util/constants';
import { inputVaTextInput } from '../../../util/testUtils';

describe('ElectronicSignature', () => {
  it('renders without errors', () => {
    const screen = render(<ElectronicSignature />);
    expect(screen).to.exist;
  });

  it('displays the correct heading', () => {
    const screen = render(<ElectronicSignature />);
    const heading = screen.findByText(ElectronicSignatureBox.TITLE, {
      selector: 'h2',
    });
    expect(heading).to.exist;
  });

  it('renders a text input with the label "Your full name"', () => {
    render(<ElectronicSignature />);
    const textInput = document.querySelector('va-text-input');
    expect(textInput).to.have.attribute(
      'label',
      ElectronicSignatureBox.FULLNAME_LABEL,
    );
  });

  it('calls a function when the text input value changes', async () => {
    const onChange = sinon.spy();
    const screen = render(<ElectronicSignature onChange={onChange} />);
    const val = 'John Doe';
    inputVaTextInput(screen.container, val);
    await waitFor(() => {
      expect(document.querySelector('va-text-input')).to.have.value(val);
    });
  });

  it(`renders a checkbox with the label "${
    ElectronicSignatureBox.CHECKBOX_LABEL
  }"`, () => {
    render(<ElectronicSignature />);
    const checkbox = document.querySelector('va-checkbox');
    expect(checkbox).to.have.attribute(
      'label',
      ElectronicSignatureBox.CHECKBOX_LABEL,
    );
  });
});
