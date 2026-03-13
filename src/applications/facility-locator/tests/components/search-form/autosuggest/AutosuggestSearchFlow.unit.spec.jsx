import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';
import Autosuggest from '../../../../components/search-form/autosuggest';

const MIN_SEARCH_CHARS = 3;

const mockOptions = [
  {
    id: 'place.265169132',
    toDisplay: 'Porter Ranch, California, United States',
  },
  {
    id: 'place.265349356',
    toDisplay: 'Port Hueneme, California, United States',
  },
  {
    id: 'place.265210092',
    toDisplay: 'Porterville, California, United States',
  },
  { id: 'place.265464044', toDisplay: 'Portland, Oregon, United States' },
  {
    id: 'place.265971948',
    toDisplay: 'Portsmouth, Virginia, United States',
  },
];

// Stateful wrapper that provides geocoding results synchronously when the
// input meets the minimum character threshold. Mirrors AddressAutosuggest's
// option-providing and error-state behavior without the async Mapbox search.
// eslint-disable-next-line react/prop-types -- test-only wrapper, PropTypes not needed
function SearchFlowWrapper({ onSelectSpy, onClearSpy }) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [wasCleared, setWasCleared] = useState(false);

  const hasMinChars = !!inputValue && inputValue.length >= MIN_SEARCH_CHARS;
  const showError = wasCleared && !inputValue;

  return (
    <Autosuggest
      inputId="street-city-state-zip"
      inputValue={inputValue}
      onInputValueChange={e => {
        const val = e.inputValue || '';
        setInputValue(val);
        if (val) setWasCleared(false);
        setOptions(val.length >= MIN_SEARCH_CHARS ? mockOptions : []);
      }}
      handleOnSelect={changes => {
        if (changes?.selectedItem) {
          onSelectSpy?.(changes.selectedItem);
        }
      }}
      label={<span>Enter a zip code or a city and state</span>}
      options={options}
      onClearClick={() => {
        setInputValue('');
        setOptions([]);
        setWasCleared(true);
        onClearSpy?.();
      }}
      showError={showError}
      keepDataOnBlur
      showDownCaret={false}
      shouldShowNoResults
      showOptionsRestriction={hasMinChars}
    />
  );
}

describe('Autosuggest address search results flow', () => {
  it('displays 5 geocoding results when a search term is typed', () => {
    const screen = render(<SearchFlowWrapper />);
    const input = screen.getByRole('combobox');

    userEvent.type(input, 'Port');

    const dropdown = screen.getByTestId('autosuggest-options');
    expect(dropdown).to.be.displayed;
    expect(dropdown.children.length).to.equal(5);
    expect(screen.getByText('Porter Ranch, California, United States')).to
      .exist;
    expect(screen.getByText('Port Hueneme, California, United States')).to
      .exist;
    expect(screen.getByText('Porterville, California, United States')).to.exist;
    expect(screen.getByText('Portland, Oregon, United States')).to.exist;
    expect(screen.getByText('Portsmouth, Virginia, United States')).to.exist;
  });

  it('highlights the second option after pressing ArrowDown twice', () => {
    const screen = render(<SearchFlowWrapper />);
    const input = screen.getByRole('combobox');

    userEvent.type(input, 'Port');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const secondOption = screen.getByTestId(
      'autosuggest-option-place.265349356',
    );
    expect(secondOption.className).to.include('selected');
  });

  it('populates input with selected option value on Enter', () => {
    const onSelect = sinon.spy();
    const screen = render(<SearchFlowWrapper onSelectSpy={onSelect} />);
    const input = screen.getByRole('combobox');

    userEvent.type(input, 'Port');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(input.value).to.equal('Port Hueneme, California, United States');
    expect(onSelect.calledOnce).to.be.true;
    expect(onSelect.firstCall.args[0].toDisplay).to.equal(
      'Port Hueneme, California, United States',
    );
  });

  it('clears input and shows error state when clear button is clicked', () => {
    const onClear = sinon.spy();
    const screen = render(<SearchFlowWrapper onClearSpy={onClear} />);
    const input = screen.getByRole('combobox');

    userEvent.type(input, 'Port');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    fireEvent.click(screen.getByTestId('street-city-state-zip-clear-button'));

    expect(input.value).to.equal('');
    expect(onClear.calledOnce).to.be.true;
    const container = screen.getByTestId('autosuggest-container');
    expect(container.className).to.include('usa-input-error');
  });
});
