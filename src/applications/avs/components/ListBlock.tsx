import React from 'react';
import { fieldHasValue } from '../utils';
import type { ListBlockProps } from '../types';

// Type for list items that can be objects or primitive values
type ListItem = Record<string, unknown> | string | number;

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
  const listItems =
    items.filter((item: unknown) => {
      const typedItem = item as ListItem;
      const fieldValue =
        itemName && typeof typedItem === 'object' && typedItem !== null
          ? typedItem[itemName]
          : typedItem;
      return fieldHasValue(fieldValue);
    }) || [];

  if (!listItems.length) return null;

  const listElements = listItems.map((item: unknown, idx: number) => {
    const typedItem = item as ListItem;
    const key =
      typeof typedItem === 'object' && typedItem !== null
        ? (typedItem[keyName || 'id'] as string | number) ?? idx
        : idx;
    const value =
      typeof typedItem === 'object' && typedItem !== null
        ? (typedItem[itemName || 'name'] as string | number) ?? typedItem
        : typedItem;

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
