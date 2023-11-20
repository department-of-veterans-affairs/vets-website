import React from 'react';
import PropTypes from 'prop-types';

const ItemsBlock = props => {
  const { heading, intro, itemType, items, renderItem, showSeparators } = props;

  if (!items || items.length === 0) {
    return null;
  }

  const listItems = items.map((item, idx) => {
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
      {intro && <p>{intro}</p>}
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
