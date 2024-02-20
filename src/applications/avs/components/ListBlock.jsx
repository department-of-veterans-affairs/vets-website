import React from 'react';
import PropTypes from 'prop-types';

import { fieldHasValue } from '../utils';

const ListBlock = props => {
  const {
    heading,
    headingLevel = 3,
    items,
    itemType,
    keyName,
    itemName = null,
  } = props;
  if (!Array.isArray(items)) return null;

  // Filter out null/empty field values.
  let listItems =
    items.filter(item => {
      const fieldValue = itemName ? item[itemName] : item;
      return fieldHasValue(fieldValue);
    }) || [];

  if (!listItems.length) return null;

  listItems = items.map((item, idx) => {
    const key = typeof item === 'object' ? item[keyName] : idx;
    const value = typeof item === 'object' ? item[itemName] : item;

    return <li key={key}>{value}</li>;
  });

  const Heading = `h${headingLevel}`;
  return (
    <div>
      <Heading>{heading}</Heading>
      <ul data-testid={itemType}>{listItems}</ul>
    </div>
  );
};

export default ListBlock;

ListBlock.propTypes = {
  heading: PropTypes.string.isRequired,
  itemType: PropTypes.string.isRequired,
  headingLevel: PropTypes.number,
  itemName: PropTypes.string,
  items: PropTypes.array,
  keyName: PropTypes.string,
};
