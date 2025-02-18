import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import Autosuggest from '../../components/Autosuggest';

describe('<Autosuggest inputId="any">', () => {
  it('Autosuggest should clear when clicked.', () => {
    let input = 'any';
    const onClear = () => {
      input = '';
    };
    const screen = render(
      <Autosuggest
        inputId="any"
        options={[]}
        inputValue={input}
        onClearClick={onClear}
      />,
    );
    expect(screen.getByTestId('clear-button')).to.be.displayed;
    fireEvent.click(screen.getByTestId('clear-button'));
    expect(input).to.equal('');
  });

  it('Autosuggest should keep when input blurred.', () => {
    let input = 'any';
    const onClear = () => {
      input = '';
    };
    const screen = render(
      <Autosuggest
        inputId="any"
        options={[]}
        inputValue={input}
        onClearClick={onClear} // also gets called on blur when not keepDataOnBlur
        keepDataOnBlur
        showDownCaret
      />,
    );
    expect(screen.getByTestId('input-with-clear')).to.be.displayed;
    fireEvent.focus(screen.getByTestId('input-with-clear'));
    fireEvent.blur(screen.getByTestId('input-with-clear'));
    fireEvent.click(screen.getByTestId('down-caret'));
    expect(input).to.equal('any');
  });
});
