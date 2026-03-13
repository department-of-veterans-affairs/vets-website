import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const optionClasses = selected =>
  classNames('dropdown-option', { selected });

function AutosuggestOption({
  highlightedIndex,
  index,
  item,
  getItemProps,
  itemToString,
}) {
  const role = item.isError ? 'alert' : 'option';
  const itemInfo = {
    item,
    className: optionClasses(index === highlightedIndex),
    role,
  };

  // Only add aria-selected if the item is not disabled/error
  // This prevents aria-selected="false" on disabled items which is an accessibility issue
  if (!item.disabled && !item.isError) {
    itemInfo['aria-selected'] = index === highlightedIndex;
  }

  return (
    <li
      {...getItemProps(itemInfo)}
      data-testid={`autosuggest-option-${item.id || `${item}-${index}`}`}
    >
      {itemToString(item)}
    </li>
  );
}

AutosuggestOption.propTypes = {
  getItemProps: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  itemToString: PropTypes.func.isRequired,
  highlightedIndex: PropTypes.number, // something may not be higlighted - optional from Downshift
};

export default AutosuggestOption;
