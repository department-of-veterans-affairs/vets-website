import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import Autosuggest from '../../../../components/search-form/autosuggest';

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
    expect(screen.getByTestId('any-clear-button')).to.be.displayed;
    fireEvent.click(screen.getByTestId('any-clear-button'));
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
    expect(screen.getByTestId('any-input-with-clear')).to.be.displayed;
    fireEvent.focus(screen.getByTestId('any-input-with-clear'));
    fireEvent.blur(screen.getByTestId('any-input-with-clear'));
    fireEvent.click(screen.getByTestId('any-down-caret'));
    expect(input).to.equal('any');
  });
});
