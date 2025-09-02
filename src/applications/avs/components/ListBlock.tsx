import React from 'react';
import { fieldHasValue } from '../utils';
import type { ListBlockProps } from '../types';

const ListBlock: React.FC<ListBlockProps> = ({
  heading,
  headingLevel = 3,
  items,
  itemType,
  keyName,
  itemName = null,
}) => {
  if (!Array.isArray(items)) return null;

  // Filter out null/empty field values.
  let listItems =
    items.filter((item: any) => {
      const fieldValue = itemName ? item[itemName] : item;
      return fieldHasValue(fieldValue);
    }) || [];

  if (!listItems.length) return null;

  const listElements = items.map((item: any, idx: number) => {
    const key = typeof item === 'object' ? item[keyName || 'id'] : idx;
    const value = typeof item === 'object' ? item[itemName || 'name'] : item;

    return <li key={key}>{value}</li>;
  });

  const Heading = `h${headingLevel}` as keyof JSX.IntrinsicElements;
  return (
    <div>
      <Heading>{heading}</Heading>
      <ul data-testid={itemType}>{listElements}</ul>
    </div>
  );
};

export default ListBlock;