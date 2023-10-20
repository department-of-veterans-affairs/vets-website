import React from 'react';
import PropTypes from 'prop-types';

const SeparatedItemsBlock = props => {
  const { heading, intro, itemType, items, renderItem } = props;

  if (!items || items.length === 0) {
    return null;
  }

  const listItems = items.map(item => {
    return (
      <>
        {renderItem(item)}
        {items.length > 1 && <hr />}
      </>
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

export default SeparatedItemsBlock;

SeparatedItemsBlock.propTypes = {
  heading: PropTypes.string,
  intro: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  itemType: PropTypes.string,
  items: PropTypes.array,
  renderItem: PropTypes.func,
};
