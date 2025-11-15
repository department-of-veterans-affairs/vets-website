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
  const itemProps = {
    item,
    className: optionClasses(index === highlightedIndex),
    role: 'option',
  };

  // Only add aria-selected if the item is not disabled/error
  // This prevents aria-selected="false" on disabled items which is an accessibility issue
  if (!item.disabled && !item.isError) {
    itemProps['aria-selected'] = index === highlightedIndex;
  }

  return (
    <p
      {...getItemProps(itemProps)}
      data-testid={`autosuggest-option-${item.id || `${item}-${index}`}`}
    >
      {itemToString(item)}
    </p>
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
