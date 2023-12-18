import React from 'react';
import PropTypes from 'prop-types';

import { fieldHasValue } from '../utils';

const ListBlock = props => {
  const { heading, items, itemType, keyName, itemName } = props;

  // Filter out null/empty field values.
  let listItems = items?.filter(item => fieldHasValue(item[itemName])) || [];

  if (!listItems.length) return null;

  listItems = items.map((item, idx) => {
    const key = typeof item === 'object' ? item[keyName] : idx;
    const value = typeof item === 'object' ? item[itemName] : item;

    return <li key={key}>{value}</li>;
  });

  return (
    <div>
      <h3>{heading}</h3>
      <ul data-testid={itemType}>{listItems}</ul>
    </div>
  );
};

export default ListBlock;

ListBlock.propTypes = {
  heading: PropTypes.string.isRequired,
  itemType: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  itemName: PropTypes.string,
  keyName: PropTypes.string,
};
