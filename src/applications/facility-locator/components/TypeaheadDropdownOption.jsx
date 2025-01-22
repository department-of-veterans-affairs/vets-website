import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const optionClasses = selected =>
  classNames('dropdown-option', { selected });

// exported for Downshift that uses a string to display and select the item, also used here for the display
export const toDisplay = item =>
  typeof item === 'string' ? item : item?.toDisplay || '';

function TypeaheadDropdownOption({
  highlightedIndex,
  index,
  item,
  getItemProps,
}) {
  return (
    <div
      key={`${item.id}-${index}`}
      {...getItemProps({
        item: item.id,
        className: optionClasses(index === highlightedIndex),
        role: 'option',
        'aria-selected': index === highlightedIndex,
      })}
    >
      {toDisplay(item)}
    </div>
  );
}

TypeaheadDropdownOption.propTypes = {
  getItemProps: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  highlightedIndex: PropTypes.number, // something may not be higlighted - optional from Downshift
};

export default TypeaheadDropdownOption;
