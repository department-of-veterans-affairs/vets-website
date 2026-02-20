import React from 'react';
// @ts-expect-error - No type definitions available for lodash
import { kebabCase } from 'lodash';
import { ORDER_TYPES } from '../utils/constants';
import type { OrdersBlockProps, Order } from '../types';
import type { OrderType } from '../utils/constants';

const getOrderItems = (type: OrderType, orders?: Order[]): Order[] => {
  return orders?.filter(order => order.type === type.label) || [];
};

const getOrderListItemsByType = (
  type: OrderType,
  orders?: Order[],
): React.ReactNode[] => {
  const items = getOrderItems(type, orders);
  return (
    items?.map((item, idx) => {
      let itemText = item.text || '';
      if (type === ORDER_TYPES.LAB && item.date) {
        itemText += ` (${item.date})`;
      }
      return <li key={idx}>{itemText}</li>;
    }) || []
  );
};

const OrdersBlock: React.FC<OrdersBlockProps> = ({
  heading,
  intro,
  orders,
  type,
}) => {
  const orderListItems = getOrderListItemsByType(type, orders);

  if (orderListItems.length) {
    return (
      <div>
        <h4>{heading}</h4>
        {intro && <div>{intro}</div>}
        <ul
          className="bulleted-list"
          data-testid={(kebabCase as (str: string) => string)(type.label)}
        >
          {orderListItems}
        </ul>
      </div>
    );
  }

  return null;
};

export default OrdersBlock;
