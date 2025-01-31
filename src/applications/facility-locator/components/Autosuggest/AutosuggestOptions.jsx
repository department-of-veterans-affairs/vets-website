import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function AutosuggestOptions({
  getItemProps,
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
}) {
  // All an option is required to have is an id, toDisplay, and optionally disabled
  // Anything else is up to the user. The `id` is used for the key and that's why it is required
  const [optionsToShow, setOptionsToShow] = useState([]);
  useEffect(
    () => {
      if (isLoading) {
        setOptionsToShow([
          { id: '', disabled: true, toDisplay: loadingMessage },
        ]);
      } else if (!options?.length && shouldShowNoResults) {
        setOptionsToShow([
          { id: '', disabled: true, toDisplay: noItemsMessage },
        ]);
      } else {
        setOptionsToShow(options);
      }
    },
    [options, noItemsMessage, shouldShowNoResults, isLoading, loadingMessage],
  );

  return (
    <div
      className="dropdown"
      {...getMenuProps()}
      style={{ display: isShown && optionsToShow?.length ? 'block' : 'none' }}
    >
      {optionsToShow.map((item, index) => (
        <AutosuggestOptionComponent
          key={item.id}
          item={item}
          index={index}
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          itemToString={itemToString}
        />
      ))}
    </div>
  );
}

AutosuggestOptions.propTypes = {
  getItemProps: PropTypes.func.isRequired,
  getMenuProps: PropTypes.func.isRequired,
  isShown: PropTypes.bool.isRequired,
  itemToString: PropTypes.func.isRequired,
  noItemsMessage: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  shouldShowNoResults: PropTypes.bool.isRequired,
  AutosuggestOptionComponent: PropTypes.elementType,
  highlightedIndex: PropTypes.number, // something may not be higlighted - optional from Downshift
  isLoading: PropTypes.bool,
  loadingMessage: PropTypes.string,
};

export default AutosuggestOptions;
