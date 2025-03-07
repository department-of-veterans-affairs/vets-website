import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import Autosuggest from '../../../../components/search-form/autosuggest';

describe('<Autosuggest inputId="any">', () => {
  it('Autosuggest should render with input with down caret.', () => {
    const screen = render(
      <Autosuggest inputId="any" inputValue="" options={[]} showDownCaret />,
    );
    expect(screen.getByTestId('down-caret')).to.be.displayed;
  });

  it('Autosuggest should render with input without down caret.', () => {
    const screen = render(
      <Autosuggest
        inputId="any"
        inputValue="any"
        options={[]}
        showDownCaret={false}
      />,
    );
    // no down-caret test id
    expect(screen.queryAllByTestId('down-caret')).to.be.have.lengthOf(0);
  });
});
