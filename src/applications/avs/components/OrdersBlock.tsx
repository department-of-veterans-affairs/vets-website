import React from 'react';
// @ts-ignore - No type definitions available for lodash
import { kebabCase } from 'lodash';
import { ORDER_TYPES } from '../utils/constants';
import type { OrdersBlockProps, Order } from '../types';

const getOrderItems = (type: any, orders?: Order[]): Order[] => {
  return orders?.filter(order => order.type === type.label) || [];
};

const getOrderListItemsByType = (type: any, orders?: Order[]): React.ReactNode[] => {
  const items = getOrderItems(type, orders);
  return (
    items?.map((item, idx) => {
      let itemText = item.text;
      if (type === ORDER_TYPES.LAB) itemText += ` (${item.date})`;
      return <li key={idx}>{itemText}</li>;
    }) || []
  );
};

const OrdersBlock: React.FC<OrdersBlockProps> = ({ heading, intro, orders, type }) => {
  const orderListItems = getOrderListItemsByType(type, orders);

  if (orderListItems.length) {
    return (
      <div>
        <h4>{heading}</h4>
        {intro && <div>{intro}</div>}
        <ul className="bulleted-list" data-testid={kebabCase(type.label)}>
          {orderListItems}
        </ul>
      </div>
    );
  }

  return null;
};

export default OrdersBlock;