import React from 'react';
import PropTypes from 'prop-types';
import TypeaheadDropdownOption from './TypeaheadDropdownOption';

function TypeaheadDropdownOptions({
  getItemProps,
  highlightedIndex,
  options,
  isShown,
  itemToString,
}) {
  if (!isShown || !options.length) {
    return null;
  }

  return (
    <div className="dropdown" role="listbox">
      {options.map((item, index) => (
        <TypeaheadDropdownOption
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

TypeaheadDropdownOptions.propTypes = {
  getItemProps: PropTypes.func.isRequired,
  isShown: PropTypes.bool.isRequired,
  itemToString: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  highlightedIndex: PropTypes.number, // something may not be higlighted - optional from Downshift
};

export default TypeaheadDropdownOptions;
