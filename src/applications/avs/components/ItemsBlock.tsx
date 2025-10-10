import React from 'react';
import { allFieldsEmpty } from '../utils';
import type { ItemsBlockProps } from '../types';

const ItemsBlock = <T = unknown,>({
  heading,
  intro,
  itemType,
  items,
  renderItem,
  showSeparators,
}: ItemsBlockProps<T>) => {
  if (!items) return null;

  // Filter out null/empty field values.
  const listItems = items.filter(
    item => !allFieldsEmpty(item as Record<string, unknown>),
  );
  if (!listItems.length) return null;

  const listElements = listItems.map((item, idx: number) => {
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
      <div>{listElements}</div>
    </div>
  );
};

export default ItemsBlock;
