import React from 'react';
import { allFieldsEmpty } from '../utils';
import type { ItemsBlockProps } from '../types';

const ItemsBlock: React.FC<ItemsBlockProps> = ({ 
  heading, 
  intro, 
  itemType, 
  items, 
  renderItem, 
  showSeparators 
}) => {
  if (!items) return null;

  // Filter out null/empty field values.
  let listItems = items.filter((item: any) => !allFieldsEmpty(item));
  if (!listItems.length) return null;

  const listElements = listItems.map((item: any, idx: number) => {
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