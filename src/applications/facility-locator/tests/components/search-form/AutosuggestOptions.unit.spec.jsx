import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import AutosuggestOptions from '../../../components/search-form/autosuggest/AutosuggestOptions';
import AutosuggestOption from '../../../components/search-form/autosuggest/AutosuggestOption';
import { itemToString } from '../../../components/search-form/autosuggest/helpers';

/**
 * getItemProps,
  highlightedIndex,
  options,
  isShown,
  isLoading,
  loadingMessage,
  itemToString,
  getMenuProps,
  noItemsMessage,
  shouldShowNoResults,
  AutosuggestOptionComponent,
 */
const emptyObj = () => ({});

describe('<AutosuggestOptions getMenuProps={emptyObj} getItemProps={emptyObj} >', () => {
  it('AutosuggestOptions should render with one option.', async () => {
    const screen = render(
      <AutosuggestOptions
        getItemProps={emptyObj}
        getMenuProps={emptyObj}
        isShown
        isLoading={false}
        loadingMessage="Searching..."
        highlightedIndex={-1}
        noItemsMessage="No items found"
        itemToString={item => item.toDisplay}
        options={[{ id: '1', toDisplay: 'one' }]}
        shouldShowNoResults={false}
        AutosuggestOptionComponent={AutosuggestOption}
      />,
    );

    expect(screen.getByTestId('autosuggest-options')).to.be.displayed;
    expect(screen.getByTestId('autosuggest-option-1')).to.exist;
    expect(screen.getByText('one')).to.exist;
  });

  it('AutosuggestOptions should render with no options but loading.', async () => {
    const screen = render(
      <AutosuggestOptions
        getItemProps={emptyObj}
        getMenuProps={emptyObj}
        isShown
        isLoading
        loadingMessage="Searching..."
        highlightedIndex={-1}
        noItemsMessage="No items found"
        itemToString={item => item.toDisplay}
        options={[]}
        shouldShowNoResults={false}
        AutosuggestOptionComponent={AutosuggestOption}
      />,
    );
    expect(screen.getByTestId('autosuggest-options')).to.be.displayed;
    expect(screen.getByTestId('autosuggest-option-loading')).to.exist;
    expect(screen.getByText('Searching...')).to.exist; // as defined above
  });

  it('AutosuggestOptions should render with no options but loading.', async () => {
    const screen = render(
      <AutosuggestOptions
        getItemProps={emptyObj}
        getMenuProps={emptyObj}
        isShown
        isLoading={false}
        loadingMessage="Searching..."
        highlightedIndex={-1}
        noItemsMessage="No items found"
        itemToString={item => item.toDisplay}
        options={[]}
        shouldShowNoResults
        AutosuggestOptionComponent={AutosuggestOption}
      />,
    );
    expect(screen.getByTestId('autosuggest-options')).to.be.displayed;
    expect(screen.getByTestId('autosuggest-option-no-items')).to.exist;
    expect(screen.getByText('No items found')).to.exist; // as defined above
  });

  it('AutosuggestOptions should render with no children - since isShown but no items', async () => {
    const screen = render(
      <AutosuggestOptions
        getItemProps={emptyObj}
        getMenuProps={emptyObj}
        isShown
        isLoading={false}
        loadingMessage="Searching..."
        highlightedIndex={-1}
        noItemsMessage="No items found"
        itemToString={item => item.toDisplay}
        options={[]}
        shouldShowNoResults={false}
        AutosuggestOptionComponent={AutosuggestOption}
      />,
    );
    expect(screen.getByTestId('autosuggest-options')).to.exist;
    expect(screen.getByTestId('autosuggest-options')).to.not.be.displayed;
  });

  it('AutosuggestOptions should not render - since !isShown.', async () => {
    const screen = render(
      <AutosuggestOptions
        getItemProps={emptyObj}
        getMenuProps={emptyObj}
        isShown={false}
        isLoading={false}
        loadingMessage="Searching..."
        highlightedIndex={-1}
        noItemsMessage="No items found"
        itemToString={item => item.toDisplay}
        options={[{ id: '1', toDisplay: 'one' }]} // but will be overridden by isShown
        shouldShowNoResults={false}
        AutosuggestOptionComponent={AutosuggestOption}
      />,
    );
    expect(screen.getByTestId('autosuggest-option-1')).to.exist;
    expect(screen.getByTestId('autosuggest-options')).to.not.be.displayed;
  });

  it('AutosuggestOptions should render if options are strings not objects with id and toDisplay.', async () => {
    const screen = render(
      <AutosuggestOptions
        getItemProps={emptyObj}
        getMenuProps={emptyObj}
        isShown
        isLoading={false}
        loadingMessage="Searching..."
        highlightedIndex={-1}
        noItemsMessage="No items found"
        itemToString={itemToString}
        options={['a', 'b', 'c']}
        shouldShowNoResults={false}
        AutosuggestOptionComponent={AutosuggestOption}
      />,
    );
    expect(screen.getByTestId('autosuggest-options')).to.be.displayed;
    expect(screen.getByTestId('autosuggest-option-a-0')).to.exist;
    expect(screen.getByTestId('autosuggest-option-b-1')).to.exist;
    expect(screen.getByTestId('autosuggest-option-c-2')).to.exist;
  });
});
