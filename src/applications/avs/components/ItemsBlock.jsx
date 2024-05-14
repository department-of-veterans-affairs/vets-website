import React from 'react';
import PropTypes from 'prop-types';

import { allFieldsEmpty } from '../utils';

const ItemsBlock = props => {
  const { heading, intro, itemType, items, renderItem, showSeparators } = props;

  if (!items) return null;

  // Filter out null/empty field values.
  let listItems = items.filter(item => !allFieldsEmpty(item));
  if (!listItems.length) return null;

  listItems = listItems.map((item, idx) => {
    return (
      <div key={idx}>
        {renderItem(item)}
        {items.length > 1 && showSeparators && <hr />}
      </div>
    );
  });

  return (
    <div data-testid={itemType}>
      <h3>{heading}</h3>
      {intro && <div>{intro}</div>}
      <div>{listItems}</div>
    </div>
  );
};

export default ItemsBlock;

ItemsBlock.propTypes = {
  heading: PropTypes.string,
  intro: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  itemType: PropTypes.string,
  items: PropTypes.array,
  renderItem: PropTypes.func,
  showSeparators: PropTypes.bool,
};
