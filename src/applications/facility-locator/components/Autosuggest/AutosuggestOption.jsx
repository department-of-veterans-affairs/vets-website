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
  return (
    <div
      {...getItemProps({
        item,
        className: optionClasses(index === highlightedIndex),
        role: 'option',
        'aria-selected': index === highlightedIndex,
      })}
      data-testid={`autosuggest-option-${item.id || `${item}-${index}`}`}
    >
      {itemToString(item)}
    </div>
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
